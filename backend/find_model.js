require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Note: The SDK might not have a direct listModels, but we can try to fetch a known model or use the REST API
    // Actually, let's just try 'gemini-pro' (without the 1.0)
    console.log("Trying 'gemini-pro'...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("✅ Success with 'gemini-pro'!");
  } catch (e) {
    console.error("❌ Failed with 'gemini-pro':", e.message);
    try {
        console.log("Trying 'gemini-1.5-flash-latest'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log("✅ Success with 'gemini-1.5-flash-latest'!");
    } catch (e2) {
        console.error("❌ Failed with 'gemini-1.5-flash-latest':", e2.message);
    }
  }
}

listModels();
