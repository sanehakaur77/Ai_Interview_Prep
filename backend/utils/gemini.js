const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});
const generateQuestions = async (resumeText) => {
  const prompt = `
You are a professional interviewer.

Generate EXACTLY 7 questions:
- 5 Technical
- 1 Project
- 1 HR

Return ONLY JSON in this format:
{
  "questions": [
    { "type": "technical", "question": "..." }
  ]
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No valid JSON found in Gemini response");
  }

  const jsonString = text.slice(start, end + 1);

  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (err) {
    console.error("JSON Parse Failed:", jsonString);
    throw new Error("Invalid JSON from Gemini");
  }
};

const cleanText = (text) => {
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").slice(0, 1500);
};
async function evaluateInterview(qaData) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
you are provided with question answers and give the score 
based on total number of questions

IMPORTANT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No text before or after JSON

Schema:
{
  "results": [
    {
      "question": "string",
      "answer": "string",
      "score": number,
      "feedback": "string",
      "strengths": "string",
      "weaknesses": "string"
    }
  ],
  "overallScore": number,
  "overallFeedback": "string"
}

Data:
${JSON.stringify(qaData)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // 🔥 CLEAN GEMINI OUTPUT
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("❌ RAW GEMINI OUTPUT:\n", text);
    throw new Error("Gemini did not return valid JSON");
  }
}
module.exports = {
  generateQuestions,
  evaluateInterview,
};
