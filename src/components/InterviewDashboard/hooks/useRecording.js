import { useRef, useState } from "react";
import APIService from "../../../server";

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSessionRecording, setIsSessionRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ... recording logic

  return {
    isRecording,
    startRecording,
    stopRecording,
    isSessionRecording,
    startSessionRecording,
    stopSessionRecording,
    recordingTime,
  };
};
