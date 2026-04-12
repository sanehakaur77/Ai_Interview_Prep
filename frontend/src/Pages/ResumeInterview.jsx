import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Mic, Send, Upload, FileText } from "lucide-react";

const ResumeInterview = () => {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setAnswer((prev) => (prev ? prev + " " : "") + text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startSpeech = () => recognitionRef.current?.start();

  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };

  const uploadResume = async () => {
    if (!file) return alert("Please upload a resume first.");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:8989/api/resume/upload",
        formData,
      );

      setResumeUrl(res.data.url);
      setQuestions(res.data.questions || []);
      setIndex(0);

      if (res.data.questions?.length > 0) {
        speak(res.data.questions[0].q);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading.");
    }
  };

  useEffect(() => {
    if (questions[index]) {
      speak(questions[index].q);
      setAnswer("");
    }
  }, [index]);

  const nextQuestion = async () => {
    if (!answer.trim()) return alert("Please answer before continuing.");

    const updated = [...answers, answer];
    setAnswers(updated);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      alert("Interview completed.");

      await axios.post("http://localhost:8989/api/resume/provide-feedback", {
        questions,
        answers: updated,
      });
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col md:flex-row font-sans">
      {/* LEFT */}
      <div className="md:w-1/2 w-full bg-white border-r px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={18} /> Resume
          </h2>
        </div>

        <div className="space-y-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm border rounded-md p-2 bg-emerald-50"
          />

          <button
            onClick={uploadResume}
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md text-sm font-medium transition"
          >
            <Upload size={16} /> Upload Resume
          </button>
        </div>

        {resumeUrl && (
          <div className="mt-5 border rounded-lg overflow-hidden bg-white">
            <div className="px-3 py-2 text-xs text-gray-500 border-b bg-emerald-50">
              Resume Preview
            </div>
            <iframe
              src={resumeUrl}
              className="w-full h-[450px] md:h-[75vh]"
              title="resume"
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="md:w-1/2 w-full px-6 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Interview Session
            </h2>
            <span className="text-xs text-gray-500">
              {questions.length ? `${index + 1}/${questions.length}` : "0/0"}
            </span>
          </div>

          <div className="mt-4 border rounded-lg p-4 bg-white shadow-sm border-emerald-100">
            {questions.length > 0 ? (
              <>
                <p className="text-xs text-gray-500 mb-1">
                  {questions[index]?.t}
                </p>
                <p className="text-gray-900 leading-relaxed">
                  {questions[index]?.q}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Upload a resume to begin the interview.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or speak your answer here..."
            className="w-full h-32 border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={startSpeech}
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <Mic size={16} /> Use microphone
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
            >
              Next <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeInterview;
