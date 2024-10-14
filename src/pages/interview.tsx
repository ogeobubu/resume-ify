import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiUsers } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosChatboxes } from "react-icons/io";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { interviewPrep, getUser } from "../api.ts";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

const Interview: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await getUser();
        localStorage.setItem(
          "resumeProfile",
          JSON.stringify(response.user)
        );
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    getProfile();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    maxSize: 1024 * 1024,
  });

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      jobTitle,
      jobDescription,
      interviewDate,
      resumeText: uploadedFile ? await fileToText(uploadedFile) : resumeText,
    };

    try {
      const response = await interviewPrep(formData);
      setQuestions(response.data.questions);
      setIsModalOpen(true);
      toast.success("Successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fileToText = async (file: File) => {
    const pdf = await getDocument(URL.createObjectURL(file)).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return text;
  };

  return (
    <div className="md:mt-16 bg-white-100 flex justify-center p-4">
      <div className="max-w-6xl w-full flex justify-center items-center flex-col">
        <div className="border border-solid border-grey-300 rounded-lg p-2 bg-white w-full mb-6 text-lg flex justify-between items-center">
          <img
            className="w-[150px] h-[50px] object-cover"
            src={logo}
            alt="logo"
          />
          <button
            className="bg-green-500 text-white font-bold py-1 px-6 rounded hover:bg-green-200"
            type="button"
          >
            Logout
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full md:gap-32 gap-6">
          <div className="flex flex-col gap-1">
            <div className="md:w-[300px] w-full border border-solid border-grey-100 rounded-lg text-[14px]">
              <h2 className="text-xl font-bold border-b-2 border-gray-200 py-2 mb-4">
                <span className="px-4 py-2 text-[14px] font-semibold">
                  Choose a service below
                </span>
              </h2>
              <ul className="list-disc pl-4 mt-2 px-4 flex flex-col gap-2 pb-3">
                <Link to="/interview-prep" className="flex gap-3 items-center">
                  <FiUsers size={20} />
                  <span>Interviews Prep</span>
                </Link>
                <Link to="/linkedin-review" className="flex gap-3 items-center">
                  <FaLinkedin size={20} />
                  <span>LinkedIn Profile Review</span>
                </Link>
                <Link to="/resume-review" className="flex gap-3 items-center">
                  <IoDocumentTextOutline size={20} />
                  <span>CV/Resume Builder</span>
                </Link>
                <Link
                  to="/career-advisor-chat"
                  className="flex gap-3 items-center"
                >
                  <IoIosChatboxes size={20} />
                  <span>Career Advisor Chat</span>
                </Link>
              </ul>
            </div>
          </div>

          <div className="border border-dashed border-grey-100 rounded-lg md:p-8 p-4 my-0">
            <h1 className="text-xl font-semibold">Interview Prep</h1>
            <p className="subtitle md:p-4 py-3">
              Interview Prep helps you get comprehensive access to possible
              questions and their answers in preparation for your next job
              interview.
            </p>
            <div className="border border-solid border-grey-100 rounded-lg p-4 my-5">
              <h1 className="text-2xl font-semibold py-3">
                New Interview Prep
              </h1>
              <form
                className="mt-4 p-2 flex flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="job-title"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    placeholder="Enter Job Title"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    autoComplete="jobTitle"
                  />
                </div>
                <div>
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    id="jobDescription"
                    placeholder="Enter Job Description"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid"
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    autoComplete="jobDescription"
                  />
                </div>
                <div>
                  <label
                    htmlFor="interview-date"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Interview Date
                  </label>
                  <input
                    type="date"
                    name="interviewDate"
                    id="interviewDate"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid text-gray-400"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    autoComplete="interviewDate"
                  />
                </div>

                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-green-500 p-16 text-center rounded-lg my-4"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-700">
                    Click to upload CV/Resume or drag and drop
                  </p>
                  <p className="text-gray-500">PDF, DOCX (max, 1mb)</p>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      {uploadedFile.name}
                    </p>
                  )}
                </div>

                {!uploadedFile && (
                  <div>
                    <label
                      htmlFor="resumeText"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Or paste CV/Resume Text
                    </label>
                    <textarea
                      id="resumeText"
                      rows={4}
                      value={resumeText}
                      onChange={handleTextChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid text-gray-400"
                      placeholder="Paste your CV/Resume text here"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 w-full ${
                    loading ? "bg-gray-400" : "bg-green-500"
                  } text-white font-bold py-2 rounded hover:bg-green-200`}
                >
                  {loading ? "Generating..." : "Generate Prep"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75 ">
          <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[80vh] w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Generated Questions</h2>
            <ul className="pl-5">
              {questions.map((question, index) => (
                <li key={index} className="mb-2">
                  {question}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
