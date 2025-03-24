"use client"

import React, { useState, useEffect } from 'react'

const Plan = () => {
  const [interviewDate, setInterviewDate] = useState("")
  const [notes, setNotes] = useState("")
  const [studyTopics, setStudyTopics] = useState([
    "Clinical Knowledge",
    "Communication Skills",
    "Ethics",
    "Patient Management",
    "Medical History",
    "Physical Examination",
    "Diagnostic Reasoning",
    "Treatment Planning",
  ])
  const [selectedTopics, setSelectedTopics] = useState({})
  const [casesCompleted, setCasesCompleted] = useState({})
  const [preparationStatus, setPreparationStatus] = useState("Not Started")
  const [showPopup, setShowPopup] = useState(true)
  const [activeTab, setActiveTab] = useState("timeline")

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const dates = generateDates()

  // Calculate preparation algorithm
  useEffect(() => {
    if (!interviewDate) {
      setPreparationStatus("Not Started")
      return
    }

    const topicsSelected = Object.keys(selectedTopics).length
    const casesCompletedCount = Object.values(casesCompleted).filter(Boolean).length

    if (topicsSelected > 6 && casesCompletedCount > 10) {
      setPreparationStatus("Good")
    } else if (topicsSelected > 3 && casesCompletedCount > 5) {
      setPreparationStatus("Okay")
    } else {
      setPreparationStatus("Needs Improvement")
    }
  }, [selectedTopics, casesCompleted, interviewDate])

  const handleTopicChange = (date, topic) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [date.toISOString().split("T")[0]]: topic,
    }))
  }

  const toggleCaseCompleted = (caseItem) => {
    setCasesCompleted((prev) => ({
      ...prev,
      [caseItem]: !prev[caseItem],
    }))
  }

  const cases = [
    "Chest Pain Case",
    "Diabetes Management",
    "Pediatric Fever",
    "Psychiatric Assessment",
    "Geriatric Care",
    "Pregnancy Complications",
    "Trauma Assessment",
    "Chronic Disease Management",
    "Emergency Triage",
    "Ethical Dilemma",
    "Communication Challenge",
    "Complex Diagnosis",
  ]

  // Timeline milestones
  const milestones = [
    {
      date: "2 months before",
      title: "Start Preparation",
      description: "Begin reviewing clinical knowledge and practice cases",
    },
    {
      date: "6 weeks before",
      title: "Mock Interviews",
      description: "Schedule practice interviews with peers or mentors",
    },
    { date: "1 month before", title: "Intensive Practice", description: "Daily case practice and knowledge review" },
    { date: "2 weeks before", title: "Final Review", description: "Focus on weak areas and communication skills" },
    {
      date: "1 week before",
      title: "Rest & Prepare",
      description: "Light review, ensure good sleep and mental preparation",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "bg-primary"
      case "Okay":
        return "bg-accent"
      case "Needs Improvement":
        return "bg-secondary"
      default:
        return "bg-muted"
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Status */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-teal leading-tight mb-4 md:mb-0">Interview Preparation Plan</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Preparation Status:</span>
            <span className={`px-3 py-1 rounded-full text-white font-medium ${getStatusColor(preparationStatus)}`}>
              {preparationStatus}
            </span>
          </div>
        </div>

        {/* Interview Date and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-teal mb-3">Interview Date</h2>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#F3C178]"
            />
            {interviewDate && (
              <div className="mt-2 text-center">
                <span className="text-lg font-medium text-teal">
                  {new Date(interviewDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <p className="text-gray-600 mt-1">
                  {Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-white">
            <h2 className="text-xl font-semibold text-teal mb-3">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal rounded-lg p-3 text-center">
                <span className="block text-3xl font-bold text-teal text-white">{Object.keys(selectedTopics).length}</span>
                <span className="text-sm ">Days Planned</span>
              </div>
              <div className="bg-teal rounded-lg p-3 text-center">
                <span className="block text-3xl font-bold ">
                  {Object.values(casesCompleted).filter(Boolean).length}
                </span>
                <span className="text-sm ">Cases Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-teal mb-3">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="Add your study notes here..."
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            className={`py-3 px-6 font-medium ${activeTab === "timeline" ? "text-teal border-b-2 border-teal" : "text-gray-600"}`}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === "calendar" ? "text-teal border-b-2 border-teal" : "text-gray-600"}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === "cases" ? "text-teal border-b-2 border-teal" : "text-gray-600"}`}
            onClick={() => setActiveTab("cases")}
          >
            Practice Cases
          </button>
        </div>

        {/* Timeline View */}
        {activeTab === "timeline" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-teal mb-6">ISCP Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] h-full w-1 bg-teal-200"></div>

              {/* Timeline items */}
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="md:w-1/2 flex justify-center md:justify-end md:pr-8">
                    <div
                      className={`bg-white border-2 ${index % 2 === 0 ? "border-teal-500" : "border-teal-500"} rounded-lg p-4 shadow-md w-full md:w-4/5`}
                    >
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full ${index % 2 === 0 ? "bg-teal-500" : "bg-teal-500"} text-white flex items-center justify-center font-bold`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center md:justify-start md:pl-8 mt-4 md:mt-0">
                    <div className="bg-teal-100 rounded-lg px-4 py-2 font-medium text-teal-800">
                      {milestone.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-teal mb-6">Study Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dates.slice(0, 15).map((date, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-teal-600 text-white p-2 text-center font-medium">{formatDate(date)}</div>
                  <div className="p-4">
                    <select
                      value={selectedTopics[date.toISOString().split("T")[0]] || ""}
                      onChange={(e) => handleTopicChange(date, e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-teal"
                    >
                      <option value="">Select a topic</option>
                      {studyTopics.map((topic, i) => (
                        <option key={i} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    {selectedTopics[date.toISOString().split("T")[0]] && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Suggested activities:</p>
                        <ul className="list-disc pl-5 mt-1">
                          <li>Review key concepts</li>
                          <li>Practice 2-3 cases</li>
                          <li>Self-assessment quiz</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Cases */}
        {activeTab === "cases" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-teal mb-6">Practice Cases Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((caseItem, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${casesCompleted[caseItem] ? "bg-primary/10 border-primary" : "hover:bg-secondary/10"}`}
                  onClick={() => toggleCaseCompleted(caseItem)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded border flex items-center justify-center mr-3 ${casesCompleted[caseItem] ? "bg-primary border-primary" : "border-muted"}`}
                    >
                      {casesCompleted[caseItem] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`font-medium ${casesCompleted[caseItem] ? "line-through text-primary" : "text-foreground"}`}
                    >
                      {caseItem}
                    </span>
                  </div>
                  {casesCompleted[caseItem] && (
                    <div className="mt-2 text-sm text-primary pl-9">Completed! Great job!</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a
            href="/interview-prep"
            className="bg-teal text-teal-foreground font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Interview Prep
          </a>
          <a
            href="/performance"
            className="bg-teal hover:bg-teal-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            View Performance
          </a>
        </div>
      </div>

      {/* Pop-Up Box */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-5 max-w-xs z-50 border-l-4 border-teal-500 animate-bounce">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-teal-800">Interview Prep Tips</h3>
            <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Remember to practice at least 2 cases daily for optimal preparation!
          </p>
          <div className="text-xs text-teal-600 font-medium">
            {preparationStatus === "Not Started"
              ? "Set your interview date to begin tracking your progress!"
              : `Your preparation is currently rated as: ${preparationStatus}`}
          </div>
        </div>
      )}
    </div>
  )
}

export default Plan

