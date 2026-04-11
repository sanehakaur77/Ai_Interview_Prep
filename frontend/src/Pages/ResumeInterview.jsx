import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ResumeInterview = () => {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const recognitionRef = useRef(null);

  // 🎤 SPEECH TO TEXT SETUP
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;

      // 👉 ONLY CURRENT ANSWER UPDATE
      setAnswer((prev) => prev + " " + text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startSpeech = () => {
    recognitionRef.current?.start();
  };

  // 🔊 SPEAK ONLY CURRENT QUESTION
  const speak = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel(); // ❌ stop old speech

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;

    window.speechSynthesis.speak(msg);
  };

  // 📤 UPLOAD RESUME + GET QUESTIONS
  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:8989/api/resume/upload",
      formData,
    );

    setResumeUrl(res.data.url);
    setQuestions(res.data.questions);

    // 🔥 FIRST QUESTION SPEAK
    speak(res.data.questions[0]?.question);
  };

  // 🔁 WHEN QUESTION CHANGES
  useEffect(() => {
    if (questions.length > 0) {
      speak(questions[index]?.question);
      setAnswer("");
    }
  }, [index]);

  // ➡️ NEXT QUESTION
  const nextQuestion = async () => {
    const updated = [...answers, answer];
    setAnswers(updated);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      alert("Interview Finished 🚀");

      await axios.post("http://localhost:8989/api/resume/provide-feedback", {
        questions,
        answers: updated,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 🟢 LEFT SIDE - RESUME */}
      <div className="w-1/2 bg-white border-r p-2">
        <h2 className="font-bold text-xl mb-2">📄 Resume</h2>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={uploadResume}
          className="bg-blue-500 text-white px-3 py-1 mt-2"
        >
          Upload
        </button>

        {/* PDF PREVIEW */}
        {resumeUrl && (
          <iframe src={resumeUrl} className="w-full h-[90%] mt-2" />
        )}
      </div>

      {/* 🔵 RIGHT SIDE - AI INTERVIEW */}
      <div className="w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold">🤖 AI Interview</h2>

          <p className="text-gray-600">
            Question {index + 1} / {questions.length}
          </p>

          {/* QUESTION */}
          <div className="bg-white p-4 mt-3 shadow">
            {questions[index]?.question}
          </div>
        </div>

        {/* ANSWER */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full h-32 border p-3"
          placeholder="Speak or type answer..."
        />

        {/* BUTTONS */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={startSpeech}
            className="bg-green-500 text-white px-4 py-2"
          >
            🎤 Speak
          </button>

          <button
            onClick={nextQuestion}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeInterview;
