// Base configuration for API requests
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://preppartner-backend.onrender.com";

/**
 * Service class to handle all API communications with the backend
 */
class APIService {
  /**
   * Fetches a video based on station and index
   * @param {string} station - The station name (e.g. "Motivation")
   * @param {number} index - The video index
   * @returns {Promise<Object>} Video object containing url, nextIndex and other metadata
   */
  static async getMotivationVideo(station, index) {
    console.log("Sending request with:", { station, index });
    try {
      const response = await fetch(`${BASE_URL}/api/video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ station, index }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }
      const data = await response.json();
      
      // If nextIndex is -1, automatically fetch pause video
      if (data.nextIndex === -1) {
        const pauseVideo = await this.getPauseVideo();
        return {
          ...data,
          isLastVideo: true,
          pauseVideo
        };
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching motivation video:", error);
      throw error;
    }
  }

  /**
   * Gets the pause video URL
   * @returns {Promise<Object>} Object containing the pause video URL
   */
  static async getPauseVideo() {
    try {
      const response = await fetch(`${BASE_URL}/api/pause`);
      if (!response.ok) {
        throw new Error("Failed to fetch pause video");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching pause video:", error);
      throw error;
    }
  }

  /**
   * Sends audio file for transcription
   * @param {File} audioFile - The audio file to transcribe
   * @returns {Promise<Object>} Transcription result
   */
  static async transcribeAudio(audioFile) {
    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const response = await fetch(`${BASE_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw error;
    }
  }
}

export default APIService;
