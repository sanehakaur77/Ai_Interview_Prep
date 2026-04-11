import { useState } from "react";
import axios from "axios";

const Upload = ({ setQuestions, setResumeUrl, navigate }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axios.post(
      "http://localhost:8989/api/resume/upload",
      formData,
    );

    setQuestions(res.data.questions);
    setResumeUrl(res.data.url);

    navigate("/interview");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Upload Resume 📄</h2>

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Upload & Start Interview 🚀
        </button>
      </div>
    </div>
  );
};

export default Upload;
