import React, { useState, useEffect, useRef } from "react";
import APIService from "../server";
import ChatMessage from "./ChatMessage";

const InterviewDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const webcamRef = useRef(null);
  const [isMainVideoPlaying, setIsMainVideoPlaying] = useState(true);
  const [isWebcamPlaying, setIsWebcamPlaying] = useState(true);
  const mainVideoRef = useRef(null);
  const [isSessionRecording, setIsSessionRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const sessionRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const [notes, setNotes] = useState("");
  const [isNotesMinimized, setIsNotesMinimized] = useState(false);
  const [examinerNotes, setExaminerNotes] =
    useState(`Medical School Interview - Examiner Guidelines

Key Areas to Assess:
1. Motivation & Commitment
   • Understanding of medical profession
   • Long-term career goals
   • Work experience/volunteering

2. Communication Skills
   • Clarity of expression
   • Active listening
   • Non-verbal communication
   • Professional demeanor

3. Ethical Awareness
   • Medical ethics understanding
   • Patient confidentiality
   • Current healthcare issues
   • Decision-making process

4. Academic Excellence
   • Scientific knowledge
   • Research experience
   • Study habits
   • Time management

5. Personal Qualities
   • Empathy and compassion
   • Leadership potential
   • Teamwork abilities
   • Stress management

Scoring Guidelines:
5 - Exceptional
4 - Above Average
3 - Satisfactory
2 - Needs Improvement
1 - Unsatisfactory

Additional Notes:
• Watch for candidate's ability to handle pressure
• Assess problem-solving approach
• Note any unique experiences or perspectives
• Consider cultural awareness and sensitivity`);
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

  // Add sections data
  const sections = [
    "Motivation",
    "Plastic Surgery - Skin Cancer",
    "Core Surgical Training",
  ];

  // Modify PopupMenu component to show initial selection
  const PopupMenu = () => (
    <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-32 flex items-center z-50">
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
            ? "w-32 opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-2"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-r-xl border border-teal/10">
          {sections.map((section, index) => (
            <div
              key={section}
              onClick={() => {
                setSelectedSection(section);
                setCurrentStation(section);
                setCurrentIndex(0);
                loadMotivationVideo(section, 0);
              }}
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

  // Add new useEffect for countdown timer
  useEffect(() => {
    if (isCountdownActive && timeLeft > 0) {
      countdownTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Start video when countdown reaches 0
      if (mainVideoRef.current) {
        mainVideoRef.current.play();
      }
      setIsCountdownActive(false);
      clearInterval(countdownTimerRef.current);
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
      interviewTimerRef.current = setInterval(() => {
        setInterviewTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (interviewTimeLeft === 0) {
      // Handle timer completion
      clearInterval(interviewTimerRef.current);
      // Optionally add logic for when time runs out
    }

    return () => {
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
      }
    };
  }, [isInterviewTimerActive, interviewTimeLeft]);

  // Modify initial useEffect to not auto-advance videos
  useEffect(() => {
    const initializeVideos = async () => {
      try {
        const [videoResponse, pauseVideoResponse] = await Promise.all([
          APIService.getMotivationVideo(currentStation, currentIndex),
          APIService.getPauseVideo(),
        ]);

        setCurrentVideo(videoResponse);
        setPauseVideo(pauseVideoResponse);
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
        }
      } catch (error) {
        console.error("Error loading initial videos:", error);
      }
    };

    initializeVideos();
    // Set initial selection to Motivation
    setSelectedSection("Motivation");
  }, []); // Only run once on mount

  // Add keyboard event listener for 'L' key to advance video
  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.key.toLowerCase() === "l") {
        // Calculate next index
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        await loadMotivationVideo(currentStation, nextIndex);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [currentStation, currentIndex]); // Dependencies needed for proper updates

  // Modify loadMotivationVideo to update selectedSection when changing stations
  const loadMotivationVideo = async (
    station = currentStation,
    index = currentIndex
  ) => {
    try {
      setIsVideoTransitioning(true);
      const video = await APIService.getMotivationVideo(station, index);

      // Handle -1 case (last video)
      if (video.nextIndex === -1) {
        // Find current station index
        const currentStationIndex = sections.indexOf(station);

        if (currentStationIndex < sections.length - 1) {
          // If not last station, move to next station
          const nextStation = sections[currentStationIndex + 1];
          setCurrentStation(nextStation);
          setSelectedSection(nextStation); // Update selected section in popup
          setCurrentIndex(0);
          // Load first video of next station
          const nextVideo = await APIService.getMotivationVideo(nextStation, 0);
          setCurrentVideo(nextVideo);
        } else {
          // If last station, show pause video
          const pauseVideo = await APIService.getPauseVideo();
          setCurrentVideo(pauseVideo);
        }
      } else {
        // Normal case - not last video
        setCurrentVideo(video);
      }

      setIsVideoTransitioning(false);

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

      if (mainVideoRef.current) {
        mainVideoRef.current.onloadeddata = () => {
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        };
      }
    } catch (error) {
      console.error("Error loading video:", error);
    }
  };

  // Modify handleMicClick to not automatically load next video
  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const pauseVideo = await APIService.getPauseVideo();
        setCurrentVideo(pauseVideo);
      } catch (error) {
        console.error("Error loading pause video:", error);
      }
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Modify stopRecording to not automatically load next video
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      // Ensure main video is playing
      if (mainVideoRef.current) {
        mainVideoRef.current.play();
        setIsMainVideoPlaying(true);
      }
    }
  };

  // Modify mediaRecorder.onstop to not automatically load next video
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        chunksRef.current = [];

        const tempMessageId = Date.now();
        setMessages((prev) => [
          ...prev,
          {
            id: tempMessageId,
            sender: "You",
            message: "Recording processed...",
            timestamp: new Date().toLocaleTimeString(),
            isTranscribing: true,
          },
        ]);

        try {
          // Get transcription
          const result = await APIService.transcribeAudio(audioBlob);

          // Update message with transcription
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessageId
                ? {
                    ...msg,
                    message: result.transcription,
                    isTranscribing: false,
                  }
                : msg
            )
          );
        } catch (error) {
          console.error("Processing error:", error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

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

  const toggleAudio = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const audioTrack = webcamRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isAudioMuted;
        setIsAudioMuted(!isAudioMuted);
      }
    }
  };

  const toggleMainVideo = () => {
    if (mainVideoRef.current) {
      if (isMainVideoPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsMainVideoPlaying(!isMainVideoPlaying);
    }
  };

  const toggleWebcam = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const videoTrack = webcamRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isWebcamPlaying;
        setIsWebcamPlaying(!isWebcamPlaying);
      }
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
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Add video end handler
  const handleVideoEnd = () => {
    if (pauseVideo) {
      setCurrentVideo(pauseVideo);
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

  return (
    <div className="h-full bg-background p-6 interview-container relative">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="animate-fade-up mb-6">
        <PopupMenu />
        {/* Main Video Container */}
        <div className="rounded-2xl overflow-hidden bg-teal/5 backdrop-blur-sm border border-border/50 p-4">
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

            {/* Zoom-like Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
              <div className="flex justify-center items-center gap-6">
                {/* Audio Control */}
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-lg ${
                    isAudioMuted ? "bg-red-500" : "bg-gray-600"
                  } text-white hover:bg-opacity-80 transition-colors`}
                >
                  <MicIcon />
                </button>

                {/* Video Control */}
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-lg ${
                    !isCameraOn ? "bg-red-500" : "bg-gray-600"
                  } text-white hover:bg-opacity-80 transition-colors`}
                >
                  <CameraIcon />
                </button>

                {/* Play/Pause Control */}
                <button
                  onClick={toggleMainVideo}
                  className="p-3 rounded-lg bg-gray-600 text-white hover:bg-opacity-80 transition-colors"
                >
                  {isMainVideoPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Record Control */}
                <button
                  onClick={
                    isSessionRecording
                      ? stopSessionRecording
                      : startSessionRecording
                  }
                  className={`p-3 rounded-lg ${
                    isSessionRecording ? "bg-red-500" : "bg-gray-600"
                  } text-white hover:bg-opacity-80 transition-colors`}
                >
                  <RecordIcon />
                </button>

                {/* Add Fullscreen Control */}
                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-lg bg-gray-600 text-white hover:bg-opacity-80 transition-colors"
                >
                  {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Notes Section */}
      <div className="animate-fade-up">
        <div className="rounded-2xl bg-background-secondary/50 backdrop-blur-sm border border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <NotesIcon />
              <h2 className="text-xl font-semibold text-black">My Notes</h2>
            </div>
            <button
              onClick={() => setIsNotesMinimized(!isNotesMinimized)}
              className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
            >
              {isNotesMinimized ? <ExpandIcon /> : <MinimizeIcon />}
            </button>
          </div>

          {!isNotesMinimized && (
            <div className="transition-all duration-300">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type your interview notes here..."
                className="w-full h-48 bg-background/50 backdrop-blur-sm rounded-xl p-4 text-black placeholder-gray-400 
                          border border-border/50 focus:border-teal focus:ring-1 focus:ring-teal outline-none
                          transition-all duration-200 resize-none scrollbar-thin scrollbar-thumb-teal/50 
                          scrollbar-track-transparent"
                style={{
                  boxShadow: "0 0 20px rgba(20, 184, 166, 0.05)",
                }}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <span>{notes.length} characters</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNotes("")}
                    className="px-3 py-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([notes], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "interview-notes.txt";
                      a.click();
                    }}
                    className="px-3 py-1 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal transition-colors"
                  >
                    Download Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examiner Notes Section */}
      <div className="animate-fade-up mt-6">
        <div className="rounded-2xl bg-background-secondary/50 backdrop-blur-sm border border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ExaminerIcon />
              <h2 className="text-xl font-semibold text-black">
                Examiner Notes
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setIsExaminerNotesMinimized(!isExaminerNotesMinimized)
                }
                className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
              >
                {isExaminerNotesMinimized ? <ExpandIcon /> : <MinimizeIcon />}
              </button>
            </div>
          </div>

          {!isExaminerNotesMinimized && (
            <div className="transition-all duration-300">
              <textarea
                value={examinerNotes}
                onChange={(e) => setExaminerNotes(e.target.value)}
                className="w-full h-96 bg-background/50 backdrop-blur-sm rounded-xl p-4 text-black placeholder-gray-400 
                          border border-border/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none
                          transition-all duration-200 resize-none scrollbar-thin scrollbar-thumb-purple-500/50 
                          scrollbar-track-transparent font-mono text-sm leading-relaxed"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.05)",
                }}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                <span>{examinerNotes.length} characters</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([examinerNotes], {
                        type: "text/plain",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "examiner-notes.txt";
                      a.click();
                    }}
                    className="px-3 py-1 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal transition-colors"
                  >
                    Download Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Navigation Buttons */}
      <div className="animate-fade-up mt-6 flex justify-center gap-4">
        <button
          onClick={() => {
            // Add your end interview logic here
            if (window.confirm("Are you sure you want to end the interview?")) {
              // Handle end interview
            }
          }}
          className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 
                     transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          End Interview
        </button>
        <button
          onClick={() => {
            // Add your next case logic here
            if (selectedSection) {
              // Handle next case
            } else {
              alert("Please select a case from the menu first");
            }
          }}
          className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-600 
                     transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Next Case
        </button>
      </div>
    </div>
  );
};

// Icons
const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 1a4 4 0 0 0-4 4v12a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
    <path d="M24 13v3a8 8 0 0 1-16 0v-3M16 25v4M11 29h10" />
  </svg>
);

// Add Camera Icon
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

// Add Play/Pause Icons
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 3l14 9-14 9V3z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);

// Add Record Icon
const RecordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

// Add Notes Icon
const NotesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-teal"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
  </svg>
);

const MinimizeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-gray-400"
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-gray-400"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Add new ExaminerIcon component
const ExaminerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-gray-800"
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path d="M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z" />
  </svg>
);

// Add Fullscreen Icons
const FullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const ExitFullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 14h3v3m14-3h-3v3M4 10h3V7m14 3h-3V7" />
  </svg>
);

export default InterviewDashboard;
