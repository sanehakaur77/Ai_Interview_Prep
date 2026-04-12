const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});
const generateQuestions = async (resumeText) => {
  const prompt = `
30 interview questions from resume:
15 technical, 10 project, 5 HR.

JSON only:
{"questions":[{"type":"","question":""}]}

${resumeText}
`;

  const text = (await (await model.generateContent(prompt)).response).text();
  return JSON.parse(text);
};

const cleanText = (text) => {
  return text.replace(/\n/g, " ").replace(/\s+/g, " ").slice(0, 1500);
};

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
