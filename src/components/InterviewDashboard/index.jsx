import React from "react";
import { VideoSection } from "./VideoSection";
import { NotesSection } from "./NotesSection";
import { ExaminerNotesSection } from "./ExaminerNotesSection";
import { NavigationButtons } from "./NavigationButtons";
import { useInterviewState } from "./hooks/useInterviewState";
import { useRecording } from "./hooks/useRecording";
import { useWebcam } from "./hooks/useWebcam";
import { useTimers } from "./hooks/useTimers";

const InterviewDashboard = () => {
  const {
    messages,
    currentVideo,
    currentStation,
    currentIndex,
    sections,
    selectedSection,
    setSelectedSection,
    isMenuOpen,
    setIsMenuOpen,
    loadMotivationVideo,
  } = useInterviewState();

  const {
    isRecording,
    startRecording,
    stopRecording,
    isSessionRecording,
    startSessionRecording,
    stopSessionRecording,
    recordingTime,
  } = useRecording();

  const {
    webcamRef,
    isCameraOn,
    isAudioMuted,
    toggleCamera,
    toggleAudio,
    toggleWebcam,
    isWebcamPlaying,
  } = useWebcam();

  const {
    timeLeft,
    interviewTimeLeft,
    isCountdownActive,
    isInterviewTimerActive,
    handleStartClick,
  } = useTimers();

  return (
    <div className="h-full bg-background p-6 interview-container relative">
      <VideoSection
        currentVideo={currentVideo}
        webcamRef={webcamRef}
        isRecording={isRecording}
        timeLeft={timeLeft}
        interviewTimeLeft={interviewTimeLeft}
        isCountdownActive={isCountdownActive}
        isInterviewTimerActive={isInterviewTimerActive}
        handleStartClick={handleStartClick}
        isSessionRecording={isSessionRecording}
        recordingTime={recordingTime}
        isCameraOn={isCameraOn}
        isAudioMuted={isAudioMuted}
        isWebcamPlaying={isWebcamPlaying}
        toggleCamera={toggleCamera}
        toggleAudio={toggleAudio}
        toggleWebcam={toggleWebcam}
        startSessionRecording={startSessionRecording}
        stopSessionRecording={stopSessionRecording}
        sections={sections}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <NotesSection />

      <ExaminerNotesSection />

      <NavigationButtons selectedSection={selectedSection} />
    </div>
  );
};

export default InterviewDashboard;
