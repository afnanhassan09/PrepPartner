import { useState, useEffect } from "react";
import APIService from "../../../server";

export const useInterviewState = () => {
  const [messages, setMessages] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentStation, setCurrentStation] = useState("Motivation");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ... state management logic

  return {
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
  };
};
