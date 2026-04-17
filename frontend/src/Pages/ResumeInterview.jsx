import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Mic, Send, Upload, FileText, Loader2, Volume2 } from "lucide-react";

const ResumeInterview = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // ---------------- SPEECH TO TEXT ----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

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
    msg.rate = 0.95;
    window.speechSynthesis.speak(msg);
  };

  const uploadResume = async () => {
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8989/api/resume/upload",
        formData,
      );
      const qs = res.data.questions?.questions || [];
      setQuestions(qs);
      setIndex(0);
      if (qs.length > 0) speak(qs[0].question || qs[0]);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (!answer.trim()) return alert("Please provide an answer.");
    const currentQuestionText =
      typeof questions[index] === "object"
        ? questions[index].question
        : questions[index];
    const updatedQA = [...qaList, { question: currentQuestionText, answer }];
    setQaList(updatedQA);
    setAnswer("");

    if (index + 1 < questions.length) {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      speak(questions[nextIdx].question || questions[nextIdx]);
    } else {
      alert("Interview Completed");
      window.location.href = "/evaluate";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN: UPLOAD - Now matches height via flex flex-col */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="flex items-center gap-2 font-bold text-xl text-slate-700">
            <FileText className="text-emerald-600" /> Upload Resume
          </h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Upload your PDF to generate interview questions.
          </p>

          <div className="flex-1 flex flex-col justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-emerald-500 transition-colors text-center bg-slate-50 relative group">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Upload className="mx-auto text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
            <span className="text-sm font-medium text-slate-600">
              {file ? file.name : "Drag and drop or click to browse"}
            </span>
          </div>

          <button
            onClick={uploadResume}
            disabled={loading}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all shadow-md disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {loading ? "Processing..." : "Start Interview"}
          </button>
        </div>

        {/* RIGHT COLUMN: INTERVIEW */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-slate-700">AI Interview</h2>
            {questions.length > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {index + 1} / {questions.length}
              </span>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl min-h-[140px] flex flex-col justify-center relative">
            {questions.length > 0 ? (
              <>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  {questions[index]?.type || "Question"}
                </p>
                <p className="text-lg font-medium leading-relaxed text-slate-800 pr-8">
                  {questions[index]?.question || questions[index]}
                </p>
                <button
                  onClick={() =>
                    speak(questions[index]?.question || questions[index])
                  }
                  className="absolute top-4 right-4 text-slate-300 hover:text-emerald-600"
                >
                  <Volume2 size={18} />
                </button>
              </>
            ) : (
              <p className="text-slate-400 italic text-center">
                No interview active.
              </p>
            )}
          </div>

          <div className="mt-8 flex-1 flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2">
              Your Answer
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-4 flex-1 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 resize-none"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer here..."
              disabled={questions.length === 0}
            />

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={startSpeech}
                disabled={questions.length === 0}
                className={`flex items-center gap-2 font-semibold ${isListening ? "text-red-500 animate-pulse" : "text-emerald-600"}`}
              >
                <Mic size={20} /> {isListening ? "Listening..." : "Speak"}
              </button>

              <button
                onClick={nextQuestion}
                disabled={questions.length === 0}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95"
              >
                {index + 1 === questions.length ? "Finish" : "Next"}{" "}
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeInterview;
