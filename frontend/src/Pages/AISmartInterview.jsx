import { useState, useEffect, useRef } from "react";
import { Mic, Send } from "lucide-react";

export default function AISmartInterview() {
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const sessionId = localStorage.getItem("sessionId");

  // Load Voices
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8989/session/questions/${sessionId}`,
        );

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchQuestions();
  }, [sessionId]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }

      setAnswer(finalTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setAnswer("");
      recognitionRef.current.start();
    }
  };

  const speakQuestion = (text) => {
    if (!text || isSpeaking) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance(text);

    const femaleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha"),
      ) || voices[0];

    speech.voice = femaleVoice;

    speech.onstart = () => videoRef.current?.play();
    speech.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (questions.length > 0 && canSpeak) {
      speakQuestion(questions[currentIndex]?.question);
      setCanSpeak(false);
    }
  }, [canSpeak, currentIndex, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      setCanSpeak(true);
    }
  }, [questions]);

  useEffect(() => {
    if (questions.length === 0) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  useEffect(() => {
    setTimeLeft(120);
  }, [currentIndex]);

  const handleNext = async () => {
    setAnswer("");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCanSpeak(true);
    } else {
      alert("Interview Completed 🎉");
      window.speechSynthesis.cancel();

      setTimeout(() => {
        window.location.href = "/evaluate-interview";
      }, 1500);
    }
  };

  return (
    <div className="h-screen bg-[#f5f7f9] flex items-center justify-center p-2 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[18px] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[300px] bg-[#fafafa] border-r border-gray-200 p-3 flex flex-col gap-3">
          {/* AI VIDEO */}
          <div className="overflow-hidden rounded-[14px] shadow-sm border border-gray-200">
            <video
              ref={videoRef}
              muted
              autoPlay
              loop
              playsInline
              className="w-full h-[180px] object-cover"
              src="female-ai.mp4"
            />
          </div>

          {/* STATUS CARD */}
          <div className="bg-white rounded-[14px] border border-gray-200 p-3 flex-1 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-[#4f46e5] mb-6 underline underline-offset-2">
                Interview Status
              </p>

              {/* TIMER */}
              <div className="flex justify-center items-center py-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 rotate-[-90deg]">
                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />

                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      stroke="#10b981"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={238}
                      strokeDashoffset={238 - (timeLeft / 120) * 238}
                      className="transition-all duration-1000"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
                    {timeLeft}s
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER STATS */}
            <div>
              <div className="border-t border-gray-200 mb-4" />

              <div className="grid grid-cols-2 text-center">
                <div>
                  <h2 className="text-lg font-bold text-emerald-600">
                    {currentIndex + 1}
                  </h2>

                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                    Current
                  </p>
                </div>

                <div className="border-l border-gray-200">
                  <h2 className="text-lg font-bold text-emerald-600">
                    {questions.length || 5}
                  </h2>

                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-3 md:p-4 bg-white flex flex-col">
          {/* HEADER */}
          <div className="mb-4">
            <h1 className="text-lg font-bold text-emerald-700 mb-4">
              AI Smart Interview
            </h1>

            {/* QUESTION BOX */}
            <div className="bg-[#f7f8fa] rounded-[18px] p-3 border border-gray-100">
              <p className="text-[10px] tracking-[3px] font-bold text-emerald-700 uppercase mb-2">
                Question {currentIndex + 1} Of {questions.length || 5}
              </p>

              <h2 className="text-base font-semibold text-gray-800 leading-relaxed">
                {questions[currentIndex]?.question ||
                  "Preparing your next question..."}
              </h2>
            </div>
          </div>

          {/* ANSWER BOX */}
          <div className="flex-1">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full h-full min-h-[220px] resize-none rounded-[14px] border border-gray-200 bg-[#fafafa] p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* FOOTER */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md ${
                isListening
                  ? "bg-red-500 text-white scale-105"
                  : "bg-black text-white hover:scale-105"
              }`}
            >
              <Mic size={18} fill={isListening ? "currentColor" : "none"} />
            </button>

            <button
              onClick={handleNext}
              className="flex-1 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {currentIndex === questions.length - 1
                ? "Finish Interview"
                : "Submit Answer"}

              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
