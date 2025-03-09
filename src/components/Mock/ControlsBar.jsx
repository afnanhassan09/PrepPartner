import React from "react";

import MicIcon from "./icons/MicIcon";
import SpeakerIcon from "./icons/SpeakerIcon";
import CameraIcon from "./icons/CameraIcon";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";
import RecordIcon from "./icons/RecordIcon";
import FullscreenIcon from "./icons/FullscreenIcon";
import ExitFullscreenIcon from "./icons/ExitFullscreenIcon";

const ControlsBar = ({
  toggleCamera,
  toggleMainVideo,
  isSessionRecording,
  stopSessionRecording,
  startSessionRecording,
  toggleFullscreen,
  isFullscreen,
  isCameraOn,
  isMainVideoPlaying,
  isMicListening,
  toggleMic,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
      <div className="flex justify-center items-center gap-6">
        {/* Mic Control */}
        <button
          onClick={toggleMic}
          className={`p-3 rounded-lg ${
            isMicListening ? "bg-red-500" : "bg-gray-600"
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
            isSessionRecording ? stopSessionRecording : startSessionRecording
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
  );
};

export default ControlsBar;
