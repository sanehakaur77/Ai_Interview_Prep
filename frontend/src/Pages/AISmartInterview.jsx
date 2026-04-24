import { useState, useEffect, useRef } from "react";

export default function AISmartInterview() {
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);

  // 🎤 Speech to text
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const videoRef = useRef(null);
  const sessionId = localStorage.getItem("sessionId");

  // =============================
  // LOAD VOICES
  // =============================
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // =============================
  // FETCH QUESTIONS
  // =============================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8989/session/questions/${sessionId}`,
        );
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestions();
  }, []);

  // =============================
  // SPEECH TO TEXT SETUP
  // =============================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // =============================
  // TOGGLE MIC
  // =============================
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // =============================
  // SPEAK QUESTION
  // =============================
  const speakQuestion = (text) => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance(text);

    const femaleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      ) || voices[0];

    speech.voice = femaleVoice;
    speech.pitch = 1.5;
    speech.rate = 1;

    speech.onstart = () => {
      videoRef.current?.play();
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // =============================
  // AUTO SPEAK CONTROL
  // =============================
  useEffect(() => {
    if (questions.length > 0 && canSpeak && isAutoSpeak) {
      speakQuestion(questions[currentIndex]?.question);
      setCanSpeak(false);
    }
  }, [canSpeak, currentIndex, isAutoSpeak]);

  useEffect(() => {
    if (questions.length > 0) {
      setCanSpeak(true);
    }
  }, [questions]);

  // =============================
  // SUBMIT ANSWER API
  // =============================
  const submitAnswerToServer = async () => {
    try {
      if (!answer.trim()) return;

      await fetch(`http://localhost:8989/session/answer/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          answers: [
            {
              questionIndex: currentIndex,
              answer: answer,
            },
          ],
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // NEXT QUESTION
  // =============================
  const handleNext = async () => {
    await submitAnswerToServer();

    setAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCanSpeak(true);
    } else {
      alert("Interview Completed 🎉");
      window.speechSynthesis.cancel();
    }
  };

  // =============================
  // MANUAL SPEAK
  // =============================
  const manualSpeak = () => {
    speakQuestion(questions[currentIndex]?.question);
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f7f6] flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-5xl rounded-[1.8rem] shadow-lg border flex overflow-hidden min-h-[590px]">
        {/* LEFT SIDE */}
        <div className="w-[34%] p-5 flex flex-col gap-4 border-r">
          {/* VIDEO */}
          <div className="rounded-2xl overflow-hidden h-48 bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              src="female-ai.mp4"
            />
          </div>

          {/* AUTO SPEAK */}
          <button
            onClick={() => setIsAutoSpeak((prev) => !prev)}
            className={`px-4 py-2 rounded-full text-xs font-semibold ${
              isAutoSpeak
                ? "bg-emerald-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {isAutoSpeak ? "🔊 Auto Speak ON" : "🔇 Auto Speak OFF"}
          </button>

          {/* MANUAL SPEAK */}
          <button
            onClick={manualSpeak}
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold"
          >
            🔊 Speak Question
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-5 flex flex-col">
          <h2 className="text-lg font-bold text-emerald-700 mb-3">
            AI Smart Interview
          </h2>

          {/* QUESTION */}
          <div className="bg-[#f8fafb] rounded-2xl p-4 mb-4 border">
            <p className="text-[10px] font-semibold text-emerald-600 uppercase mb-1">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <h1 className="text-sm font-semibold text-slate-800">
              {questions[currentIndex]?.question || "Loading..."}
            </h1>
          </div>

          {/* 🎤 MIC BUTTON */}
          <button
            onClick={toggleListening}
            className={`mb-2 px-4 py-2 rounded-full text-xs font-semibold ${
              isListening ? "bg-red-500 text-white" : "bg-green-600 text-white"
            }`}
          >
            {isListening ? "🛑 Stop Speaking" : "🎤 Speak Answer"}
          </button>

          {/* ANSWER */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 p-4 bg-[#f8fafb] rounded-2xl outline-none text-sm"
            placeholder="Speak or type your answer..."
          />

          {/* NEXT */}
          <button
            onClick={handleNext}
            className="mt-3 bg-emerald-600 text-white h-[48px] rounded-full font-semibold"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
