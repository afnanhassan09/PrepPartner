// Base configuration for API requests
const BASE_URL = "https://preppartner-backend.onrender.com";
import { io } from "socket.io-client";

/**
 * Service class to handle all API communications with the backend
 */
class APIService {
  static socket = null;
  static userId = null;

  // Track recently sent messages to prevent duplicates
  static recentMessages = new Map();

  /**
   * Helper function to get user ID consistently
   * @param {Object} user - User object
   * @returns {string|null} User ID
   */
  static getUserId(user) {
    if (!user) return null;
    return user._id || user.id; // Handle both _id and id formats
  }

  /**
   * Initialize socket connection
   * @param {string} userId - The current user's ID
   */
  static initializeSocket(userId) {
    if (!userId) {
      console.error("Cannot initialize socket: No user ID provided");
      return null;
    }

    // If we already have a socket for this user, just return it
    if (this.socket && this.userId === userId && this.socket.connected) {
      console.log(`Reusing existing socket connection for user ${userId}`);
      return this.socket;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      console.log(`Disconnecting existing socket for user ${this.userId}`);

      // Remove all listeners to prevent duplicates
      this.socket.off();

      // Disconnect the socket
      this.socket.disconnect();
      this.socket = null;
    }

    console.log(`Initializing socket for user ${userId}`);
    this.userId = userId;

    // Create new socket connection with better error handling
    try {
      this.socket = io(BASE_URL, {
        query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true, // Force a new connection to prevent reusing existing connections
      });

      // Log connection events
      this.socket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);

        // Attempt to reconnect if disconnected unexpectedly
        if (reason === "io server disconnect" || reason === "transport close") {
          console.log("Attempting to reconnect socket...");
          this.socket.connect();
        }
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Add a ping mechanism to keep the connection alive
      const pingInterval = setInterval(() => {
        if (this.socket && this.socket.connected) {
          this.socket.emit("ping");
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);

      return this.socket;
    } catch (error) {
      console.error("Error initializing socket:", error);
      return null;
    }
  }

  /**
   * Send a message via socket
   * @param {string|Object} receiver - The recipient's user ID or user object
   * @param {string} message - The message content
   */
  static sendSocketMessage(receiver, message) {
    // Get receiver ID consistently
    const receiverId =
      typeof receiver === "object" ? this.getUserId(receiver) : receiver;

    if (!receiverId) {
      console.error(
        "Cannot send socket message: No receiver ID provided",
        receiver
      );
      return false;
    }

    if (!message || !message.trim()) {
      console.error("Cannot send socket message: Empty message");
      return false;
    }

    // Prevent duplicate messages
    const messageKey = `${this.userId}_${receiverId}_${message}`;
    const now = Date.now();

    // Check if this exact message was sent in the last 2 seconds
    if (this.recentMessages.has(messageKey)) {
      const lastSent = this.recentMessages.get(messageKey);
      if (now - lastSent < 2000) {
        console.log("Preventing duplicate socket message");
        return true; // Return true to prevent API fallback
      }
    }

    // Store this message timestamp
    this.recentMessages.set(messageKey, now);

    // Clean up old messages (older than 10 seconds)
    for (const [key, timestamp] of this.recentMessages.entries()) {
      if (now - timestamp > 10000) {
        this.recentMessages.delete(key);
      }
    }

    if (!this.socket) {
      console.error("Socket not initialized");
      if (this.userId) {
        console.log("Attempting to initialize socket...");
        this.initializeSocket(this.userId);
      }
      return false;
    }

    if (!this.socket.connected) {
      console.error("Socket not connected. Attempting to reconnect...");
      this.socket.connect();

      // If still not connected after reconnect attempt, return false
      if (!this.socket.connected) {
        return false;
      }
    }

    console.log(`Sending message to ${receiverId}: ${message}`);

    try {
      this.socket.emit("send_message", {
        senderId: this.userId,
        receiverId,
        message,
      });
      return true;
    } catch (error) {
      console.error("Error sending socket message:", error);
      return false;
    }
  }

  /**
   * Disconnect socket
   */
  static disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Fetches a video based on station and index
   * @param {string} station - The station name (e.g. "Motivation")
   * @param {number} index - The video index
   * @returns {Promise<Object>} Video object containing url, nextIndex and other metadata
   */
  static async getMotivationVideo(station) {
    try {
      const response = await fetch(`${BASE_URL}/api/video/station`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ station }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

      const data = await response.json();
      const stationData = data[0]; // Get the first station object

      // Return a formatted object that matches our video player expectations
      return {
        url: stationData.URL,
        timestamps: stationData.timestamps,
        currentTimestamp: stationData.timestamps[0],
        nextIndex: 1,
        question: stationData.timestamps[0].question,
        start: stationData.timestamps[0].start,
        end: stationData.timestamps[0].end,
        totalTimestamps: stationData.timestamps.length,
        pauseSegment: stationData.pause,
      };
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

  /**
   * Registers a new user
   * @param {Object} userData - User registration data (name, email, password)
   * @returns {Promise<Object>} Registration response
   */
  static async register(userData) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  /**
   * Logs in a user
   * @param {Object} credentials - User login credentials (email, password)
   * @returns {Promise<Object>} Login response with token
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);

        // Initialize socket connection if user ID is available
        if (data.user) {
          const userId = this.getUserId(data.user);
          if (userId) {
            console.log(`Initializing socket for user ${userId}`);
            this.initializeSocket(userId);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  /**
   * Logs out the current user
   */
  static logout() {
    localStorage.removeItem("token");
    this.disconnectSocket();
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Gets the authentication token
   * @returns {string|null} The authentication token or null
   */
  static getToken() {
    return localStorage.getItem("token");
  }

  /**
   * Makes an authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} API response
   */
  static async authenticatedRequest(endpoint, options = {}) {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    try {
      console.log(
        `Making ${options.method || "GET"} request to ${BASE_URL}${endpoint}`
      );

      const response = await fetch(`${BASE_URL}${endpoint}`, mergedOptions);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server returned non-JSON response: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        // Special case for 404 on online users - return empty array instead of throwing
        if (endpoint === "/api/user/online" && response.status === 404) {
          console.log("No online users found, returning empty array");
          return { online_users: [] };
        }

        // Handle authentication errors
        if (response.status === 401) {
          console.error("Authentication failed. Token may be expired.");
          // Optionally clear the token
          // localStorage.removeItem("token");
          throw new Error("Authentication failed");
        }

        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error(
        `Error making authenticated request to ${endpoint}:`,
        error
      );
      console.error("Error making authenticated request:", error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise<Object>} Reset request response
   */
  static async requestPasswordReset(email) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/requestResetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset request failed");
      }

      return data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Reset data (token, newPassword)
   * @returns {Promise<Object>} Reset response
   */
  static async resetPassword(resetData) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      return data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  /**
   * Get all friends
   * @returns {Promise<Object>} List of friends
   */
  static async getAllFriends() {
    return this.authenticatedRequest("/api/user/friends");
  }

  /**
   * Get all friend requests
   * @returns {Promise<Object>} List of friend requests
   */
  static async getAllFriendRequests() {
    return this.authenticatedRequest("/api/user/friend/requests");
  }

  /**
   * Send a friend request
   * @param {string|Object} friend - ID of the user to send request to or user object
   * @returns {Promise<Object>} Request response
   */
  static async sendFriendRequest(friend) {
    // Get friend ID consistently
    const friendId =
      typeof friend === "object" ? this.getUserId(friend) : friend;

    if (!friendId) {
      console.error("Cannot send friend request: Invalid friend ID", friend);
      throw new Error("Invalid friend ID");
    }

    return this.authenticatedRequest("/api/user/friend/request", {
      method: "POST",
      body: JSON.stringify({ friendId }),
    });
  }

  /**
   * Accept or reject a friend request
   * @param {string|Object} friend - ID of the user who sent the request or user object
   * @param {string} response - 'yes' to accept, 'no' to reject
   * @returns {Promise<Object>} Response data
   */
  static async respondToFriendRequest(friend, response) {
    // Get friend ID consistently
    const friendId =
      typeof friend === "object" ? this.getUserId(friend) : friend;

    if (!friendId) {
      console.error(
        "Cannot respond to friend request: Invalid friend ID",
        friend
      );
      throw new Error("Invalid friend ID");
    }

    return this.authenticatedRequest("/api/user/friend/accept", {
      method: "POST",
      body: JSON.stringify({ friendId, response }),
    });
  }

  /**
   * Get all online users
   * @returns {Promise<Object>} List of online users
   */
  static async getOnlineUsers() {
    try {
      return await this.authenticatedRequest("/api/user/online");
    } catch (error) {
      // If the error is "No online users found", return empty array
      if (error.message === "No online users found") {
        console.log("No online users found, returning empty array");
        return { online_users: [] };
      }
      throw error;
    }
  }

  /**
   * Get chat history with a specific user
   * @param {string|Object} otherUser - ID of the other user or user object
   * @returns {Promise<Object>} Chat history
   */
  static async getChatWithUser(otherUser) {
    // Get user ID consistently
    const otherUserId =
      typeof otherUser === "object" ? this.getUserId(otherUser) : otherUser;

    if (!otherUserId) {
      console.error("Cannot get chat: Invalid user ID", otherUser);
      return [];
    }

    return this.authenticatedRequest(`/api/user/chats/${otherUserId}`);
  }

  /**
   * Get all contacts (users you've chatted with)
   * @returns {Promise<Object>} List of contacts
   */
  static async getAllContacts() {
    return this.authenticatedRequest("/api/user/contacts");
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  static async getUserProfile() {
    return this.authenticatedRequest("/api/user/profile");
  }

  /**
   * Send a message to another user
   * @param {string|Object} receiver - ID of the recipient or user object
   * @param {string} message - Message content
   * @returns {Promise<Object>} Message response
   */
  static async sendMessage(receiver, message) {
    // Get receiver ID consistently
    const receiverId =
      typeof receiver === "object" ? this.getUserId(receiver) : receiver;

    if (!receiverId) {
      console.error(
        "Cannot send message: receiverId is undefined or invalid",
        receiver
      );
      return { success: false, error: "Receiver ID is required" };
    }

    if (!message || !message.trim()) {
      console.error("Cannot send message: message is empty");
      return { success: false, error: "Message content is required" };
    }

    try {
      // Save to database via REST API but don't emit from server
      const response = await this.authenticatedRequest("/api/user/message", {
        method: "POST",
        body: JSON.stringify({
          receiverId,
          message,
          skipEmit: true, // Add this flag to tell the server not to emit
        }),
      });

      // After successful API call, emit via socket for real-time delivery
      this.sendSocketMessage(receiverId, message);

      return response;
    } catch (error) {
      console.error("Error sending message via API:", error);

      // Try socket as fallback if API fails
      const socketSent = this.sendSocketMessage(receiverId, message);
      if (socketSent) {
        return {
          success: true,
          warning: "Message sent in real-time but may not be saved",
        };
      }

      throw error;
    }
  }

  /**
   * Create a video call with another user
   * @param {string|Object} receiver - ID of the recipient or user object
   * @returns {Promise<Object>} Meeting response with room information
   */
  static async createMeeting(receiver) {
    // Get receiver ID consistently
    const receiverId =
      typeof receiver === "object" ? this.getUserId(receiver) : receiver;

    if (!receiverId) {
      console.error(
        "Cannot create meeting: receiverId is undefined or invalid",
        receiver
      );
      throw new Error("Receiver ID is required");
    }

    console.log("Creating meeting with receiverId:", receiverId);

    try {
      const response = await this.authenticatedRequest("/api/meeting", {
        method: "POST",
        body: JSON.stringify({ receiverId }),
      });

      console.log("Meeting creation API response:", response);
      return response;
    } catch (error) {
      console.error("Error in createMeeting API call:", error);
      throw error;
    }
  }

  /**
   * Get a Twilio token for a video room
   * @param {string} roomName - The name of the room to join
   * @returns {Promise<Object>} Token response
   */
  static async getVideoToken(roomName) {
    return this.authenticatedRequest("/api/video/token", {
      method: "POST",
      body: JSON.stringify({ roomName }),
    });
  }
}

export default APIService;
