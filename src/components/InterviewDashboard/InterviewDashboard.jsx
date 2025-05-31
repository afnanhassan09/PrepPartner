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
  const [currentStation, setCurrentStation] = useState("Social Media");
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
  const [showAdditionalMaterial, setShowAdditionalMaterial] = useState(false);

  // New state for Professional Judgement
  const [professionalJudgementData, setProfessionalJudgementData] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState("start");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const isRecordingAudio = useRef(false);
  const audioChunks = useRef([]);
  const audioRecorderRef = useRef(null); // Add ref for immediate access
  const recordedAudioRef = useRef(null); // Add ref for immediate access to recorded audio
  const videoUrlRef = useRef(null); // Store video URL to persist across state resets
  const pauseSegmentRef = useRef(null); // Store pause segment to persist across state resets
  const currentScenarioRef = useRef(null); // Store current scenario to persist across state resets

  // Add sections data for Professional Judgement
  const sections = [
    "Professionalism - Social Media",
    "Social Media",
    "Alcohol Use", 
    "Medical Error",
    "Mistake to Patient",
    "Conflict of Interest",
    "Refusal of Treatment", 
    "Religious Belief",
    "End of Life care",
    "Complain"
  ];

  // Initialize Professional Judgement on load
  useEffect(() => {
    console.log("🔧 Professional Judgement useEffect triggered");
    
    const initializeProfessionalJudgement = async () => {
      try {
        console.log("Initializing Professional Judgement...");
        
        // Check if user is authenticated first
        if (!APIService.isAuthenticated()) {
          console.error("User not authenticated, redirecting to login");
          // You might want to redirect to login page here
          // window.location.href = "/login";
          return;
        }

        const token = APIService.getToken();
        console.log("Using token:", token ? `${token.substring(0, 20)}...` : "No token");

        // Use selected scenario or default to "Social Media" for initial load only
        const initialScenario = selectedSection || "Social Media";
        console.log("Using initial scenario:", initialScenario);

        const response = await APIService.getProfessionalJudgement({
          scenario: initialScenario,
          id: "start",
          start: true
        });

        console.log("Professional Judgement Response:", response);
        
        setProfessionalJudgementData(response);
        setCurrentQuestionId(response.question.id);

        // Store critical data in refs to persist across state resets
        videoUrlRef.current = response.url;
        pauseSegmentRef.current = response.pause;
        currentScenarioRef.current = initialScenario;

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

        // Set pause video
        setPauseVideo({ url: pauseVideoUrl });

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

        // Ensure video is paused initially
        if (mainVideoRef.current) {
          mainVideoRef.current.pause();
          setIsMainVideoPlaying(false);
        }

        setIsVideoTransitioning(false);
      } catch (error) {
        console.error("Error initializing Professional Judgement:", error);
        
        // If authentication failed, show a user-friendly message
        if (error.message.includes("Authentication failed") || error.message.includes("No authentication token")) {
          console.log("Authentication issue detected. User may need to log in again.");
          // Optionally, you could set a state to show a login prompt
          // setShowLoginPrompt(true);
        }
        
        // For now, let's just continue with a placeholder to prevent the app from crashing
        setCurrentVideo({
          url: pauseVideoUrl,
          start: "0:00",
          end: "0:05",
          question: "Please log in to continue with the interview.",
          isPauseSegment: false
        });
      }
    };

    // Only initialize if we don't have data yet
    if (!professionalJudgementData && !videoUrlRef.current) {
      console.log("🎯 Starting Professional Judgement initialization");
      initializeProfessionalJudgement();
    } else {
      console.log("🔄 Professional Judgement already initialized, skipping");
    }
  }, []); // Empty dependency array to run only once

  // Initialize audio recording and voice detection together
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (isAudioInitialized) {
          console.log("Audio already initialized, skipping");
          return;
        }

        console.log("Initializing audio for both recording and voice detection...");
        
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        console.log("Got audio stream:", stream);

        // Set up MediaRecorder for audio recording
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        console.log("📹 Created MediaRecorder:", recorder);
        console.log("📹 Initial MediaRecorder state:", recorder.state);
        
        recorder.ondataavailable = (event) => {
          console.log("📼 Audio data available, size:", event.data.size);
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          console.log("📼 MediaRecorder stopped, processing audio chunks:", audioChunks.current.length);
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setRecordedAudio(audioBlob);
          recordedAudioRef.current = audioBlob; // Store in ref for immediate access
          audioChunks.current = [];
          console.log("📼 Audio recording processed, blob size:", audioBlob.size);
        };

        recorder.onstart = () => {
          console.log("📼 MediaRecorder started successfully");
        };

        recorder.onerror = (event) => {
          console.error("📼 MediaRecorder error:", event.error);
        };

        // Set up AudioContext for voice detection
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;

        const microphone = audioCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);

        // Store everything
        console.log("📹 Setting audioRecorder state...");
        setAudioRecorder(recorder);
        audioRecorderRef.current = recorder; // Store in ref for immediate access
        
        analyserRef.current = analyser;
        setAudioContext(audioCtx);
        mediaStreamRef.current = stream;
        setIsMicListening(true);
        setIsAudioInitialized(true);

        console.log("✅ Audio initialization completed successfully");
        console.log("📹 MediaRecorder state after setup:", recorder.state);
        console.log("🎤 Voice detection active");

        // Small delay to ensure state is set before starting audio monitoring
        setTimeout(() => {
          console.log("🎤 Starting audio monitoring...");
          checkAudio();
        }, 100);

      } catch (error) {
        console.error("❌ Error initializing audio:", error);
        setIsMicListening(false);
        setIsAudioInitialized(false);
      }
    };

    // Only initialize once and prevent cleanup during normal operation
    if (!isAudioInitialized) {
      initializeAudio();
    }

    // Only cleanup on component unmount, not on re-renders
    return () => {
      if (window.location.pathname === "/interview" && document.readyState === "complete") {
        console.log("Cleaning up audio...");
        if (audioContext) {
          audioContext.close();
        }
        if (mediaStreamRef.current) {
          const tracks = mediaStreamRef.current.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []); // Empty dependency array - only run once

  // Load next question with audio
  const loadNextQuestion = async () => {
    console.log("🔄 loadNextQuestion called");
    
    // Use ref first (immediate access), then fall back to state
    const audioBlob = recordedAudioRef.current || recordedAudio;
    
    console.log("🎧 Audio available:", audioBlob ? `${audioBlob.size} bytes` : "null");
    console.log("🎧 isWaitingForResponse:", isWaitingForResponse);
    
    if (!audioBlob) {
      console.log("❌ No recorded audio available");
      return;
    }

    if (isWaitingForResponse) {
      console.log("❌ Already waiting for response");
      return;
    }

    try {
      console.log("🚀 Starting API call for next question...");
      setIsWaitingForResponse(true);
      setIsVideoTransitioning(true);

      console.log("📡 Calling API with question ID:", currentQuestionId);
      console.log("📡 Audio blob size:", audioBlob.size, "bytes");
      console.log("📡 Selected scenario:", selectedSection);
      console.log("📡 Scenario from ref:", currentScenarioRef.current);
      console.log("📡 Using scenario:", currentScenarioRef.current || selectedSection || "Social Media");
      
      const response = await APIService.getProfessionalJudgement({
        scenario: currentScenarioRef.current || selectedSection || "Social Media",
        id: currentQuestionId,
        start: false,
        audio: audioBlob
      });

      console.log("✅ Next question response:", response);

      // Check if interview has ended
      if (response.message === "interview end") {
        console.log("🏁 Interview has ended");
        
        // Stop voice detection immediately
        hasSpoken.current = false;
        silenceCount.current = 0;
        
        // Stop any ongoing audio recording
        if (isRecordingAudio.current) {
          stopAudioRecording();
        }
        
        // Pause video and stop timers
        if (mainVideoRef.current) {
          mainVideoRef.current.pause();
          setIsMainVideoPlaying(false);
        }
        
        // Stop interview timer if running
        if (interviewTimerRef.current) {
          clearInterval(interviewTimerRef.current);
          setIsInterviewTimerActive(false);
        }
        
        // Show completion modal
        setShowTimeUpModal(true);
        return;
      }

      // Update with new question
      if (response.question) {
        console.log("📝 Updating with new question:", response.question.text);
        console.log("📝 Question details:", response.question);
        setCurrentQuestionId(response.question.id);

        // Use refs for critical data that should persist across state resets
        const videoUrl = videoUrlRef.current;
        const pauseSegment = pauseSegmentRef.current;

        console.log("🔍 videoUrlRef.current:", videoUrl);
        console.log("🔍 pauseSegmentRef.current:", pauseSegment);
        console.log("🔍 professionalJudgementData:", professionalJudgementData);

        if (!videoUrl) {
          console.error("❌ No video URL available from refs");
          console.error("❌ This suggests initial data was never loaded properly");
          return;
        }

        console.log("📹 Using video URL from ref:", videoUrl);

        const newVideoData = {
          url: videoUrl,
          start: response.question.startTimestamp,
          end: response.question.endTimestamp,
          question: response.question.text,
          currentTimestamp: response.question,
          isPauseSegment: false,
          pauseSegment: pauseSegment
        };

        console.log("📹 Created new video data:", newVideoData);

        setCurrentVideo(newVideoData);
        currentVideoRef.current = newVideoData;

        console.log("📹 Updated currentVideoRef.current:", currentVideoRef.current);

        // Add message to chat
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

        // Set video to new timestamp
        if (mainVideoRef.current) {
          const [minutes, seconds] = response.question.startTimestamp.split(":").map(Number);
          const startTimeInSeconds = minutes * 60 + seconds;
          
          console.log("📹 Setting video to timestamp:", response.question.startTimestamp);
          
          // Optimize video transition to reduce lag
          mainVideoRef.current.pause(); // Pause first to reduce buffering
          
          // Immediate timestamp change for faster transitions
          mainVideoRef.current.currentTime = startTimeInSeconds;
          
          setTimeout(() => {
            if (mainVideoRef.current) {
              const playPromise = mainVideoRef.current.play();
              
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log("✅ Video playing new question successfully");
                    setIsMainVideoPlaying(true);
                  })
                  .catch((error) => {
                    console.error("❌ Video play error:", error);
                  });
              } else {
                setIsMainVideoPlaying(true);
              }
            }
          }, 50); // Reduced delay for faster transitions
        }
      }

      // Clear recorded audio
      console.log("🧹 Clearing recorded audio");
      setRecordedAudio(null);
      recordedAudioRef.current = null;

    } catch (error) {
      console.error("❌ Error loading next question:", error);
      
      // Reset voice detection state on API error to prevent infinite loops
      console.log("🔄 Resetting voice detection state due to API error");
      hasSpoken.current = false;
      silenceCount.current = 0;
      
      // Reset video state to prevent staying stuck in pause segment
      if (currentVideo && !currentVideo.isPauseSegment) {
        console.log("🔄 Resetting video state due to API error");
        setCurrentVideo({
          ...currentVideo,
          isPauseSegment: false
        });
        currentVideoRef.current = {
          ...currentVideo,
          isPauseSegment: false
        };
      }
      
      // Show error message to user
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "System",
          message: "There was an error processing your response. Please try again.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      
    } finally {
      setIsWaitingForResponse(false);
      setIsVideoTransitioning(false);
      console.log("✅ loadNextQuestion completed");
    }
  };

  // Start recording audio when user starts speaking
  const startAudioRecording = () => {
    // Use ref first (immediate access), then fall back to state
    const recorder = audioRecorderRef.current || audioRecorder;
    
    if (!recorder || recorder.state !== 'inactive' || isRecordingAudio.current) {
      console.log("❌ Cannot start recording - recorder unavailable or busy");
      return;
    }
    
    try {
      console.log("✅ Starting audio recording...");
      isRecordingAudio.current = true;
      audioChunks.current = [];
      recorder.start();
    } catch (error) {
      console.error("❌ Error starting audio recording:", error);
      isRecordingAudio.current = false;
    }
  };

  // Stop recording audio
  const stopAudioRecording = () => {
    // Use ref first (immediate access), then fall back to state
    const recorder = audioRecorderRef.current || audioRecorder;
    
    if (!recorder || recorder.state !== 'recording' || !isRecordingAudio.current) {
      console.log("❌ Cannot stop recording - recorder unavailable or not recording");
      return;
    }
    
    try {
      console.log("✅ Stopping audio recording...");
      isRecordingAudio.current = false;
      recorder.stop();
    } catch (error) {
      console.error("❌ Error stopping audio recording:", error);
    }
  };

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
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Update handleVideoEnd to properly handle state transitions
  const handleVideoEnd = () => {
    console.log("🎬 Video ended - switching to pause segment");
    
    const currentVideoState = currentVideoRef.current;

    if (currentVideoState?.pauseSegment && !currentVideoState.isPauseSegment) {
      console.log("🔄 Switching to pause segment");

      try {
        // Create pause segment state
        const pauseSegmentState = {
          url: currentVideoState.url,
          start: currentVideoState.pauseSegment.startTimestamp,
          end: currentVideoState.pauseSegment.endTimestamp,
          isPauseSegment: true,
          pauseSegment: currentVideoState.pauseSegment,
          question: currentVideoState.question, // Preserve question for debugging
        };

        setCurrentVideo(pauseSegmentState);
        currentVideoRef.current = pauseSegmentState;

        if (mainVideoRef.current) {
          const [minutes, seconds] = currentVideoState.pauseSegment.startTimestamp
            .split(":")
            .map(Number);
          const startTimeInSeconds = minutes * 60 + seconds;
          console.log("🔄 Setting video time to:", startTimeInSeconds);
          mainVideoRef.current.currentTime = startTimeInSeconds;
          mainVideoRef.current.play();
          setIsMainVideoPlaying(true);
          console.log("✅ Pause segment should be playing, voice detection active");
          
          // Ensure checkAudio is running for the new pause segment
          setTimeout(() => {
            console.log("🔄 Ensuring voice detection continues after pause segment switch...");
            if (currentVideoRef.current?.isPauseSegment) {
              checkAudio();
            }
          }, 500);
        }
      } catch (error) {
        console.error("❌ Error in handleVideoEnd:", error);
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

  // Voice detection logic
  const checkAudio = () => {
    try {
      // Don't run voice detection if interview ended
      if (showTimeUpModal) {
        console.log("🛑 Interview ended - stopping voice detection");
        return;
      }
      
      // Don't run voice detection during API calls
      if (isWaitingForResponse) {
        console.log("⏸️ API call in progress - pausing voice detection");
        setTimeout(() => {
          requestAnimationFrame(checkAudio);
        }, 500); // Check again in 500ms
        return;
      }
      
      const videoState = currentVideoRef.current;
      
      if (!videoState) {
        requestAnimationFrame(checkAudio);
        return;
      }

      if (!analyserRef.current) {
        console.log("🚨 Analyser missing - voice detection broken, need to restart audio");
        // Try to restart audio initialization
        setIsAudioInitialized(false);
        requestAnimationFrame(checkAudio);
        return;
      }

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (!videoState.isPauseSegment) {
        // Reset state when not in pause segment
        if (hasSpoken.current || silenceCount.current > 0) {
          console.log("🔄 Resetting voice detection state (not in pause segment)");
          hasSpoken.current = false;
          silenceCount.current = 0;
        }
        requestAnimationFrame(checkAudio);
        return;
      }

      // We're in pause segment - key debugging
      if (Math.floor(Date.now() / 2000) !== Math.floor((Date.now() - 16) / 2000)) {
        console.log("🎙️ Voice check - pause segment active:", {
          audioLevel: Math.round(average),
          hasSpoken: hasSpoken.current,
          silenceCount: silenceCount.current,
          questionId: videoState.currentTimestamp?.id
        });
      }

      // Adjust threshold for voice detection
      if (average > 10) {
        if (!hasSpoken.current) {
          console.log("🎤 User started speaking! Starting audio recording...");
          hasSpoken.current = true;
          startAudioRecording();
        }
        silenceCount.current = 0;
      } else if (hasSpoken.current) {
        silenceCount.current++;
        const silenceSeconds = Math.floor(silenceCount.current / 60);

        // Only log every second, not every frame
        if (silenceSeconds > 0 && silenceCount.current % 60 === 0) {
          console.log(`🔇 ${silenceSeconds} seconds of silence...`);
        }

        if (silenceCount.current >= 300) { // 5 seconds
          console.log("✅ 5 seconds of silence completed, stopping recording and loading next video");
          
          stopAudioRecording();
          hasSpoken.current = false;
          silenceCount.current = 0;
          
          // Wait for audio to be processed then load next question
          setTimeout(() => {
            console.log("🔄 Calling loadNextQuestion after audio processing delay...");
            loadNextQuestion();
          }, 1000);
          return; // Exit here - will restart when new pause segment is ready
        }
      }

      // Continue the animation frame loop
      requestAnimationFrame(checkAudio);
    } catch (error) {
      console.error("❌ Error in checkAudio:", error);
      console.log("🔄 Restarting checkAudio after error...");
      setTimeout(() => {
        requestAnimationFrame(checkAudio);
      }, 100);
    }
  };

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
            <h2 className="text-2xl font-bold text-red-600 mb-4">Interview Complete!</h2>
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
          professionalJudgementData={professionalJudgementData}
          setProfessionalJudgementData={setProfessionalJudgementData}
          setCurrentQuestionId={setCurrentQuestionId}
          currentVideoRef={currentVideoRef}
          setShowAdditionalMaterial={setShowAdditionalMaterial}
          currentScenarioRef={currentScenarioRef}
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
            isWaitingForResponse={isWaitingForResponse}
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
        candidatePrompt={professionalJudgementData?.candidatePrompt}
        background={professionalJudgementData?.background}
        showAdditionalMaterial={showAdditionalMaterial}
        setShowAdditionalMaterial={setShowAdditionalMaterial}
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
