import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    // Note: The SDK doesn't have a direct listModels method on the genAI object usually, 
    // but we can try to hit the endpoint manually or check the error message again.
    // Actually, let's just try a few known ones.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`Model ${m} is WORKING`);
        } catch (e: any) {
            console.log(`Model ${m} FAILED: ${e.message}`);
        }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
