import React, { useEffect, useState } from "react";

const PopupMenu = ({
  sections,
  selectedSection,
  setSelectedSection,
  setCurrentStation,
  APIService,
  setCurrentVideo,
  mainVideoRef,
  setIsMainVideoPlaying,
  setShowStartButton,
  setIsCountdownActive,
  setIsInterviewTimerActive,
  setTimeLeft,
  setInterviewTimeLeft,
  setMessages,
  setIsMenuOpen,
  formatTime,
  isMenuOpen,
  professionalJudgementData,
  setProfessionalJudgementData,
  setCurrentQuestionId,
  currentVideoRef,
  setShowAdditionalMaterial,
  currentScenarioRef,
}) => {
  // Add state to control initial positioning
  const [isPositioned, setIsPositioned] = useState(false);

  // Effect to ensure consistent positioning after initial render
  useEffect(() => {
    // Set a small timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setIsPositioned(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionClick = async (section) => {
    setSelectedSection(section);
    setCurrentStation(section);
    
    // Store the current scenario in ref for persistence
    currentScenarioRef.current = section;

    // For any scenario, reload the initial scenario
    try {
      console.log(`Loading ${section} scenario...`);
      const response = await APIService.getProfessionalJudgement({
        scenario: section,
        id: "start",
        start: true
      });

      console.log(`${section} Response:`, response);
      
      setProfessionalJudgementData(response);
      setCurrentQuestionId(response.question.id);

      // Automatically show Additional Material popup with the loaded data
      setShowAdditionalMaterial(true);

      // Set up the video
      const videoData = {
        url: response.url,
        start: response.question.startTimestamp,
        end: response.question.endTimestamp,
        question: response.question.text,
        currentTimestamp: response.question,
        isPauseSegment: false,
        pauseSegment: response.pause
      };

      setCurrentVideo(videoData);
      currentVideoRef.current = videoData;

      // Ensure video is paused initially
      if (mainVideoRef.current) {
        mainVideoRef.current.pause();
        setIsMainVideoPlaying(false);
      }

      // Reset all necessary states
      setShowStartButton(true);
      setIsCountdownActive(false);
      setIsInterviewTimerActive(false);
      setTimeLeft(5);
      setInterviewTimeLeft(5 * 60);

      // Add the first message
      if (response.question.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "AI",
            message: response.question.text,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      console.error(`Error loading ${section} scenario:`, error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-1/2 -translate-y-1/2 h-32 flex items-center z-50 transition-all duration-300 ${
        isPositioned ? "translate-x-0" : "translate-x-0"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-teal text-white p-1 rounded-lg hover:bg-teal-600 transition-all duration-300 h-32 flex items-center shadow-lg hover:shadow-xl hover:-translate-x-0.5"
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </button>

      {/* Menu Items with animation */}
      <div
        className={`overflow-hidden transition-all duration-300 transform ${
          isMenuOpen
            ? "w-40 opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-2"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-r-xl border border-teal/10">
          {sections.map((section, index) => (
            <div
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`p-3 cursor-pointer transition-all duration-200 text-sm font-medium
                ${
                  selectedSection === section ||
                  (index === 0 && !selectedSection)
                    ? "bg-teal text-white"
                    : "hover:bg-teal/10 text-gray-700"
                }
                ${index === 0 ? "rounded-tr-xl" : ""}
                ${index === sections.length - 1 ? "rounded-br-xl" : ""}
                border-b border-teal/5 last:border-0
              `}
              style={{
                transform: isMenuOpen ? "translateX(0)" : "translateX(-1rem)",
                opacity: isMenuOpen ? 1 : 0,
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {section}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupMenu;
