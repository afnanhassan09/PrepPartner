import React from "react";

const PopupMenu = ({
  sections,
  selectedSection,
  setSelectedSection,
  setCurrentStation,
  setCurrentIndex,
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
}) => (
  <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col items-center z-50">
    {/* Toggle Button */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="bg-teal text-white p-2 rounded-lg hover:bg-teal-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl mb-2"
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
          <path d="M19 9l-7 7-7-7" />
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
          <path d="M5 15l7-7-7-7" />
        </svg>
      )}
    </button>

    {/* Menu Items with animation */}
    <div
      className={`overflow-hidden transition-all duration-300 transform ${
        isMenuOpen
          ? "h-auto opacity-100 translate-y-0"
          : "h-0 opacity-0 -translate-y-2"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border border-teal/10 flex">
        {sections.map((section, index) => (
          <div
            key={section}
            onClick={async () => {
              setSelectedSection(section);
              setCurrentStation(section);
              setCurrentIndex(0);

              // Load video but ensure it's paused
              try {
                const video = await APIService.getMotivationVideo(section, 0);
                setCurrentVideo(video);
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

                if (video.question) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      sender: "AI",
                      message: video.question,
                      timestamp: new Date().toLocaleTimeString(),
                    },
                  ]);
                }
              } catch (error) {
                console.error("Error loading video:", error);
              }
            }}
            className={`p-3 cursor-pointer transition-all duration-200 text-sm font-medium
                ${
                  selectedSection === section ||
                  (index === 0 && !selectedSection)
                    ? "bg-teal text-white"
                    : "hover:bg-teal/10 text-gray-700"
                }
                ${index === 0 ? "rounded-l-xl" : ""}
                ${index === sections.length - 1 ? "rounded-r-xl" : ""}
                border-r border-teal/5 last:border-0
              `}
            style={{
              transform: isMenuOpen ? "translateY(0)" : "translateY(-1rem)",
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

export default PopupMenu;
