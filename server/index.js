require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://real-estate-chatbot-three.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));


const PORT = process.env.PORT || 5000;

// --- GROQ CONFIGURATION ---
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Reads the "gsk_..." key
  baseURL: "https://api.groq.com/openai/v1", // <--- THE IMPORTANT CHANGE
  timeout: 20000, 
});

const conversations = new Map();

// --- ROUTE 1: CHAT ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    let history = conversations.get(sessionId);
    
    // System Prompt
    if (!history) {
      history = [
        { 
          role: "system", 
          content: `You are a professional Real Estate Assistant. 
          Your ONE Goal is to collect these 5 details:
          1. Name
          2. Phone Number
          3. Budget
          4. Preferred Location
          5. Property Type (e.g., 2BHK, Villa)

          INSTRUCTIONS:
          - Ask for missing details one by one.
          - If the user gives all details at once, DO NOT ask again.
          - IMPORTANT: Do NOT append "<<<COMPLETE>>>" if you are currently asking a question.
          - ONLY append "<<<COMPLETE>>>" AFTER the user has provided the 5th and final detail and you are confirming it.
          - Example of CORRECT timing: "Great, I have noted your budget. <<<COMPLETE>>>".` 
        }
      ];
    }

    history.push({ role: "user", content: message });

    // Call Groq (Llama 3 Model)
    const completion = await openai.chat.completions.create({
        messages: history,
        // Groq Model ID (Fast & Smart)
        model: "llama-3.3-70b-versatile", 
    });

    const aiResponse = completion.choices[0].message.content;

    history.push({ role: "assistant", content: aiResponse });
    conversations.set(sessionId, history);

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('SERVER ERROR:', error.message);
    res.status(500).json({ error: "Server busy (Groq), please try again." });
  }
});

// --- ROUTE 2: EXTRACT DATA ---
app.post('/api/extract-data', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const history = conversations.get(sessionId);

    if (!history) return res.status(400).json({ error: "No conversation found" });

    const extractionPrompt = [
      ...history,
      { 
        role: "system", 
        content: `Extract details from the chat above. Return ONLY a JSON object:
        {
          "name": "User Name",
          "phone": "User Phone",
          "budget": "User Budget",
          "location": "User Location",
          "propertyType": "Property Type"
        }` 
      }
    ];

    const completion = await openai.chat.completions.create({
      messages: extractionPrompt,
      model: "llama-3.3-70b-versatile", // Use Groq here too
    });

    const rawText = completion.choices[0].message.content || "";
    let extractedData = {};

    // Safety Net for JSON parsing
    try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const textToParse = jsonMatch ? jsonMatch[0] : rawText;
        extractedData = JSON.parse(textToParse);
    } catch (e) {
        console.error("⚠️ JSON Parse Warning:", e.message);
        extractedData = { note: "Extraction incomplete" }; 
    }

    extractedData.timestamp = new Date().toISOString();
    console.log("✅ Extracted Data:", extractedData);

    if (process.env.N8N_WEBHOOK_URL) {
        try {
            await axios.post(process.env.N8N_WEBHOOK_URL, extractedData);
        } catch (err) {
            console.error("Webhook Error (ignored):", err.message);
        }
    }

    res.json(extractedData);

  } catch (error) {
    console.error('Extraction Error:', error.message);
    res.json({ success: false, error: "Extraction failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Groq Server running on port ${PORT}`);
});