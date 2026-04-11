const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

// 🧠 SMALL RESUME CLEANER (TOKEN SAVER)
const cleanText = (text) => {
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").slice(0, 1500); // 🔥 BIG TOKEN SAVING
};

// 🎯 1. QUESTIONS (LOW TOKEN PROMPT)
const generateQuestions = async (resumeText) => {
  const prompt = `
Make 2 interview questions.

Return JSON:
{"q":[{"t":"","q":""}]}

Resume:
${cleanText(resumeText)}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
};

// 🎯 2. FEEDBACK (LOW TOKEN PROMPT)
const generateFinalFeedback = async (questions, answers) => {
  const prompt = `
Rate interview.

Return JSON:
{
 "r":[{"q":"","a":"","s":0}],
 "o":0
}

Q:${JSON.stringify(questions)}
A:${JSON.stringify(answers)}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
};

module.exports = {
  generateQuestions,
  generateFinalFeedback,
};
