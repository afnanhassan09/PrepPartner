import React, { useState, useEffect, useRef } from "react";
import APIService from "../../server";
import PopupMenu from "./PopupMenu";
import VideoPlayer from "./VideoPlayer";
import ControlsBar from "./ControlsBar";
import NotesSection from "./NotesSection";
import ExaminerNotesSection from "./ExaminerNotesSection";
import NavigationButtons from "./NavigationButtons";
import pauseVideoUrl from "../../assets/pause.mp4";

const InterviewDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const messagesEndRef = useRef(null);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const webcamRef = useRef(null);
  const [isMainVideoPlaying, setIsMainVideoPlaying] = useState(true);
  const mainVideoRef = useRef(null);
  const [isSessionRecording, setIsSessionRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const sessionRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const [notes, setNotes] = useState("");
  const [isNotesMinimized, setIsNotesMinimized] = useState(false);
  const [isExaminerNotesMinimized, setIsExaminerNotesMinimized] =
    useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef(null);
  const [pauseVideo, setPauseVideo] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const countdownTimerRef = useRef(null);
  const [interviewTimeLeft, setInterviewTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isInterviewTimerActive, setIsInterviewTimerActive] = useState(false);
  const interviewTimerRef = useRef(null);
  const [currentStation, setCurrentStation] = useState("Motivation");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isMicListening, setIsMicListening] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [silenceTimer, setSilenceTimer] = useState(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const videoRef = useRef(null);
  const hasSpoken = useRef(false);
  const silenceCount = useRef(0);
  const currentVideoRef = useRef(null);
  const [audioStream, setAudioStream] = useState(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // Add sections data
  const sections = [
    "Motivation",
    "Plastic Surgery - Skin Cancer",
    "Core Surgical Training",
  ];

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.key.toUpperCase() === "L") {
        if (nextVideoIndex === -1) {
          // If we're at the end of the station, just play pause video
          if (pauseVideo) {
            setCurrentVideo(pauseVideo);
            if (mainVideoRef.current) {
              mainVideoRef.current.play();
              setIsMainVideoPlaying(true);
            }
          }
          return;
        }

        // Load next video
        try {
          setIsVideoTransitioning(true);
          const videoResponse = await APIService.getMotivationVideo(
            currentStation,
            nextVideoIndex
          );

          setCurrentVideo(videoResponse);
          setNextVideoIndex(videoResponse.nextIndex);

          if (videoResponse.question) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "AI",
                message: videoResponse.question,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }

          // Auto-play the video
          setTimeout(() => {
            if (mainVideoRef.current) {
              mainVideoRef.current.play();
              setIsMainVideoPlaying(true);
            }
          }, 100);
        } catch (error) {
          console.error("Error loading next video:", error);
        } finally {
          setIsVideoTransitioning(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStation, nextVideoIndex, pauseVideo]);

  // Modify loadNextVideo to handle timestamps array
  const loadNextVideo = async () => {
  

    if (
      currentVideoRef.current?.pauseSegmentActive &&
      currentVideoRef.current?.previousState
    ) {
      const prevState = currentVideoRef.current.previousState;
     

      // Check if we have more timestamps
      if (prevState.nextIndex >= prevState.timestamps.length) {
        console.log("End of station reached");
        if (mainVideoRef.current) {
          mainVideoRef.current.pause();
          setIsMainVideoPlaying(false);
        }
        setShowStartButton(true);
        return;
      }

      try {
        setIsVideoTransitioning(true);

        // Get the next timestamp
        const nextTimestamp = prevState.timestamps[prevState.nextIndex];
    

        // Create new video state
        const newVideoState = {
          ...prevState,
          currentTimestamp: nextTimestamp,
          start: nextTimestamp.start,
          end: nextTimestamp.end,
          question: nextTimestamp.question,
          nextIndex: prevState.nextIndex + 1,
          isPauseSegment: false,
          pauseSegmentActive: false, // Reset pause segment flag
          pauseSegment: {
            start: "1:53",
            end: "2:00",
          },
        };

      
        setCurrentVideo(newVideoState);
        currentVideoRef.current = newVideoState;

        if (nextTimestamp.question) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "AI",
              message: nextTimestamp.question,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }

        // Set video to new timestamp
        const [minutes, seconds] = nextTimestamp.start.split(":").map(Number);
        const startTimeInSeconds = minutes * 60 + seconds;

        if (mainVideoRef.current) {
      
          mainVideoRef.current.currentTime = startTimeInSeconds;
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        }
      } catch (error) {
        console.error("Error loading next timestamp:", error);
      } finally {
        setIsVideoTransitioning(false);
      }
    } else {
      console.log("Not in pause segment or no previous state available", {
        pauseSegmentActive: currentVideoRef.current?.pauseSegmentActive,
        previousState: currentVideoRef.current?.previousState,
      });
    }
  };

  // Update initial video loading
  useEffect(() => {
    const initializeVideos = async () => {
      try {
        const [videoResponse, pauseVideoResponse] = await Promise.all([
          APIService.getMotivationVideo(currentStation),
          { url: pauseVideoUrl },
        ]);

        setCurrentVideo(videoResponse);
        setPauseVideo(pauseVideoResponse);
        setNextVideoIndex(1); // Start with index 1 (second timestamp)
        setIsVideoTransitioning(false);

        if (videoResponse.question) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "AI",
              message: videoResponse.question,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }

        // Ensure video is paused initially
        if (mainVideoRef.current) {
          mainVideoRef.current.pause();
          setIsMainVideoPlaying(false);
        }
      } catch (error) {
        console.error("Error loading initial videos:", error);
      }
    };

    initializeVideos();
    setSelectedSection("Motivation");
  }, []);

  // Modify countdown timer useEffect
  useEffect(() => {
    if (isCountdownActive && timeLeft > 0) {
      countdownTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Start video when countdown reaches 0
      clearInterval(countdownTimerRef.current);
      setIsCountdownActive(false);

      // Add slight delay before playing video
      setTimeout(() => {
        if (mainVideoRef.current) {
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        }
      }, 100);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isCountdownActive, timeLeft]);

  // Add new useEffect for the 5-minute interview timer
  useEffect(() => {
    if (isInterviewTimerActive && interviewTimeLeft > 0) {
      // Clear any existing interval first to prevent multiple intervals
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
      }
      
      interviewTimerRef.current = setInterval(() => {
        setInterviewTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isInterviewTimerActive) {
      // Clear the interval when timer is not active
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
      }
    } else if (interviewTimeLeft === 0) {
      // Handle timer completion
      clearInterval(interviewTimerRef.current);
      
      // Pause the video when time runs out
      if (mainVideoRef.current && isMainVideoPlaying) {
        mainVideoRef.current.pause();
        setIsMainVideoPlaying(false);
      }
      
      // Show the time up modal
      setShowTimeUpModal(true);
    }

    return () => {
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
      }
    };
  }, [isInterviewTimerActive, interviewTimeLeft, isMainVideoPlaying]);

  // Add this useEffect to request permissions when component mounts
  useEffect(() => {}, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add effect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      const stream = webcamRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      webcamRef.current.srcObject = null;
      setIsCameraOn(false);
    } else {
      startWebcam();
    }
  };

  const toggleMainVideo = () => {
    if (mainVideoRef.current) {
      if (isMainVideoPlaying) {
        mainVideoRef.current.pause();
        // Pause the interview timer when video is paused
        if (isInterviewTimerActive) {
          clearInterval(interviewTimerRef.current);
          setIsInterviewTimerActive(false);
        }
      } else {
        mainVideoRef.current.play();
        // Resume the interview timer when video is played
        if (!isInterviewTimerActive && interviewTimeLeft > 0) {
          setIsInterviewTimerActive(true);
        }
      }
      setIsMainVideoPlaying(!isMainVideoPlaying);
    }
  };

  // Add new function for session recording
  const startSessionRecording = async () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match video dimensions
      canvas.width = 1280;
      canvas.height = 720;

      // Get webcam stream
      const webcamStream = webcamRef.current.srcObject;

      // Create canvas stream with higher framerate
      const canvasStream = canvas.captureStream(30); // 30 FPS

      // Combine all audio tracks
      const audioTracks = [];
      if (webcamStream) {
        const webcamAudio = webcamStream.getAudioTracks();
        audioTracks.push(...webcamAudio);
      }

      // Add all tracks to canvas stream
      audioTracks.forEach((track) => canvasStream.addTrack(track));

      // Create MediaRecorder with specific codec options
      sessionRecorderRef.current = new MediaRecorder(canvasStream, {
        mimeType: "video/webm;codecs=vp8,opus", // Fallback to WebM for better compatibility
        videoBitsPerSecond: 3000000, // 3 Mbps
        audioBitsPerSecond: 128000, // 128 kbps
      });

      const chunks = [];

      sessionRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      sessionRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "interview-session.webm";
        a.click();
      };

      // Start recording
      sessionRecorderRef.current.start(1000);
      setIsSessionRecording(true);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Improved drawing function with requestAnimationFrame
      const drawFrame = () => {
        if (!isSessionRecording) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw main video on left half
        if (mainVideoRef.current && !mainVideoRef.current.paused) {
          ctx.drawImage(
            mainVideoRef.current,
            0,
            0,
            canvas.width / 2,
            canvas.height
          );
        }

        // Draw webcam on right half
        if (webcamRef.current && webcamRef.current.srcObject) {
          ctx.drawImage(
            webcamRef.current,
            canvas.width / 2,
            0,
            canvas.width / 2,
            canvas.height
          );
        }

        // Continue animation loop
        if (isSessionRecording) {
          requestAnimationFrame(drawFrame);
        }
      };

      // Start the drawing loop
      drawFrame();
    } catch (error) {
      console.error("Error starting session recording:", error);
    }
  };

  const stopSessionRecording = () => {
    if (
      sessionRecorderRef.current &&
      sessionRecorderRef.current.state !== "inactive"
    ) {
      sessionRecorderRef.current.stop();
      setIsSessionRecording(false);
      clearInterval(timerIntervalRef.current);
      setRecordingTime(0);
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Add fullscreen toggle function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      // Corrected return statement
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Update useEffect for currentVideo changes
  useEffect(() => {
    // Update the ref when currentVideo changes
    currentVideoRef.current = currentVideo;

    // Only start audio detection if we're on a pause segment
    if (currentVideo?.isPauseSegment) {
      hasSpoken.current = false;
      silenceCount.current = 0;

      // Restart the audio check if we have an analyzer
      if (analyserRef.current) {
        console.log("Restarting audio check...");
        // Cancel any existing animation frame
        if (window.requestAnimationFrame) {
          window.cancelAnimationFrame(checkAudio);
        }
        // Start a new check
        checkAudio();
      } else {
        startVoiceDetection();
      }
    }
  }, [currentVideo]);

  // Update handleVideoEnd to properly handle state transitions
  const handleVideoEnd = () => {
    const currentVideoState = currentVideoRef.current;

    if (currentVideoState?.pauseSegment && !currentVideoState.isPauseSegment) {
      console.log("Switching to pause segment");

      try {
        // Create a clean copy of the current state
        const stateCopy = {
          ...currentVideoState,
          timestamps: [...currentVideoState.timestamps],
          nextIndex: currentVideoState.nextIndex,
          currentTimestamp: { ...currentVideoState.currentTimestamp },
          pauseSegment: { ...currentVideoState.pauseSegment },
        };

        // Create pause segment state
        const pauseSegmentState = {
          ...stateCopy,
          previousState: stateCopy, // Store the complete state
          url: currentVideoState.url,
          start: currentVideoState.pauseSegment.start,
          end: currentVideoState.pauseSegment.end,
          isPauseSegment: true,
          currentTimestamp: currentVideoState.pauseSegment,
          // Add a flag to track if this is a pause segment
          pauseSegmentActive: true,
        };

    

        setCurrentVideo(pauseSegmentState);
        currentVideoRef.current = pauseSegmentState;

        if (mainVideoRef.current) {
          const [minutes, seconds] = currentVideoState.pauseSegment.start
            .split(":")
            .map(Number);
          const startTimeInSeconds = minutes * 60 + seconds;
          console.log("Setting video time to:", startTimeInSeconds);
          mainVideoRef.current.currentTime = startTimeInSeconds;
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        }
      } catch (error) {
        console.error("Error in handleVideoEnd:", error);
      }
    }
  };

  // Modify handleStartClick to also start the interview timer
  const handleStartClick = () => {
    setShowStartButton(false);
    setIsCountdownActive(true);
    setTimeLeft(5);
    // Start the 5-minute timer after the initial countdown
    setTimeout(() => {
      setIsInterviewTimerActive(true);
    }, 5000);
  };

  const checkAudio = () => {
    const videoState = currentVideoRef.current;

    if (!videoState || !analyserRef.current) {
      requestAnimationFrame(checkAudio);
      return;
    }

    try {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (!videoState.isPauseSegment) {
        hasSpoken.current = false;
        silenceCount.current = 0;
        requestAnimationFrame(checkAudio);
        return;
      }

      // Adjust threshold for voice detection
      if (average > 10) {
        hasSpoken.current = true;
        silenceCount.current = 0;
      } else if (hasSpoken.current) {
        silenceCount.current++;
        const silenceSeconds = Math.floor(silenceCount.current / 60);

        if (silenceSeconds > 0 && silenceCount.current % 60 === 0) {
          console.log(`${silenceSeconds} seconds of silence...`);
        }

        if (silenceCount.current >= 300) {
          console.log("5 seconds of silence completed, loading next video");
          hasSpoken.current = false;
          silenceCount.current = 0;

          if (!videoState.pauseSegmentActive) {
            videoState.pauseSegmentActive = true;
            videoState.previousState = { ...videoState };
          }

          loadNextVideo();
          return;
        }
      }

      requestAnimationFrame(checkAudio);
    } catch (error) {
      console.error("Error in checkAudio:", error);
      requestAnimationFrame(checkAudio);
    }
  };

  // Update startVoiceDetection to maintain state better
  const startVoiceDetection = async () => {
    try {
      // Don't start if already initialized
      if (isAudioInitialized) {
        console.log("Audio already initialized, skipping");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("Got audio stream:", stream);
      mediaStreamRef.current = stream;
      setAudioStream(stream);

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyserRef.current = analyser;
      setAudioContext(audioCtx);
      setIsMicListening(true);
      setIsAudioInitialized(true);

      checkAudio();
    } catch (error) {
      console.error("Error in startVoiceDetection:", error);
      setIsMicListening(false);
      setIsAudioInitialized(false);
    }
  };

  // Add effect to monitor state changes
  useEffect(() => {
    console.log("Mic listening state changed:", isMicListening);
  }, [isMicListening]);

  // Start voice detection on component mount
  useEffect(() => {
    let isActive = true;

    const initVoiceDetection = async () => {
      if (!isActive) return;
      console.log("Initializing voice detection...");
      await startVoiceDetection();
    };

    initVoiceDetection();

    return () => {
      isActive = false;
      console.log("Cleaning up voice detection");
      stopVoiceDetection();
    };
  }, []);

  const stopVoiceDetection = () => {
    console.log("Stopping voice detection...");

    if (audioContext) {
      audioContext.close();
    }

    analyserRef.current = null;

    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }

    setIsMicListening(false);
    setIsAudioInitialized(false);
    console.log("Voice detection stopped");
  };

  useEffect(() => {
    return () => {
      // Cancel any existing animation frame
      if (window.requestAnimationFrame) {
        window.cancelAnimationFrame(checkAudio);
      }
    };
  }, []);

  // Function to refresh the page when "Try Again" is clicked
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="h-full bg-background p-6 interview-container relative">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl animate-fade-up">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Time's Up!</h2>
            <p className="text-gray-700 mb-6">Your interview session has ended.</p>
            <button
              onClick={handleTryAgain}
              className="px-6 py-3 bg-teal text-white rounded-xl font-semibold 
                       hover:bg-teal-600 transition-all duration-200 
                       transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <div className="animate-fade-up mb-6">
        <PopupMenu
          sections={sections}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setCurrentStation={setCurrentStation}
          setCurrentIndex={setCurrentIndex}
          APIService={APIService}
          setCurrentVideo={setCurrentVideo}
          mainVideoRef={mainVideoRef}
          setIsMainVideoPlaying={setIsMainVideoPlaying}
          setShowStartButton={setShowStartButton}
          setIsCountdownActive={setIsCountdownActive}
          setIsInterviewTimerActive={setIsInterviewTimerActive}
          setTimeLeft={setTimeLeft}
          setInterviewTimeLeft={setInterviewTimeLeft}
          setMessages={setMessages}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          formatTime={formatTime}
        />
        {/* Main Video Container */}
        <div className="rounded-2xl overflow-hidden bg-teal/5 backdrop-blur-sm border border-border/50 p-4">
          <VideoPlayer
            videoContainerRef={videoContainerRef}
            showStartButton={showStartButton}
            handleStartClick={handleStartClick}
            isCountdownActive={isCountdownActive}
            timeLeft={timeLeft}
            interviewTimeLeft={interviewTimeLeft}
            formatTime={formatTime}
            mainVideoRef={mainVideoRef}
            currentVideo={currentVideo}
            isVideoTransitioning={isVideoTransitioning}
            webcamRef={webcamRef}
            isSessionRecording={isSessionRecording}
            recordingTime={recordingTime}
            isInterviewTimerActive={isInterviewTimerActive}
            isMainVideoPlaying={isMainVideoPlaying}
            handleVideoEnd={handleVideoEnd}
            videoRef={videoRef}
          />
          <ControlsBar
            toggleCamera={toggleCamera}
            toggleMainVideo={toggleMainVideo}
            isSessionRecording={isSessionRecording}
            stopSessionRecording={stopSessionRecording}
            startSessionRecording={startSessionRecording}
            toggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
            isCameraOn={isCameraOn}
            isMainVideoPlaying={isMainVideoPlaying}
            isMicListening={isMicListening}
          />
        </div>
      </div>

      {/* New Notes Section */}
      <NotesSection
        notes={notes}
        setNotes={setNotes}
        isNotesMinimized={isNotesMinimized}
        setIsNotesMinimized={setIsNotesMinimized}
      />

      {/* Examiner Notes Section */}
      <ExaminerNotesSection
        isExaminerNotesMinimized={isExaminerNotesMinimized}
        setIsExaminerNotesMinimized={setIsExaminerNotesMinimized}
      />

      {/* Add Navigation Buttons */}
      <NavigationButtons selectedSection={selectedSection} />
    </div>
  );
};

export default InterviewDashboard;
