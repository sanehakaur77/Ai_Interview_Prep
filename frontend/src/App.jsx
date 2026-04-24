import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import StartInterviewForm from "./Pages/StartInterviewForm";
import ResumeInterview from "./Pages/ResumeInterview";
import { Toaster } from "react-hot-toast";
import Evaluate from "./Pages/Evaluate";
import EvaluateInterviewSession from "./Pages/EvaluateInterviewSession";
import AISmartInterview from "./Pages/AISmartInterview";
const App = () => {
  const isAuthorized = Boolean(localStorage.getItem("token"));
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={isAuthorized ? <Home /> : <Login />} />
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/start-interview" element={<StartInterviewForm />}></Route>
        <Route path="/interview" element={<ResumeInterview />} />
        <Route path="/evaluate" element={<Evaluate />} />
        <Route path="/smart-interview" element={<AISmartInterview />} />
        <Route
          path="/evaluate-interview"
          element={<EvaluateInterviewSession />}
        />
      </Routes>
    </>
  );
};

export default App;
