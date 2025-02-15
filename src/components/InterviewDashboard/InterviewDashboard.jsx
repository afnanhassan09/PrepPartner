import React, { useState, useEffect, useRef } from "react";
import APIService from "../../server";
import PopupMenu from "./PopupMenu";
import VideoPlayer from "./VideoPlayer";
import ControlsBar from "./ControlsBar";
import NotesSection from "./NotesSection";
import ExaminerNotesSection from "./ExaminerNotesSection";
import NavigationButtons from "./NavigationButtons";

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
    // First check if we're on pause video and need to restore previous state
    if (currentVideo?.url === pauseVideo?.url && currentVideo?.previousState) {
      const prevState = currentVideo.previousState;

      // Check if we have more timestamps
      if (prevState.nextIndex >= prevState.timestamps.length) {
        console.log("End of station reached");
        return;
      }

      try {
        setIsVideoTransitioning(true);

        // Get the next timestamp
        const nextTimestamp = prevState.timestamps[prevState.nextIndex];

        // Restore previous state with new timestamp
        setCurrentVideo({
          ...prevState,
          currentTimestamp: nextTimestamp,
          start: nextTimestamp.start,
          end: nextTimestamp.end,
          question: nextTimestamp.question,
          nextIndex: prevState.nextIndex + 1,
        });

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

        setTimeout(() => {
          if (mainVideoRef.current) {
            mainVideoRef.current.currentTime = startTimeInSeconds;
            mainVideoRef.current.play();
            setIsMainVideoPlaying(true);
          }
        }, 100);
      } catch (error) {
        console.error("Error loading next timestamp:", error);
      } finally {
        setIsVideoTransitioning(false);
      }
      return;
    }

    // Regular timestamp progression (not coming from pause video)
    if (
      !currentVideo?.timestamps ||
      currentVideo.nextIndex >= currentVideo.timestamps.length
    ) {
      console.log("End of station reached");
      return;
    }

    try {
      setIsVideoTransitioning(true);

      const nextTimestamp = currentVideo.timestamps[currentVideo.nextIndex];

      setCurrentVideo({
        ...currentVideo,
        currentTimestamp: nextTimestamp,
        start: nextTimestamp.start,
        end: nextTimestamp.end,
        question: nextTimestamp.question,
        nextIndex: currentVideo.nextIndex + 1,
      });

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

      const [minutes, seconds] = nextTimestamp.start.split(":").map(Number);
      const startTimeInSeconds = minutes * 60 + seconds;

      setTimeout(() => {
        if (mainVideoRef.current) {
          mainVideoRef.current.currentTime = startTimeInSeconds;
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        }
      }, 100);
    } catch (error) {
      console.error("Error loading next timestamp:", error);
    } finally {
      setIsVideoTransitioning(false);
    }
  };

  // Update initial video loading
  useEffect(() => {
    const initializeVideos = async () => {
      try {
        const [videoResponse, pauseVideoResponse] = await Promise.all([
          APIService.getMotivationVideo(currentStation),
          APIService.getPauseVideo(),
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
      } else {
        mainVideoRef.current.play();
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

  // Update handleVideoEnd to better preserve state
  const handleVideoEnd = () => {
    if (pauseVideo && currentVideo?.url !== pauseVideo.url) {
      // Save current state before switching to pause video
      const previousState = {
        ...currentVideo,
        previousUrl: currentVideo.url,
      };

      setCurrentVideo({
        ...pauseVideo,
        previousState: previousState, // Store the entire previous state
      });

      // Reset voice detection state
      hasSpoken.current = false;
      silenceCount.current = 0;

      setTimeout(() => {
        if (mainVideoRef.current) {
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
        }
      }, 100);
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

  // Function to handle silence detection
  const handleSilence = () => {
    console.log("handleSilence called");
    // Only proceed if video is paused
    if (!videoRef.current?.paused) {
      console.log("Video is still playing, ignoring silence");
      return;
    }

    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }

    setSilenceTimer(
      setTimeout(() => {
        console.log("Silence timer completed, loading next video...");
        loadNextVideo();
      }, 2000) // Increased to 2 seconds
    );
  };

  const startVoiceDetection = async () => {
    try {
      console.log("Starting voice detection...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      console.log("Got audio stream:", stream);
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyserRef.current = analyser;
      setAudioContext(audioCtx);

      // Set mic listening first
      setIsMicListening(true);

      // Wait a bit for state to update
      setTimeout(() => {
        console.log("Starting audio check loop...");
        requestAnimationFrame(checkAudio);
      }, 100);

      console.log("Voice detection started successfully");
    } catch (error) {
      console.error("Error in startVoiceDetection:", error);
      setIsMicListening(false);
    }
  };

  const checkAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    const isPauseVideo = currentVideo?.url === pauseVideo?.url;
    const isFirstVideo = !currentVideo || currentVideo.url === undefined;

    // Don't process audio if we're on the first load or not on a pause video
    if (isFirstVideo || !isPauseVideo) {
      requestAnimationFrame(checkAudio);
      return;
    }

    if (isPauseVideo) {
      if (!hasSpoken.current) {
        console.log("Waiting for first voice detection...");
      }

      if (average > 5) {
        if (!hasSpoken.current) {
          console.log("First voice detected!");
        }
        hasSpoken.current = true;
        silenceCount.current = 0;
      } else {
        if (hasSpoken.current) {
          silenceCount.current++;
          const silenceSeconds = Math.floor(silenceCount.current / 60);
          if (silenceSeconds > 0 && silenceCount.current % 60 === 0) {
            console.log(`${silenceSeconds} seconds of silence...`);
          }

          if (silenceCount.current >= 300) {
            console.log("5 seconds of silence completed, playing next video");
            loadNextVideo();
            return;
          }
        }
      }
    }

    requestAnimationFrame(checkAudio);
  };

  // Add effect to monitor state changes
  useEffect(() => {
    console.log("Mic listening state changed:", isMicListening);
  }, [isMicListening]);

  // Add effect to monitor video changes
  useEffect(() => {
    // Only start audio detection if we're on a pause video and not the initial load
    if (
      currentVideo?.url === pauseVideo?.url &&
      currentVideo?.url !== undefined
    ) {
      console.log("Video paused, waiting for voice...");
      hasSpoken.current = false;
      silenceCount.current = 0;
      requestAnimationFrame(checkAudio);
    }
  }, [currentVideo, pauseVideo]);

  // Start voice detection on component mount
  useEffect(() => {
    console.log("Starting voice detection on mount");
    startVoiceDetection();
    return () => {
      console.log("Cleaning up voice detection");
      stopVoiceDetection();
    };
  }, []);

  const stopVoiceDetection = () => {
    console.log("Stopping voice detection...");

    // Stop the audio context first
    if (audioContext) {
      console.log("Closing audio context");
      audioContext.close();
    }

    // Clear the analyser
    analyserRef.current = null;

    // Stop media tracks
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      console.log("Stopping tracks:", tracks.length);
      tracks.forEach((track) => {
        console.log("Stopping track:", track.kind, track.label);
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    // Clear timer
    if (silenceTimer) {
      console.log("Clearing silence timer");
      clearTimeout(silenceTimer);
    }

    setIsMicListening(false);
    console.log("Voice detection stopped");
  };

  return (
    <div className="h-full bg-background p-6 interview-container relative">
      <canvas ref={canvasRef} style={{ display: "none" }} />
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
