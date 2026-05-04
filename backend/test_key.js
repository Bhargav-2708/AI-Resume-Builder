require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env file");
    process.exit(1);
  }

  console.log("Testing Gemini API Key...");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("✅ Success! Gemini Response:", response.text());
  } catch (error) {
    console.error("❌ API Key Test Failed!");
    console.error("Error details:", error.message);
  }
}

testKey();
