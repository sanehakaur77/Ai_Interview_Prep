const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async ({
  jobRole,
  experience,
  interviewType,
  resumeText,
}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
You are an expert interviewer.

Create a ${interviewType || "general"} interview for a ${jobRole} with ${experience} experience.

Use the resume below:
${resumeText}

Rules:
- Ask exactly 15 questions
- 10 skill-based questions- programming concepts mentioned in resume
- 5 project-based questions (from resume) 
- Do NOT give answers
- Keep questions short
- Return ONLY JSON array

Format:
[
  { "question": "..." },
  { "question": "..." }
]
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanText = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(cleanText);
    } catch (err) {
      console.log("JSON parse failed, fallback used");

      // fallback: return raw text as array
      questions = [{ question: cleanText }];
    }

    return questions;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI question generation failed");
  }
};
// evaluate
const evaluateInterview = async (questions) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const formattedQA = questions
    .map(
      (q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || "No answer"}`,
    )
    .join("\n\n");
  const prompt = `
You are an expert interviewer.

Strictly return ONLY valid JSON. No markdown.

Format:
{
  "score": number,
  "feedback": [
    { "feedback": "...", "score": number }
  ],
  "summary": "..."
}

Interview:
${formattedQA}
`;
  const result = await model.generateContent(prompt);
  const text = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    return {
      score: 5,
      feedback: questions.map(() => ({
        feedback: "Evaluation failed",
        score: 5,
      })),
      summary: "Could not evaluate properly",
    };
  }
};
module.exports = { generateQuestions, evaluateInterview };
