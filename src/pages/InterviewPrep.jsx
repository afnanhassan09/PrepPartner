"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const InterviewPrep = () => {
  const [progress, setProgress] = useState({
    plan: 0,
    prep: 0,
    practice: 0,
    mock: 0,
  });

  // Simulating progress fetch from localStorage or an API
  useEffect(() => {
    const storedProgress = localStorage.getItem("interviewProgress");
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  const prepSteps = [
    {
      title: "PLAN",
      description: "Set your goals and timeline",
      link: "/plan",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 text-[#09363E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      title: "PREP",
      description: "Review essential materials",
      link: "/prep",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 text-[#09363E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      title: "PRACTICE",
      description: "Hone your skills with stations",
      link: "/practice-options",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 text-[#09363E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      ),
    },
    {
      title: "MOCK",
      description: "Simulate the real interview",
      link: "/mock-options",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4 text-[#09363E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-[#09363E] mb-12">
          Interview Preparation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {prepSteps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                {step.icon}
                <h2 className="text-2xl font-semibold mb-2 text-[#09363E]">
                  {step.title}
                </h2>
                <p className="text-muted mb-4">{step.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                  <div
                    className="bg-[#09363E] h-2.5 rounded-full"
                    style={{ width: `${progress[step.title.toLowerCase()]}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted mb-4">
                  {progress[step.title.toLowerCase()]}% Complete
                </p>
                <Link
                  to={step.link}
                  className="inline-flex items-center px-4 py-2 bg-[#09363E] text-white rounded-lg hover:bg-[#09363E]/90 transition-colors duration-300"
                >
                  {progress[step.title.toLowerCase()] === 100
                    ? "Review"
                    : "Continue"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Insights */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#09363E] mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-semibold text-[#09363E]">
                  PERFORMANCE
                </h2>
                <p className="text-muted">Analyze your progress and improve</p>
              </div>
            </div>
            <Link
              to="/performance"
              className="inline-flex items-center px-6 py-3 bg-[#09363E] text-white rounded-lg hover:bg-[#09363E]/90 transition-colors duration-300"
            >
              View Insights
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
