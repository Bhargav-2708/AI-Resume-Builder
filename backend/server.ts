import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const dataFile = path.join(__dirname, 'resumes.json');
const usersFile = path.join(__dirname, 'users.json');

// Initialize data files if they don't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', time: new Date().toISOString() });
});

// Auth Routes
app.post('/api/register', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = { id: Date.now().toString(), email, password };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Simple token (base64 encoded email for demo purposes)
    const token = Buffer.from(email).toString('base64');
    res.json({ success: true, token, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(email).toString('base64');
    res.json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Resume Routes
app.get('/api/resumes', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const token = req.headers.authorization?.split(' ')[1];
    let userEmail = '';
    if (token) userEmail = Buffer.from(token, 'base64').toString('ascii');

    const userResumes = userEmail ? data.filter((r: any) => r.userId === userEmail) : data;
    res.json(userResumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read resumes' });
  }
});

app.post('/api/resumes', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const newResume = req.body;
    
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      newResume.userId = Buffer.from(token, 'base64').toString('ascii');
    }
    
    const existingIndex = data.findIndex((r: any) => r.id === newResume.id);
    if (existingIndex >= 0) {
      data[existingIndex] = newResume;
    } else {
      data.push(newResume);
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, resume: newResume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

app.delete('/api/resumes/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const filtered = data.filter((r: any) => r.id !== req.params.id);
    fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// ── Gemini AI Review Route ─────────────────────────────────────────
app.post('/api/ai-review', async (req, res) => {
  console.log('Received AI review request for:', req.body?.personal?.fullName || 'Unknown User');
  try {
    const resumeData = req.body;

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume data and return a structured JSON review.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "impactScore": <number 0-100>,
  "completenessScore": <number 0-100>,
  "summary": "<2-sentence overall summary of the resume quality>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "issues": [
    {
      "type": "error" | "warning" | "tip",
      "section": "<section name>",
      "message": "<clear description of the issue>",
      "fix": "<specific actionable advice to fix it>"
    }
  ]
}

Scoring guidelines:
- overallScore: weighted average considering all aspects
- atsScore: keyword density, standard section names, parsability
- impactScore: use of strong action verbs, quantified achievements, metrics
- completenessScore: all key sections filled (personal info, summary, experience, education, skills)

Provide 3-8 issues. Be specific, constructive, and actionable.`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    console.log('Gemini response received');
    
    const jsonStr = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const reviewResult = JSON.parse(jsonStr);

    res.json(reviewResult);
  } catch (error: any) {
    console.error('OpenAI API error details:', error);
    // Return a structured error so the UI stays alive
    res.json({
      overallScore: 0,
      atsScore: 0,
      impactScore: 0,
      completenessScore: 0,
      summary: "AI Review is currently unavailable due to an API configuration issue.",
      strengths: [],
      issues: [{
        type: "error",
        section: "System",
        message: "Gemini API returned an error: " + (error?.message || "Unknown error"),
        fix: "Ensure your Gemini API key is valid and has the 'Generative Language API' enabled."
      }]
    });
  }
});

// Serve static files from the frontend build
// process.cwd() works correctly for both ts-node (dev) and compiled JS (production)
const frontendPath = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'frontend/dist')
  : path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
