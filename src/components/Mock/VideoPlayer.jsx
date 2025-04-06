import React, { useEffect, useRef } from "react";

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
  // Add a ref for the bottom video
  const bottomVideoRef = useRef(null);

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

  // Add an effect to control the bottom video based on main video playing state
  useEffect(() => {
    if (bottomVideoRef.current) {
      if (isMainVideoPlaying) {
        bottomVideoRef.current.play();
      } else {
        bottomVideoRef.current.pause();
      }
    }
  }, [isMainVideoPlaying]);

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full rounded-xl overflow-hidden shadow-xl bg-black flex"
      style={{ height: "calc(100vh * 0.7)" }}
    >
      {/* Start Button Overlay - Now covering the entire video player */}
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

      {/* Left Half - Split into upper and lower sections with no gap */}
      <div className="w-1/2 h-full flex flex-col bg-black">
        {/* Upper Half - AI Video */}
        <div className="w-full h-1/2 relative bg-black">
          {/* Countdown Timer */}
          {isCountdownActive && timeLeft > 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div
                className="bg-black/70 text-white 
                               px-10 py-6 rounded-xl font-bold text-4xl animate-pulse"
              >
                {timeLeft}
              </div>
            </div>
          )}

          {/* Interview Timer */}
          <div
            className={`absolute top-4 left-4 z-10 px-5 py-2 rounded-xl font-medium text-xl
                                ${
                                  isInterviewTimerActive &&
                                  interviewTimeLeft <= 60
                                    ? "bg-red-500/70"
                                    : "bg-black/70"
                                } 
                                text-white transition-colors duration-300
                                ${
                                  isInterviewTimerActive &&
                                  interviewTimeLeft <= 30
                                    ? "animate-pulse"
                                    : ""
                                }`}
          >
            {formatTime(interviewTimeLeft)}
            {!isInterviewTimerActive && <span className="ml-1">⏸️</span>}
          </div>

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

        {/* Lower Half - Static Looping Video - Only plays after interview starts */}
        <div className="w-full h-1/2 bg-black">
          {!showStartButton && (
            <video
              ref={bottomVideoRef}
              autoPlay={isMainVideoPlaying}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://studyninja.s3.ap-south-1.amazonaws.com/videos/Mock+Pause+Video.mp4"
              style={{ backgroundColor: "black" }}
            />
          )}
        </div>
      </div>

      {/* Right Half - Full Webcam - No margin/padding */}
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
