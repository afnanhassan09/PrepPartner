import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  UserPlus,
  UserCheck,
  Search,
  Send,
  Users,
  UserCircle2,
  UserPlus2,
  Lock,
  AlertCircle,
  Video,
  PhoneCall,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import APIService from "../server";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Fix for the "browser is not defined" error in onpage-dialog.preload.js
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (
      event.message &&
      (event.message.includes("browser is not defined") ||
        event.filename?.includes("onpage-dialog.preload.js"))
    ) {
      event.preventDefault();
      console.log("Prevented error from onpage-dialog.preload.js");
    }
  });

  // Define browser as window to prevent the error
  if (typeof window.browser === "undefined") {
    window.browser = window;
  }
}

const Friends = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState({
    friends: false,
    requests: false,
    online: false,
    chat: false,
  });
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // State for actual data from API
  const [myFriends, setMyFriends] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const lastSentMessage = useRef(null);

  // New state variables for embedded video call
  const [activeCall, setActiveCall] = useState(null);
  const [callToken, setCallToken] = useState(null);
  const [callRoom, setCallRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callParticipants, setCallParticipants] = useState([]);
  const [twilioRoom, setTwilioRoom] = useState(null);

  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Modify scroll-related state
  const [autoScroll, setAutoScroll] = useState(false);
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Add this new state for the exit confirmation dialog
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
  // Add state for showing the scroll to bottom button
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Add new state to track joined meetings
  const [joinedMeetings, setJoinedMeetings] = useState(new Set());

  // Add state to track call status data
  const [callStatuses, setCallStatuses] = useState({});

  // Add this new function to handle scroll events in the chat container
  const handleChatScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      
      setShowScrollToBottom(isScrolledUp);
    }
  };

  // Move the scroll to bottom function to component level scope
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        setShowScrollToBottom(false);
        console.log("Scrolled to bottom");
      }, 100);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch friends, requests, and online users on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchFriends();
      fetchFriendRequests();
      fetchOnlineUsers();

      // Set up interval to refresh online users
      const onlineInterval = setInterval(fetchOnlineUsers, 30000);

      return () => clearInterval(onlineInterval);
    }
  }, [isAuthenticated]);

  // Initialize user profile and socket connection
  useEffect(() => {
    // Track if the component is mounted to prevent state updates after unmount
    let isMounted = true;

    const initializeUserAndSocket = async () => {
      if (isAuthenticated()) {
        try {
          // Get user profile if not already available
          if (!user || !getUserId(user)) {
            console.log("No user ID available, fetching profile...");
            const profileData = await APIService.getUserProfile();
            if (profileData && profileData.user && isMounted) {
              const userId = getUserId(profileData.user);
              if (userId) {
                console.log(`Initializing socket with user ID: ${userId}`);

                // Disconnect any existing socket first
                if (socketRef.current) {
                  console.log(
                    "Removing existing socket listeners before initializing"
                  );
                  socketRef.current.off("receive_message");
                }

                socketRef.current = APIService.initializeSocket(userId);

                if (socketRef.current) {
                  console.log(
                    "Socket connection status:",
                    socketRef.current.connected ? "Connected" : "Disconnected"
                  );

                  // Test the connection with a ping
                  socketRef.current.emit("ping");
                  socketRef.current.once("pong", () => {
                    console.log(
                      "Socket connection confirmed with pong response"
                    );
                  });
                }
              } else {
                console.error("User profile has no ID:", profileData.user);
              }
            }
          } else {
            const userId = getUserId(user);
            console.log(`Using existing user ID for socket: ${userId}`);

            // Disconnect any existing socket first
            if (socketRef.current) {
              console.log(
                "Removing existing socket listeners before initializing"
              );
              socketRef.current.off("receive_message");
            }

            socketRef.current = APIService.initializeSocket(userId);

            if (socketRef.current) {
              console.log(
                "Socket connection status:",
                socketRef.current.connected ? "Connected" : "Disconnected"
              );

              // Test the connection with a ping
              socketRef.current.emit("ping");
              socketRef.current.once("pong", () => {
                console.log("Socket connection confirmed with pong response");
              });
            }
          }

          // Set up socket message listener - IMPORTANT: Only set up once
          if (socketRef.current && isMounted) {
            // First, remove any existing listeners to prevent duplicates
            socketRef.current.off("receive_message");

            console.log("Setting up socket message listener");

            // Track received messages to prevent duplicates
            const receivedMessages = new Set();

            // Add the new listener with the provided format
            socketRef.current.on(
              "receive_message",
              ({ senderId, message, isVideoCall, roomName, roomId }) => {
                if (!isMounted) return;

                console.log(`New message from ${senderId}:`, {
                  message,
                  isVideoCall,
                  roomName,
                  roomId,
                });

                // Create a unique message identifier
                const messageKey = `${senderId}_${message.substring(
                  0,
                  20
                )}_${Date.now()}`;

                // Check if we've already processed this message recently
                if (receivedMessages.has(messageKey)) {
                  console.log("Ignoring duplicate incoming message");
                  return;
                }

                // Add to received messages set
                receivedMessages.add(messageKey);

                // Find the sender in friends list
                let sender = myFriends.find(
                  (friend) => getUserId(friend) === senderId
                );

                if (!sender) {
                  console.log(
                    `Sender not found in current friends list, fetching updated list`
                  );
                  APIService.getAllFriends()
                    .then((response) => {
                      if (response && response.friends) {
                        setMyFriends(response.friends);
                        sender = response.friends.find(
                          (friend) => getUserId(friend) === senderId
                        );

                        if (sender) {
                          console.log(
                            `Found sender in updated list: ${sender.name}`
                          );
                          addMessageToState(
                            senderId,
                            message,
                            sender,
                            isVideoCall,
                            roomName,
                            roomId
                          );
                        } else {
                          console.log(
                            `Sender still not found after refresh: ${senderId}`
                          );
                        }
                      }
                    })
                    .catch((err) => {
                      console.error(
                        "Error fetching updated friends list:",
                        err
                      );
                    });
                } else {
                  console.log(`Found sender: ${sender.name}`);
                  addMessageToState(
                    senderId,
                    message,
                    sender,
                    isVideoCall,
                    roomName,
                    roomId
                  );
                }
              }
            );
          } else {
            console.error("Failed to initialize socket");
          }
        } catch (error) {
          console.error("Error initializing user and socket:", error);
        }
      }
    };

    // Helper function to add message to state - update to include scrolling
    const addMessageToState = (
      senderId,
      messageText,
      sender,
      isVideoCall,
      roomName,
      roomId
    ) => {
      // Add message to state
      const newMessage = {
        id: Date.now(),
        sender: "them",
        text: messageText,
        timestamp: new Date().toISOString(),
        isVideoCall:
          isVideoCall || messageText.includes("Video call invitation:"),
        roomName:
          roomName ||
          (messageText.includes("Video call invitation:")
            ? messageText.split("Video call invitation: ")[1]
            : null),
        roomId: roomId,
      };

      console.log("Adding message to state:", newMessage);

      // Update UI instantly
      setMessages((prev) => {
        const existingMessages = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [...existingMessages, newMessage],
        };
      });

      // If this chat is currently open, scroll to bottom
      if (activeChatUser && getUserId(activeChatUser) === senderId) {
        scrollToBottom();
      }

      // Show notification if chat is not open with this user
      if (!activeChatUser || getUserId(activeChatUser) !== senderId) {
        toast({
          title: newMessage.isVideoCall
            ? `Video Call from ${sender.name}`
            : `New message from ${sender.name}`,
          description: newMessage.isVideoCall
            ? "Click to join the video call"
            : messageText.length > 30
            ? messageText.substring(0, 30) + "..."
            : messageText,
          duration: 5000,
        });
      }
    };

    // Only initialize once when the component mounts
    initializeUserAndSocket();

    // Clean up socket connection on unmount
    return () => {
      isMounted = false;
      if (socketRef.current) {
        console.log("Cleaning up socket message listener");
        socketRef.current.off("receive_message");
      }
    };
  }, [isAuthenticated, user, myFriends]); // Add myFriends as dependency

  // Fetch chat messages when active chat user changes
  useEffect(() => {
    if (activeChatUser) {
      fetchChatMessages(activeChatUser._id).then(() => {
        // Use the scrollToBottom function instead of duplicating code
        scrollToBottom();
      });
    }
  }, [activeChatUser]);

  // Update the effect that handles scrolling when receiving messages
  useEffect(() => {
    // This will scroll to the bottom when messages state changes
    // (like when receiving a new message)
    if (activeChatUser && messages[getUserId(activeChatUser)]?.length > 0) {
      scrollToBottom();
    }
  }, [messages, activeChatUser]);

  // Add a reconnection mechanism
  useEffect(() => {
    // Check socket connection status periodically
    const checkSocketConnection = () => {
      if (isAuthenticated() && user && getUserId(user)) {
        const userId = getUserId(user);
        if (
          !socketRef.current ||
          !APIService.socket ||
          !APIService.socket.connected
        ) {
          console.log("Socket disconnected, attempting to reconnect...");
          // Don't create a new socket reference, just reconnect the existing one
          if (APIService.socket) {
            APIService.socket.connect();
          } else {
            // Only create a new socket if one doesn't exist
            socketRef.current = APIService.initializeSocket(userId);
          }
        }
      }
    };

    // Check connection every 30 seconds
    const connectionInterval = setInterval(checkSocketConnection, 30000);

    return () => clearInterval(connectionInterval);
  }, [isAuthenticated, user]);

  const fetchFriends = async () => {
    try {
      setLoading((prev) => ({ ...prev, friends: true }));
      const response = await APIService.getAllFriends();
      setMyFriends(response.friends || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to load friends");
      toast({
        title: "Error",
        description: "Failed to load friends",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, friends: false }));
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setLoading((prev) => ({ ...prev, requests: true }));
      const response = await APIService.getAllFriendRequests();
      console.log("Friend Requests Response:", response);

      // Make sure we handle different possible response structures
      const requests = response.friend_requests || [];
      console.log("Processed Friend Requests:", requests);

      // Ensure each request has the expected structure
      const validRequests = requests.filter((req) => req && req.userId);
      console.log("Valid Requests:", validRequests);

      setFriendRequests(validRequests);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      toast({
        title: "Error",
        description: "Failed to load friend requests",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, online: true }));
      const response = await APIService.getOnlineUsers();
      setGlobalUsers(response.online_users || []);
    } catch (err) {
      console.error("Error fetching online users:", err);
      // If error occurs, set empty array
      setGlobalUsers([]);
    } finally {
      setLoading((prev) => ({ ...prev, online: false }));
    }
  };

  const fetchChatMessages = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch chat messages: No user ID provided");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, chat: true }));
      const chatMessages = await APIService.getChatWithUser(userId);

      // Process to remove potential duplicates
      const uniqueMessages = [];
      const messageKeys = new Set();

      // Format messages for our UI and deduplicate
      for (const msg of chatMessages) {
        // Create a unique key for this message
        const messageKey = `${msg.senderId}_${msg.receiverId}_${msg.message}_${msg.createdAt}`;
        
        // Only add if we haven't seen this message before
        if (!messageKeys.has(messageKey)) {
          messageKeys.add(messageKey);
          
          // Process video call messages
          if (msg.video_call && msg.room_name) {
            console.log("Processing video call message:", msg);
            
            // Ensure arrays are properly initialized
            const participants = msg.participants || [];
            const leftParticipants = msg.left_participants || [];
            
            // Store call status information
            setCallStatuses(prev => ({
              ...prev,
              [msg.room_name]: {
                participants: participants,
                leftParticipants: leftParticipants,
                status: msg.call_status || 'created',
                roomId: msg.room_id,
              }
            }));

            // Check if current user is a participant (convert to strings for comparison)
            const isParticipant = participants.some(p => {
              const pId = typeof p === 'object' ? (p._id || p.id) : p;
              return pId?.toString() === getUserId(user)?.toString();
            });
            
            if (isParticipant) {
              console.log(`User ${getUserId(user)} is a participant in room ${msg.room_name}`);
              setJoinedMeetings(prev => {
                const updated = new Set(prev);
                updated.add(msg.room_name);
                return updated;
              });
            }
          }

          uniqueMessages.push({
            id: msg._id || Date.now() + uniqueMessages.length,
            sender: msg.senderId === userId ? "them" : "me",
            text: msg.message,
            timestamp: msg.createdAt,
            seen: msg.seen,
            isVideoCall: msg.video_call,
            roomName: msg.room_name,
            roomId: msg.room_id,
            callStatus: msg.call_status,
            participants: msg.participants,
            leftParticipants: msg.left_participants
          });
        }
      }

      console.log(`Fetched ${chatMessages.length} messages, ${uniqueMessages.length} after deduplication`);
      
      setMessages((prev) => ({
        ...prev,
        [userId]: uniqueMessages,
      }));
      
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      // Initialize with empty array if no messages
      setMessages((prev) => ({
        ...prev,
        [userId]: [],
      }));
    } finally {
      setLoading((prev) => ({ ...prev, chat: false }));
    }
  };

  const filteredMyFriends = myFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlobalUsers = globalUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get user ID consistently
  const getUserId = (user) => {
    if (!user) return null;
    return user._id || user.id; // Handle both _id and id formats
  };

  // Update openChat function to handle both id and _id formats
  const openChat = (user) => {
    if (!user) {
      console.error("Cannot open chat: User object is null or undefined");
      toast({
        title: "Error",
        description: "Cannot open chat with this user",
        variant: "destructive",
      });
      return;
    }

    const userId = getUserId(user);
    if (!userId) {
      console.error("Cannot open chat: Invalid user object", user);
      toast({
        title: "Error",
        description: "Cannot open chat with this user",
        variant: "destructive",
      });
      return;
    }

    // Create a normalized user object with consistent _id field
    const normalizedUser = {
      ...user,
      _id: userId, // Ensure _id is always set
    };

    const isFriend = myFriends.some((friend) => getUserId(friend) === userId);

    if (!isFriend) {
      setSelectedUser(normalizedUser);
      setRequestDialogOpen(true);
    } else {
      console.log(`Opening chat with user: ${normalizedUser.name} (${userId})`);
      setActiveChatUser(normalizedUser);
      setChatOpen(true);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setActiveChatUser(null);
  };

  // Modify the sendMessage function to correctly scroll after sending a message
  const sendMessage = async () => {
    if (!message.trim()) return;

    if (!activeChatUser) {
      console.error("Cannot send message: No active chat user", activeChatUser);
      toast({
        title: "Error",
        description: "Cannot send message: Invalid recipient",
        variant: "destructive",
      });
      return;
    }

    const receiverId = getUserId(activeChatUser);
    if (!receiverId) {
      console.error("Cannot send message: Missing user ID", activeChatUser);
      toast({
        title: "Error",
        description: "Cannot send message: Invalid recipient",
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();
    const messageText = message.trim();
    const messageKey = `${receiverId}_${messageText}`;

    if (
      lastSentMessage.current &&
      lastSentMessage.current.key === messageKey &&
      now - lastSentMessage.current.time < 2000
    ) {
      console.log("Preventing duplicate message send");
      return;
    }

    console.log(`Sending message to ${activeChatUser.name} (${receiverId})`);

    if (!socketRef.current || !socketRef.current.connected) {
      console.log("Reconnecting socket before sending message...");
      if (user && getUserId(user)) {
        const userId = getUserId(user);
        if (socketRef.current) {
          socketRef.current.off("receive_message");
        }
        socketRef.current = APIService.initializeSocket(userId);

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!socketRef.current || !socketRef.current.connected) {
          console.error("Failed to reconnect socket");
          toast({
            title: "Connection Error",
            description: "Failed to establish connection. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        console.error("Cannot reconnect socket: No user ID available");
        return;
      }
    }

    const newMessage = {
      id: now,
      sender: "me",
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const existingMessages = prev[receiverId] || [];
      return {
        ...prev,
        [receiverId]: [...existingMessages, newMessage],
      };
    });

    lastSentMessage.current = {
      key: messageKey,
      time: now,
    };

    setMessage("");
    
    // Use the dedicated scroll function instead
    scrollToBottom();

    try {
      console.log(
        `Calling APIService.sendMessage with receiverId: ${receiverId}`
      );
      const result = await APIService.sendMessage(receiverId, messageText);
      console.log("Message sent successfully:", result);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendFriendRequest = async (user) => {
    if (!user) {
      console.error("Cannot send friend request: User is null or undefined");
      return;
    }

    const userId = getUserId(user);
    if (!userId) {
      console.error("Cannot send friend request: User has no ID", user);
      toast({
        title: "Error",
        description: "Cannot send friend request to this user",
        variant: "destructive",
      });
      return;
    }

    try {
      await APIService.sendFriendRequest(userId);
      toast({
        title: "Success",
        description: `Friend request sent to ${user.name}`,
      });

      // Update UI to reflect the pending request
      // Refresh friend requests list
      fetchFriendRequests();

      // Remove user from global list
      setGlobalUsers((prev) => prev.filter((u) => getUserId(u) !== userId));
    } catch (err) {
      console.error("Error sending friend request:", err);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const respondToFriendRequest = async (userId, response) => {
    if (!userId) {
      console.error("Cannot respond to friend request: No user ID provided");
      return;
    }

    try {
      console.log(
        "Responding to request from user:",
        userId,
        "with response:",
        response
      );

      await APIService.respondToFriendRequest(userId, response);

      toast({
        title: "Success",
        description:
          response === "yes"
            ? "Friend request accepted"
            : "Friend request rejected",
      });

      // First update the UI to remove the request
      setFriendRequests((prev) =>
        prev.filter((request) => {
          const requestUserId =
            typeof request.userId === "object"
              ? getUserId(request.userId)
              : request.userId;
          return requestUserId !== userId;
        })
      );

      // Then refresh the lists after a short delay to allow backend to process
      setTimeout(() => {
        fetchFriendRequests();
        if (response === "yes") {
          fetchFriends();
        }
      }, 500);
    } catch (err) {
      console.error("Error responding to friend request:", err);
      toast({
        title: "Error",
        description:
          "Failed to process friend request: " +
          (err.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  const handleFriendRequest = () => {
    if (selectedUser) {
      sendFriendRequest(selectedUser);
      setRequestDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Update FriendCard component to use getUserId
  const FriendCard = ({ friend, type }) => (
    <div
      className={`p-4 rounded-lg transition-all duration-300 cursor-pointer
        ${
          activeChatUser && getUserId(activeChatUser) === getUserId(friend)
            ? "bg-primary/10"
            : "hover:bg-secondary/50"
        }
      `}
      onClick={() => openChat(friend)}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(friend.name)}
            </AvatarFallback>
          </Avatar>
          {friend.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{friend.name}</h3>
          <p className="text-sm text-muted truncate">
    
          </p>
        </div>
        {type === "new" && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(friend);
              setRequestDialogOpen(true);
            }}
            className="text-xs"
          >
            <UserPlus size={16} className="mr-1" />
            Add
          </Button>
        )}
      </div>
    </div>
  );

  // Update RequestCard to use getUserId
  const RequestCard = ({ request }) => {
    // Get user ID consistently
    const userId =
      typeof request.userId === "object"
        ? getUserId(request.userId)
        : request.userId;

    const userName = request.name;

    return (
      <div className="p-4 rounded-lg border mb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{userName}</h3>
            <p className="text-sm text-muted">
              {request.type === "received"
                ? "Wants to connect with you"
                : "Request sent"}
            </p>
          </div>
          {request.type === "received" && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => respondToFriendRequest(userId, "no")}
                className="text-xs"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => respondToFriendRequest(userId, "yes")}
                className="text-xs"
              >
                Accept
              </Button>
            </div>
          )}
          {request.type === "sent" && <Badge variant="outline">Pending</Badge>}
        </div>
      </div>
    );
  };

  // Update renderFriendsList to use getUserId for keys
  const renderFriendsList = () => {
    if (loading.friends) {
      return <div className="text-center py-8">Loading friends...</div>;
    }

    if (filteredMyFriends.length === 0) {
      return (
        <div className="text-center py-8 text-muted">
          <UserCircle2 size={48} className="mx-auto mb-2 opacity-50" />
          <p>No friends yet</p>
          <p className="text-sm">Switch to the Global tab to find friends</p>
        </div>
      );
    }

    return filteredMyFriends.map((friend) => (
      <FriendCard key={getUserId(friend)} friend={friend} type="friend" />
    ));
  };

  // Update renderGlobalUsersList to use getUserId for keys
  const renderGlobalUsersList = () => {
    if (loading.online) {
      return <div className="text-center py-8">Loading online users...</div>;
    }

    if (filteredGlobalUsers.length === 0) {
      return (
        <div className="text-center py-8 text-muted">
          <Users size={48} className="mx-auto mb-2 opacity-50" />
          <p>No online users found</p>
        </div>
      );
    }

    return filteredGlobalUsers.map((user) => (
      <FriendCard key={getUserId(user)} friend={user} type="new" />
    ));
  };

  // Update renderFriendRequests to use getUserId for keys
  const renderFriendRequests = () => {
    if (loading.requests) {
      return <div className="text-center py-8">Loading requests...</div>;
    }

    if (friendRequests.length === 0) {
      return (
        <div className="text-center py-8 text-muted">
          <UserPlus2 size={48} className="mx-auto mb-2 opacity-50" />
          <p>No friend requests</p>
        </div>
      );
    }

    return (
      <div>
        {friendRequests.filter((r) => r.type === "received").length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-sm text-muted mb-2 px-2">
              Received Requests
            </h3>
            {friendRequests
              .filter((r) => r.type === "received")
              .map((request) => {
                const requestId =
                  typeof request.userId === "object"
                    ? getUserId(request.userId)
                    : request.userId;
                return <RequestCard key={requestId} request={request} />;
              })}
          </div>
        )}

        {friendRequests.filter((r) => r.type === "sent").length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted mb-2 px-2">
              Sent Requests
            </h3>
            {friendRequests
              .filter((r) => r.type === "sent")
              .map((request) => {
                const requestId =
                  typeof request.userId === "object"
                    ? getUserId(request.userId)
                    : request.userId;
                return <RequestCard key={requestId} request={request} />;
              })}
          </div>
        )}
      </div>
    );
  };

  // Update the createMeeting function
  const createMeeting = async () => {
    if (!activeChatUser) {
      console.error("Cannot create meeting: No active chat user");
      return;
    }

    try {
      console.log("Creating meeting with user:", activeChatUser);
      const userId = getUserId(activeChatUser);
      console.log("User ID for meeting:", userId);

      // Check if we have a valid token
      const token = APIService.getToken();
      console.log("Using auth token:", token ? "Valid token" : "No token");

      const response = await APIService.createMeeting(activeChatUser);
      console.log("Meeting creation response:", response);

      if (response.roomName && response.roomId) {
        // Add message to UI immediately for better UX
        const newMessage = {
          id: Date.now(),
          sender: "me",
          text: `Video call invitation: ${response.roomName}`,
          timestamp: new Date().toISOString(),
          isVideoCall: true,
          roomName: response.roomName,
          roomId: response.roomId,
        };

        setMessages((prev) => {
          const existingMessages = prev[getUserId(activeChatUser)] || [];
          return {
            ...prev,
            [getUserId(activeChatUser)]: [...existingMessages, newMessage],
          };
        });

        toast({
          title: "Success",
          description: "Video call created successfully",
        });
      } else {
        console.error("Invalid meeting response:", response);
        throw new Error("Invalid meeting response");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Error",
        description:
          "Failed to create video call: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  // Update joinVideoCall function to handle server errors better
  const joinVideoCall = async (roomName) => {
    // Check if user already joined this meeting
    if (joinedMeetings.has(roomName)) {
      toast({
        title: "Already Joined",
        description: "You've already joined this meeting",
        variant: "default",
      });
      return;
    }
    
    try {
      console.log("Joining video call for room:", roomName);

      // Call the API to update join status
      try {
        const joinResponse = await APIService.joinVideoCall(roomName);
        console.log("Join video call response:", joinResponse);
      } catch (joinError) {
        console.error("Error in joinVideoCall API call:", joinError);
        // Continue with the flow - we'll still try to get a token and join
      }

      // Get a token for this room
      const response = await APIService.getVideoToken(roomName);
      console.log("Video token response:", response);

      if (response.token) {
        setCallToken(response.token);
        setCallRoom(roomName);
        setActiveCall(activeChatUser);

        // Add this room to joined meetings (even if API call failed, we're still joining)
        setJoinedMeetings(prev => {
          const updated = new Set(prev);
          updated.add(roomName);
          return updated;
        });

        // Update call status locally
        const userId = getUserId(user);
        setCallStatuses(prev => {
          const currentStatus = prev[roomName] || {
            participants: [],
            leftParticipants: [],
            status: 'active'
          };
          
          // Add current user to participants if not already there
          if (!currentStatus.participants.some(p => {
            const pId = typeof p === 'object' ? (p._id || p.id) : p;
            return pId?.toString() === userId?.toString();
          })) {
            return {
              ...prev,
              [roomName]: {
                ...currentStatus,
                participants: [...currentStatus.participants, userId],
                status: 'active'
              }
            };
          }
          
          return prev;
        });

        // Initialize the video call
        initializeVideoCall(response.token, roomName);
      } else {
        throw new Error("Failed to get video token");
      }
    } catch (error) {
      console.error("Error joining video call:", error);
      toast({
        title: "Error",
        description:
          "Failed to join video call: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
  };

  // Initialize Twilio Video
  const initializeVideoCall = async (token, roomName) => {
    try {
      // Load Twilio Video SDK if not already loaded
      if (!window.Twilio || !window.Twilio.Video) {
        await loadTwilioSDK();
      }

      // Request camera and microphone permissions
      const localTracks = await window.Twilio.Video.createLocalTracks({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 24,
        },
      });

      // Display local video preview
      const videoTrack = localTracks.find((track) => track.kind === "video");
      if (videoTrack && localVideoRef.current) {
        videoTrack.attach(localVideoRef.current);
      }

      // Connect to the Twilio room
      const room = await window.Twilio.Video.connect(token, {
        name: roomName,
        tracks: localTracks,
      });

      console.log("Connected to room:", room.name);
      setTwilioRoom(room);

      // Set up event listeners for participants
      setupRoomEventListeners(room);
    } catch (error) {
      console.error("Error initializing video call:", error);
      toast({
        title: "Error",
        description:
          "Failed to initialize video call: " +
          (error.message || "Unknown error"),
        variant: "destructive",
      });
      endCall();
    }
  };

  // Load Twilio SDK dynamically
  const loadTwilioSDK = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://sdk.twilio.com/js/video/releases/2.26.0/twilio-video.min.js";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Twilio Video SDK"));

      document.body.appendChild(script);
    });
  };

  // Set up event listeners for the Twilio room
  const setupRoomEventListeners = (room) => {
    // Handle participants already in the room
    room.participants.forEach((participant) => {
      console.log("Existing participant:", participant.identity);
      handleParticipantConnected(participant);
    });

    // Handle participants joining the room
    room.on("participantConnected", (participant) => {
      console.log("New participant connected:", participant.identity);
      handleParticipantConnected(participant);
    });

    // Handle participants leaving the room with the new handler
    room.on("participantDisconnected", handleParticipantDisconnected);

    // Handle room disconnection events
    room.on("disconnected", (room, error) => {
      console.log("Disconnected from room due to:", error || "user action");
      cleanupVideoCall();
    });
    
    // Add more error handlers
    room.on("reconnecting", error => {
      console.log("Reconnecting to room due to:", error);
      toast({
        title: "Connection Issue",
        description: "Trying to reconnect to the call...",
        duration: 3000,
      });
    });
    
    room.on("reconnected", () => {
      console.log("Reconnected to room");
      toast({
        title: "Reconnected",
        description: "You've been reconnected to the call",
        duration: 3000,
      });
    });
  };

  // Handle a participant connecting to the room
  const handleParticipantConnected = (participant) => {
    setCallParticipants((prevParticipants) => [
      ...prevParticipants,
      participant,
    ]);

    // Handle participant's existing tracks
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        handleTrackSubscribed(participant, publication.track);
      }
    });

    // Handle participant's new tracks
    participant.on("trackSubscribed", (track) => {
      handleTrackSubscribed(participant, track);
    });

    // Handle participant's tracks being unsubscribed
    participant.on("trackUnsubscribed", (track) => {
      handleTrackUnsubscribed(track);
    });
  };

  // Handle a participant disconnecting from the room
  const handleParticipantDisconnected = (participant) => {
    console.log("Participant disconnected:", participant.identity);
    
    // Update participants list
    setCallParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );

    // Force check if we should end the call - either when all participants leave
    // or when we detect the remote participant left
    const shouldEndCall = twilioRoom && (
      twilioRoom.participants.size === 0 || 
      // Check if the participant that left is the remote user (not us)
      (participant.identity !== twilioRoom.localParticipant.identity)
    );

    if (shouldEndCall) {
      console.log("Other participant left or room empty, ending call");
      
      // Show a toast notification
      toast({
        title: "Call Ended",
        description: `${activeChatUser?.name || 'The other user'} has left the call`,
        duration: 3000,
      });
      
      // End the call and clean up completely
      cleanupVideoCall();
    }
  };

  // Update the cleanupVideoCall function to record when user leaves
  const cleanupVideoCall = async () => {
    console.log("Cleaning up video call");
    
    // Track that user has left this call on the server
    if (callRoom) {
      try {
        await APIService.leaveVideoCall(callRoom);
        
        // Update call status locally
        setCallStatuses(prev => {
          if (prev[callRoom]) {
            const userIdStr = getUserId(user);
            return {
              ...prev,
              [callRoom]: {
                ...prev[callRoom],
                leftParticipants: [
                  ...(prev[callRoom].leftParticipants || []),
                  { _id: userIdStr, timestamp: new Date() }
                ]
              }
            };
          }
          return prev;
        });
      } catch (err) {
        console.error("Error recording call exit:", err);
      }
    }
    
    // Properly clean up Twilio room and all tracks
    if (twilioRoom) {
      try {
        // Disconnect from the Twilio room
        twilioRoom.disconnect();
        
        // Stop all local tracks
        twilioRoom.localParticipant.tracks.forEach(publication => {
          const track = publication.track;
          if (track) {
            track.stop(); // This properly stops the camera/microphone
            track.detach().forEach(element => {
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
            });
          }
        });
        
        // Clean up any remote participant tracks
        twilioRoom.participants.forEach(participant => {
          participant.tracks.forEach(publication => {
            if (publication.track) {
              publication.track.detach().forEach(element => {
                if (element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              });
            }
          });
        });
        
        console.log("Successfully cleaned up all media tracks and disconnected from room");
      } catch (err) {
        console.error("Error cleaning up Twilio room:", err);
      }
    }
    
    // Clean up video elements
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject;
      if (stream) {
        // Stop all tracks in the stream to fully release camera/mic
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped ${track.kind} track`);
        });
      }
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      const stream = remoteVideoRef.current.srcObject;
      if (stream) {
        // Stop all tracks in the remote stream
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped remote ${track.kind} track`);
        });
      }
      remoteVideoRef.current.srcObject = null;
    }
    
    // Additional cleanup for any lingering MediaStream tracks
    try {
      // Force browser to release camera/mic by requesting and immediately stopping
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          stream.getTracks().forEach(track => {
            track.stop();
            console.log(`Released ${track.kind} device`);
          });
        })
        .catch(err => console.log("No additional media devices to clean up"));
    } catch (err) {
      console.log("Error during additional media cleanup:", err);
    }

    // Reset all video call related state
    setTwilioRoom(null);
    setActiveCall(null);
    setCallToken(null);
    setCallRoom(null);
    setCallParticipants([]);
    setIsMuted(false);
    setIsVideoOff(false);
    setShowExitConfirmation(false);

    // Add a small delay before scrolling to the latest messages
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // Handle a new track from a participant
  const handleTrackSubscribed = (participant, track) => {
    if (track.kind === "video") {
      if (remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
      }
    } else if (track.kind === "audio") {
      track.attach(); // Audio doesn't need a visible element
    }
  };

  // Handle a track being unsubscribed
  const handleTrackUnsubscribed = (track) => {
    track.detach().forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  };

  // Toggle mute state
  const toggleMute = () => {
    if (twilioRoom) {
      twilioRoom.localParticipant.audioTracks.forEach((publication) => {
        if (isMuted) {
          publication.track.enable();
        } else {
          publication.track.disable();
        }
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video state
  const toggleVideo = () => {
    if (twilioRoom) {
      twilioRoom.localParticipant.videoTracks.forEach((publication) => {
        if (isVideoOff) {
          publication.track.enable();
        } else {
          publication.track.disable();
        }
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // End the call and clean up
  const endCall = () => {
    // If confirmation is already showing, actually end the call
    if (showExitConfirmation) {
      cleanupVideoCall();
    } else {
      // Show the confirmation dialog
      setShowExitConfirmation(true);
      
      // Auto-hide the confirmation after 3 seconds if not acted upon
      setTimeout(() => {
        setShowExitConfirmation(false);
      }, 3000);
    }
  };

  // Add effect to listen for call events
  useEffect(() => {
    if (socketRef.current) {
      // Remove any existing listeners to prevent duplicates
      socketRef.current.off("call_event");
      
      // Set up listener for call events
      socketRef.current.on("call_event", (data) => {
        console.log("Received call event:", data);
        
        if (data.event === 'user_joined' || data.event === 'user_left') {
          // Refresh call status
          if (data.roomName) {
            // Update the call status for this room
            setCallStatuses(prev => {
              const current = prev[data.roomName] || { 
                participants: [], 
                leftParticipants: [] 
              };
              
              if (data.event === 'user_joined') {
                // Add user to participants if not already there
                const participants = current.participants || [];
                if (!participants.includes(data.userId)) {
                  participants.push(data.userId);
                }
                
                return {
                  ...prev,
                  [data.roomName]: {
                    ...current,
                    participants,
                    status: 'active'
                  }
                };
              } else if (data.event === 'user_left') {
                // Add user to left participants
                const leftParticipants = current.leftParticipants || [];
                if (!leftParticipants.some(p => p._id === data.userId)) {
                  leftParticipants.push({ 
                    _id: data.userId, 
                    timestamp: new Date() 
                  });
                }
                
                return {
                  ...prev,
                  [data.roomName]: {
                    ...current,
                    leftParticipants
                  }
                };
              }
              
              return prev;
            });
            
            // Show a notification
            const eventUser = data.user?.name || 'Someone';
            const action = data.event === 'user_joined' ? 'joined' : 'left';
            
            toast({
              title: `Call Update`,
              description: `${eventUser} has ${action} the call`,
              duration: 5000,
            });
            
            // If we're in a call and the other person left, end our call
            if (data.event === 'user_left' && activeCall && callRoom === data.roomName) {
              toast({
                title: "Call Ended",
                description: `${eventUser} has left the call`,
                duration: 3000,
              });
              
              // Clean up the call if we're still in it
              if (twilioRoom) {
                cleanupVideoCall();
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("call_event");
      }
    };
  }, [socketRef.current, activeCall, callRoom]);

  if (!isAuthenticated()) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">Please log in to access the friends feature.</p>
          <Button onClick={() => (window.location.href = "/auth")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-background overflow-hidden friends-page-container">
      <div className="container h-full max-w-[1400px] mx-auto p-4">
        <div className="h-full rounded-xl border bg-white shadow-lg overflow-hidden flex">
          {/* Sidebar */}
          <div
            className={`w-full md:w-[380px] border-r flex flex-col ${
              isMobile && chatOpen ? "hidden" : "block"
            }`}
          >
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-teal mb-4">Friends</h1>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs
              defaultValue="friends"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-2 pt-2 border-b">
                <TabsList className="grid grid-cols-3 w-full bg-secondary/50">
                  <TabsTrigger
                    value="friends"
                    className="flex items-center gap-2"
                  >
                    <UserCircle2 size={16} />
                    <span className="hidden sm:inline">Friends</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="requests"
                    className="flex items-center gap-2"
                  >
                    <UserPlus2 size={16} />
                    <span className="hidden sm:inline">Requests</span>
                    {friendRequests.filter((r) => r.type === "received")
                      .length > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {
                          friendRequests.filter((r) => r.type === "received")
                            .length
                        }
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="global"
                    className="flex items-center gap-2"
                  >
                    <Users size={16} />
                    <span className="hidden sm:inline">Global</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                <TabsContent value="friends" className="space-y-2 mt-0">
                  {renderFriendsList()}
                </TabsContent>

                <TabsContent value="requests" className="mt-0">
                  {renderFriendRequests()}
                </TabsContent>

                <TabsContent value="global" className="space-y-2 mt-0">
                  {renderGlobalUsersList()}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Chat Area - Fix the layout structure */}
          <div
            className={`flex-1 flex flex-col overflow-hidden ${
              !isMobile || chatOpen ? "block" : "hidden"
            }`}
          >
            {activeChatUser ? (
              <>
                {activeCall ? (
                  // Video call UI - Now takes over the whole interface
                  <div className="absolute inset-0 z-10">
                    {/* Semi-transparent blurred background */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
                    
                    <div className="relative h-full flex flex-col p-4 z-20">
                      {/* Move call info bar to the top of the page */}
                      <div className="fixed top-[6rem] left-0 right-0 bg-black/40 text-white px-6 py-3 z-50 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(activeChatUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Call with {activeChatUser.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-green-500/20 px-3 py-1 rounded-full">
                            {callParticipants.length > 0 ? "Connected" : "Connecting..."}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row gap-4 justify-center items-center pt-20">
                        {/* Local video */}
                        <div className="w-full md:w-1/2 h-48 md:h-[55vh] bg-gray-900 rounded-lg overflow-hidden relative shadow-xl">
                          <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          ></video>
                          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                            You
                          </div>
                          {isVideoOff && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                              <VideoOff size={48} className="text-white/50" />
                            </div>
                          )}
                        </div>

                        {/* Remote video */}
                        <div className="w-full md:w-1/2 h-48 md:h-[55vh] bg-gray-900 rounded-lg overflow-hidden relative shadow-xl">
                          {callParticipants.length > 0 ? (
                            <>
                              <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                              ></video>
                              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                                {activeChatUser.name}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white">
                              <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
                              <p>Waiting for {activeChatUser.name} to join...</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video call controls */}
                      <div className="p-4 mt-4 flex justify-center gap-4">
                        <Button
                          variant={isMuted ? "destructive" : "outline"}
                          size="icon"
                          className="rounded-full h-12 w-12 shadow-lg transition-all hover:scale-110 bg-white/90 backdrop-blur-sm"
                          onClick={toggleMute}
                        >
                          {isMuted ? <MicOff size={20} className="text-red-500" /> : <Mic size={20} className="text-primary" />}
                        </Button>

                        <Button
                          variant={isVideoOff ? "destructive" : "outline"}
                          size="icon"
                          className="rounded-full h-12 w-12 shadow-lg transition-all hover:scale-110 bg-white/90 backdrop-blur-sm"
                          onClick={toggleVideo}
                        >
                          {isVideoOff ? (
                            <VideoOff size={20} className="text-red-500" />
                          ) : (
                            <Video size={20} className="text-primary" />
                          )}
                        </Button>

                        {/* Exit call button with confirmation */}
                        <div className="relative">
                          <Button
                            variant="destructive"
                            size="icon"
                            className={`rounded-full h-12 w-12 shadow-lg transition-all ${
                              showExitConfirmation ? "scale-110 animate-pulse" : "hover:scale-110"
                            } bg-red-500/90 backdrop-blur-sm`}
                            onClick={endCall}
                          >
                            <X size={20} className="text-white" />
                          </Button>
                          
                          {/* Exit confirmation tooltip */}
                          {showExitConfirmation && (
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                              Click again to end call
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Chat UI with fixed layout - single scrollbar
                  <div className="flex flex-col h-full relative">
                    {/* Chat header - fixed height */}
                    <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(activeChatUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{activeChatUser.name}</h3>
                          <p className="text-xs text-muted">
                    
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!activeCall && (
                          <Button
                            onClick={createMeeting}
                            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 transition-all rounded-full h-9 px-4"
                            size="sm"
                          >
                            <Video size={16} className="text-primary" />
                            <span className="font-medium text-black">Video Call</span>
                          </Button>
                        )}
                        {isMobile && (
                          <Button variant="ghost" size="sm" onClick={closeChat}>
                            ✕
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Content container with messages - takes up all available space minus header and input heights */}
                    <div className="h-[calc(100%_-_180px)]">
                      {/* Message container - the only scrollable element */}
                      <div
                        ref={chatContainerRef}
                        className="h-full overflow-y-auto p-4 pb-20 space-y-4 chat-messages-container"
                        onScroll={handleChatScroll}
                      >
                        {loading.chat ? (
                          <div className="text-center py-8">
                            Loading messages...
                          </div>
                        ) : messages[activeChatUser._id]?.length > 0 ? (
                          <>
                            {messages[activeChatUser._id].map((msg, index) => (
                              <div
                                key={msg.id}
                                ref={
                                  index ===
                                  messages[activeChatUser._id].length - 1
                                    ? lastMessageRef
                                    : null
                                }
                                className={`flex ${
                                  msg.sender === "me"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    msg.sender === "me"
                                      ? "bg-primary text-primary-foreground rounded-tr-none"
                                      : "bg-secondary text-secondary-foreground rounded-tl-none"
                                  }`}
                                >
                                  {msg.isVideoCall ||
                                  msg.text.includes("Video call invitation:") ? (
                                    <div className="space-y-2">
                                      <p className="font-medium flex items-center gap-2">
                                        <Video size={16} className={msg.sender === "me" ? "text-primary-foreground" : "text-primary"} />
                                        Video Call Invitation
                                      </p>
                                      {(() => {
                                        const roomName = msg.roomName || msg.text.split("Video call invitation: ")[1];
                                        const hasJoined = joinedMeetings.has(roomName);
                                        const callStatus = callStatuses[roomName];
                                        
                                        // Check if other user left the call
                                        const otherUserId = getUserId(activeChatUser);
                                        const otherUserLeft = callStatus?.leftParticipants?.some(p => {
                                          // Handle different object formats
                                          if (typeof p === 'object') {
                                            const leftId = p._id || p.id;
                                            return leftId?.toString() === otherUserId?.toString();
                                          }
                                          return p?.toString() === otherUserId?.toString();
                                        });
                                        
                                        // Determine button state and text
                                        let buttonDisabled = hasJoined || (callStatus?.status === 'ended');
                                        let buttonIcon = <PhoneCall size={16} />;
                                        let buttonText = "Join Video Call";
                                        
                                        if (hasJoined) {
                                          buttonIcon = <UserCheck size={16} />;
                                          buttonText = "You joined this meeting";
                                        } else if (otherUserLeft) {
                                          buttonIcon = <X size={16} />;
                                          buttonText = `${activeChatUser.name} left the call`;
                                          buttonDisabled = true;
                                        } else if (callStatus?.status === 'ended') {
                                          buttonIcon = <X size={16} />;
                                          buttonText = "Call ended";
                                          buttonDisabled = true;
                                        }
                                        
                                        return (
                                          <Button
                                            variant={msg.sender === "me" ? "secondary" : "default"}
                                            size="sm"
                                            onClick={() => joinVideoCall(roomName)}
                                            disabled={buttonDisabled}
                                            className={`w-full flex items-center justify-center gap-2 rounded-md hover:shadow-md transition-all mt-2 h-10 
                                              ${buttonDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                                          >
                                            {buttonIcon}
                                            <span className="font-medium">{buttonText}</span>
                                          </Button>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    <p>{msg.text}</p>
                                  )}
                                  <p className="text-xs opacity-70 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-center py-8 text-muted">
                            <MessageSquare
                              size={48}
                              className="mx-auto mb-2 opacity-50"
                            />
                            <p>No messages yet</p>
                            <p className="text-sm">
                              Send a message to start the conversation
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Scroll to bottom button - positioned absolutely */}
                      {showScrollToBottom && (
                        <button
                          onClick={scrollToBottom}
                          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all animate-bounce"
                          aria-label="Scroll to latest message"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Message input - fixed at bottom */}
                    <div className="border-t bg-white p-4 pt-5 pb-5 flex-shrink-0 message-input-container">
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted">
                <div className="text-center">
                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                  />
                  <p>Select a friend to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Friend Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Friend Request</DialogTitle>
            <DialogDescription>
              Would you like to send a friend request to {selectedUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRequestDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFriendRequest}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add styles to fix toast notifications
const toastStyles = document.createElement("style");
toastStyles.innerHTML = `
  /* Ensure toasts appear above everything */
  [role="toast"] {
    z-index: 100000 !important;
    position: fixed !important;
  }

  /* Adjust toast container position */
  .toast-container {
    position: fixed !important;
    z-index: 100000 !important;
    top: 1rem !important;
    right: 1rem !important;
    left: auto !important;
    bottom: auto !important;
    margin-left: 4rem !important; /* Add space for navigation */
  }

  /* Make sure navigation doesn't overlap toasts */
  nav, header {
    z-index: 99999 !important;
  }
`;
document.head.appendChild(toastStyles);

// Add a style to ensure proper layout and scrolling
const chatStyles = document.createElement("style");
chatStyles.innerHTML = `
  /* Only apply overflow: hidden to the Friends page container, not to the whole document */
  .friends-page-container {
    height: 100%;
    overflow: hidden;
  }
  
  /* Main container should have no overflow */
  .h-full.rounded-xl.border.bg-white.shadow-lg.overflow-hidden.flex {
    display: flex !important;
    flex-direction: row !important;
    height: calc(100vh - 5rem) !important;
    max-height: calc(100vh - 5rem) !important;
    overflow: hidden !important;
  }
  
  /* Better chat container scrolling - this is the only element that should scroll */
  .chat-messages-container {
    overflow-y: auto !important;
    scroll-behavior: smooth !important;
    padding: 1rem !important;
    padding-bottom: 3rem !important; /* Add more padding at bottom to prevent messages being hidden */
  }
  
  /* Chat area properly fills space with no overflow */
  .flex-1.flex.flex-col.overflow-hidden {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    overflow: hidden !important;
  }
  
  /* Ensure proper flex layout for the chat UI */
  .flex.flex-col.h-full {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    max-height: 100% !important;
    overflow: hidden !important;
  }
  
  /* Style for the message input area */
  .message-input-container {
    background-color: white !important;
    border-top: 1px solid var(--border) !important;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05) !important;
    padding: 15px !important;
    position: sticky !important;
    bottom: 0 !important;
    z-index: 10 !important;
    width: 100% !important;
    flex-shrink: 0 !important;
  }
  
  /* Style the scroll to bottom button */
  button[aria-label="Scroll to latest message"] {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    opacity: 0.9 !important;
    transition: all 0.2s ease !important;
    z-index: 11 !important; /* Ensure it's above the input box */
  }
  
  button[aria-label="Scroll to latest message"]:hover {
    transform: scale(1.1) !important;
    opacity: 1 !important;
  }
`;
document.head.appendChild(chatStyles);

export default Friends;
