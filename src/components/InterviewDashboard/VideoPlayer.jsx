import React from "react";

const VideoPlayer = ({
  videoContainerRef,
  showStartButton,
  handleStartClick,
  isCountdownActive,
  timeLeft,
  interviewTimeLeft,
  formatTime,
  mainVideoRef,
  currentVideo,
  isVideoTransitioning,
  webcamRef,
  isSessionRecording,
  recordingTime,
  isInterviewTimerActive,
  isMainVideoPlaying,
  handleVideoEnd,
}) => {
  return (
    <div
      ref={videoContainerRef}
      className="relative w-full rounded-xl overflow-hidden shadow-xl bg-background flex"
      style={{ height: "calc(100vh * 0.7)" }}
    >
      {/* AI Video - Left Half */}
      <div className="w-1/2 h-full relative">
        {/* Start Button Overlay */}
        {showStartButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <button
              onClick={handleStartClick}
              className="px-8 py-4 bg-teal text-white rounded-xl font-semibold 
                             hover:bg-teal-600 transition-all duration-200 
                             transform hover:scale-105 shadow-lg"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* Countdown Timer */}
        {isCountdownActive && timeLeft > 0 && (
          <div
            className="absolute top-4 left-4 z-10 bg-black/70 text-white 
                              px-6 py-3 rounded-xl font-bold text-2xl animate-pulse"
          >
            {timeLeft}
          </div>
        )}

        {/* Interview Timer - Moved from right to left */}
        {isInterviewTimerActive && (
          <div
            className={`absolute top-4 left-4 z-10 px-6 py-3 rounded-xl font-bold text-2xl
                                ${
                                  interviewTimeLeft <= 60
                                    ? "bg-red-500/70"
                                    : "bg-black/70"
                                } 
                                text-white transition-colors duration-300
                                ${
                                  interviewTimeLeft <= 30 ? "animate-pulse" : ""
                                }`}
          >
            {formatTime(interviewTimeLeft)}
          </div>
        )}

        <video
          ref={mainVideoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isVideoTransitioning ? "opacity-0" : "opacity-100"
          }`}
          src={currentVideo?.url || ""}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          onEnded={handleVideoEnd}
        />
      </div>

      {/* Webcam - Right Half */}
      <div className="w-1/2 h-full">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover bg-gray-900"
        />
      </div>

      {/* Recording Timer */}
      {isSessionRecording && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
          <span className="animate-pulse">●</span>
          {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
