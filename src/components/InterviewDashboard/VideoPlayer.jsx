import React, { useEffect } from "react";

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
  // Add timeupdate event listener to check for end timestamp
  useEffect(() => {
    const videoElement = mainVideoRef.current;

    const handleTimeUpdate = () => {
      if (!videoElement || !currentVideo?.end) return;

      // Convert end timestamp (e.g. "0:05") to seconds
      const [minutes, seconds] = currentVideo.end.split(":").map(Number);
      const endTimeInSeconds = minutes * 60 + seconds;

      // Remove the preloading since we're using the same video
      // Just check if we've reached the end time
      if (videoElement.currentTime >= endTimeInSeconds) {
        // Ensure smooth transition
        videoElement.style.opacity = 1;
        handleVideoEnd();
      }
    };

    videoElement?.addEventListener("timeupdate", handleTimeUpdate);
    return () =>
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentVideo, handleVideoEnd]);

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full rounded-xl overflow-hidden shadow-xl bg-black flex"
      style={{ height: "calc(100vh * 0.7)" }}
    >
      {/* AI Video - Left Half */}
      <div className="w-1/2 h-full relative bg-black">
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
          className={`w-full h-full object-cover ${
            isVideoTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transition: "opacity 300ms ease-in-out",
            backgroundColor: "black",
          }}
          src={currentVideo?.url || ""}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
          onEnded={handleVideoEnd}
          preload="auto"
        />
      </div>

      {/* Webcam - Right Half */}
      <div className="w-1/2 h-full bg-black">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ backgroundColor: "black" }}
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
