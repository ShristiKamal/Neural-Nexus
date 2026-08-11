require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
res.json({
message: "TrendSpark AI Backend is running!",
});
});

app.post("/api/generate", async (req, res) => {
try {
const { topic } = req.body;


if (!topic || !topic.trim()) {
  return res.status(400).json({
    success: false,
    error: "Topic is required.",
  });
}

const prompt =
  "Create social media content about this topic: " +
  topic +
  "\n\n" +
  "Return ONLY valid JSON in exactly this format:\n\n" +
  "{\n" +
  '  "youtubeTitle": "YouTube title",\n' +
  '  "instagramCaption": "Instagram caption",\n' +
  '  "linkedinPost": "LinkedIn post",\n' +
  '  "xThread": "X/Twitter thread",\n' +
  '  "hashtags": "#AI #Technology #Innovation #Future #Trending",\n' +
  '  "seoKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5",\n' +
  '  "contentScore": 85\n' +
  "}\n\n" +
  "Do not use markdown. " +
  "Do not put the JSON inside code fences. " +
  "Do not add any text before or after the JSON.";

const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

let text = response.text.trim();

text = text.replace(/^```json\s*/i, "");
text = text.replace(/^```\s*/i, "");
text = text.replace(/\s*```$/i, "");

const generatedContent = JSON.parse(text);

res.json({
  success: true,
  data: generatedContent,
});


} catch (error) {
console.error("Gemini API Error:", error);


res.status(500).json({
  success: false,
  error: error.message || "Failed to generate content.",
});


}
});

const PORT = 5000;

app.listen(PORT, () => {
console.log("TrendSpark AI server running on http://localhost:" + PORT);
});
