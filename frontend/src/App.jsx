import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import StartInterviewForm from "./Pages/StartInterviewForm";
import ResumeInterview from "./Pages/ResumeInterview";
import { Toaster } from "react-hot-toast";
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
        <Route />
      </Routes>
    </>
  );
};

export default App;
