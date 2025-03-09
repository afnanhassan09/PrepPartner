import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, UserCheck, Search, Send, Users, UserCircle2, UserPlus2, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import APIService from "../server";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Fix for the "browser is not defined" error in onpage-dialog.preload.js
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('browser is not defined') || 
      event.filename?.includes('onpage-dialog.preload.js')
    )) {
      event.preventDefault();
      console.log('Prevented error from onpage-dialog.preload.js');
    }
  });
  
  // Define browser as window to prevent the error
  if (typeof window.browser === 'undefined') {
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
    chat: false
  });
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // State for actual data from API
  const [myFriends, setMyFriends] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const lastSentMessage = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
                  console.log("Removing existing socket listeners before initializing");
                  socketRef.current.off("receive_message");
                }
                
                socketRef.current = APIService.initializeSocket(userId);
              } else {
                console.error("User profile has no ID:", profileData.user);
              }
            }
          } else {
            const userId = getUserId(user);
            console.log(`Using existing user ID for socket: ${userId}`);
            
            // Disconnect any existing socket first
            if (socketRef.current) {
              console.log("Removing existing socket listeners before initializing");
              socketRef.current.off("receive_message");
            }
            
            socketRef.current = APIService.initializeSocket(userId);
          }
          
          // Set up socket message listener - IMPORTANT: Only set up once
          if (socketRef.current && isMounted) {
            // First, remove any existing listeners to prevent duplicates
            socketRef.current.off("receive_message");
            
            console.log("Setting up socket message listener");
            
            // Track received messages to prevent duplicates
            const receivedMessages = new Set();
            
            // Add the new listener with the provided format
            socketRef.current.on("receive_message", ({ senderId, message }) => {
              if (!isMounted) return;
              
              console.log(`New message from ${senderId}: ${message}`);
              
              // Create a unique message identifier
              const messageKey = `${senderId}_${message.substring(0, 20)}_${Date.now()}`;
              
              // Check if we've already processed this message recently
              if (receivedMessages.has(messageKey)) {
                console.log("Ignoring duplicate incoming message");
                return;
              }
              
              // Add to received messages set
              receivedMessages.add(messageKey);
              
              // Clean up old messages (keep set size manageable)
              if (receivedMessages.size > 100) {
                const iterator = receivedMessages.values();
                receivedMessages.delete(iterator.next().value);
              }
              
              // Find the sender in friends list
              let sender = myFriends.find(friend => getUserId(friend) === senderId);
              
              if (!sender) {
                console.log(`Sender not found in current friends list, fetching updated list`);
                // Fetch friends list immediately to get the latest data
                APIService.getAllFriends().then(response => {
                  if (response && response.friends) {
                    setMyFriends(response.friends);
                    // Try to find sender again in the updated list
                    sender = response.friends.find(friend => getUserId(friend) === senderId);
                    
                    if (sender) {
                      console.log(`Found sender in updated list: ${sender.name}`);
                      addMessageToState(senderId, message, sender);
                    } else {
                      console.log(`Sender still not found after refresh: ${senderId}`);
                    }
                  }
                }).catch(err => {
                  console.error("Error fetching updated friends list:", err);
                });
              } else {
                console.log(`Found sender: ${sender.name}`);
                addMessageToState(senderId, message, sender);
              }
            });
          } else {
            console.error("Failed to initialize socket");
          }
        } catch (error) {
          console.error("Error initializing user and socket:", error);
        }
      }
    };

    // Helper function to add message to state
    const addMessageToState = (senderId, messageText, sender) => {
      // Add message to state
      const newMessage = {
        id: Date.now(),
        sender: "them",
        text: messageText,
        timestamp: new Date().toISOString()
      };
      
      // Update UI instantly
      setMessages(prev => {
        const existingMessages = prev[senderId] || [];
        console.log(`Adding message to ${existingMessages.length} existing messages`);
        return {
          ...prev,
          [senderId]: [...existingMessages, newMessage]
        };
      });
      
      // Show notification if chat is not open with this user
      if (!activeChatUser || getUserId(activeChatUser) !== senderId) {
        toast({
          title: `New message from ${sender.name}`,
          description: messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText,
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
      fetchChatMessages(activeChatUser._id);
    }
  }, [activeChatUser]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChatUser]);

  // Add a reconnection mechanism
  useEffect(() => {
    // Check socket connection status periodically
    const checkSocketConnection = () => {
      if (isAuthenticated() && user && getUserId(user)) {
        const userId = getUserId(user);
        if (!socketRef.current || !APIService.socket || !APIService.socket.connected) {
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
      setLoading(prev => ({ ...prev, friends: true }));
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
      setLoading(prev => ({ ...prev, friends: false }));
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await APIService.getAllFriendRequests();
      console.log("Friend Requests Response:", response);
      
      // Make sure we handle different possible response structures
      const requests = response.friend_requests || [];
      console.log("Processed Friend Requests:", requests);
      
      // Ensure each request has the expected structure
      const validRequests = requests.filter(req => req && req.userId);
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
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, online: true }));
      const response = await APIService.getOnlineUsers();
      setGlobalUsers(response.online_users || []);
    } catch (err) {
      console.error("Error fetching online users:", err);
      // If error occurs, set empty array
      setGlobalUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, online: false }));
    }
  };

  const fetchChatMessages = async (userId) => {
    if (!userId) {
      console.error("Cannot fetch chat messages: No user ID provided");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, chat: true }));
      const chatMessages = await APIService.getChatWithUser(userId);
      
      // Format messages for our UI
      const formattedMessages = chatMessages.map((msg, index) => ({
        id: index,
        sender: msg.senderId === userId ? "them" : "me",
        text: msg.message,
        timestamp: msg.createdAt,
        seen: msg.seen
      }));
      
      setMessages(prev => ({
        ...prev,
        [userId]: formattedMessages
      }));
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      // Initialize with empty array if no messages
      setMessages(prev => ({
        ...prev,
        [userId]: []
      }));
    } finally {
      setLoading(prev => ({ ...prev, chat: false }));
    }
  };

  const filteredMyFriends = myFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlobalUsers = globalUsers.filter(user => 
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
      _id: userId // Ensure _id is always set
    };
    
    const isFriend = myFriends.some(friend => getUserId(friend) === userId);
    
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

  // Update sendMessage function to use getUserId and prevent duplicates
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
    
    // Prevent rapid duplicate messages
    const now = Date.now();
    const messageText = message.trim();
    const messageKey = `${receiverId}_${messageText}`;
    
    // Check if this exact message was sent in the last 2 seconds
    if (lastSentMessage.current && 
        lastSentMessage.current.key === messageKey && 
        now - lastSentMessage.current.time < 2000) {
      console.log("Preventing duplicate message send");
      return;
    }
    
    console.log(`Sending message to ${activeChatUser.name} (${receiverId})`);
    
    // Check socket connection before sending
    if (!socketRef.current || !socketRef.current.connected) {
      console.log("Reconnecting socket before sending message...");
      if (user && getUserId(user)) {
        const userId = getUserId(user);
        // First remove any existing listeners
        if (socketRef.current) {
          socketRef.current.off("receive_message");
        }
        socketRef.current = APIService.initializeSocket(userId);
        
        // Wait a bit for the connection to establish
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
    
    // Add message to UI immediately for better UX
    const newMessage = {
      id: now,
      sender: "me",
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    console.log("Adding message to UI:", newMessage);
    setMessages(prev => {
      const existingMessages = prev[receiverId] || [];
      return {
        ...prev,
        [receiverId]: [...existingMessages, newMessage]
      };
    });
    
    // Store this message as the last sent message
    lastSentMessage.current = {
      key: messageKey,
      time: now
    };
    
    // Clear input field
    setMessage("");
    
    try {
      // Send message via APIService which handles both socket and REST API
      console.log(`Calling APIService.sendMessage with receiverId: ${receiverId}`);
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
      setGlobalUsers(prev => prev.filter(u => getUserId(u) !== userId));
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
      console.log("Responding to request from user:", userId, "with response:", response);
      
      await APIService.respondToFriendRequest(userId, response);
      
      toast({
        title: "Success",
        description: response === "yes" 
          ? "Friend request accepted" 
          : "Friend request rejected",
      });
      
      // First update the UI to remove the request
      setFriendRequests(prev => 
        prev.filter(request => {
          const requestUserId = typeof request.userId === 'object' 
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
        description: "Failed to process friend request: " + (err.message || "Unknown error"),
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
    return name.split(' ').map(n => n[0]).join('');
  };

  // Update FriendCard component to use getUserId
  const FriendCard = ({ friend, type }) => (
    <div 
      className={`p-4 rounded-lg transition-all duration-300 cursor-pointer
        ${activeChatUser && getUserId(activeChatUser) === getUserId(friend) ? 'bg-primary/10' : 'hover:bg-secondary/50'}
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
            {type === "new" ? "Suggested Friend" : friend.online ? "Online" : "Offline"}
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
    const userId = typeof request.userId === 'object' 
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
              {request.type === "received" ? "Wants to connect with you" : "Request sent"}
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
          {request.type === "sent" && (
            <Badge variant="outline">Pending</Badge>
          )}
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
    
    return filteredMyFriends.map(friend => (
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
    
    return filteredGlobalUsers.map(user => (
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
        {friendRequests.filter(r => r.type === "received").length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-sm text-muted mb-2 px-2">Received Requests</h3>
            {friendRequests
              .filter(r => r.type === "received")
              .map(request => {
                const requestId = typeof request.userId === 'object' 
                  ? getUserId(request.userId) 
                  : request.userId;
                return (
                  <RequestCard 
                    key={requestId} 
                    request={request} 
                  />
                );
              })}
          </div>
        )}
        
        {friendRequests.filter(r => r.type === "sent").length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted mb-2 px-2">Sent Requests</h3>
            {friendRequests
              .filter(r => r.type === "sent")
              .map(request => {
                const requestId = typeof request.userId === 'object' 
                  ? getUserId(request.userId) 
                  : request.userId;
                return (
                  <RequestCard 
                    key={requestId} 
                    request={request} 
                  />
                );
              })}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated()) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">Please log in to access the friends feature.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-background">
      <div className="container h-full max-w-[1400px] mx-auto p-4">
        <div className="h-full rounded-xl border bg-white shadow-lg overflow-hidden flex">
          {/* Sidebar */}
          <div className={`w-full md:w-[380px] border-r flex flex-col ${isMobile && chatOpen ? 'hidden' : 'block'}`}>
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-teal mb-4">Friends</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                <Input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-2 pt-2 border-b">
                <TabsList className="grid grid-cols-3 w-full bg-secondary/50">
                  <TabsTrigger value="friends" className="flex items-center gap-2">
                    <UserCircle2 size={16} />
                    <span className="hidden sm:inline">Friends</span>
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="flex items-center gap-2">
                    <UserPlus2 size={16} />
                    <span className="hidden sm:inline">Requests</span>
                    {friendRequests.filter(r => r.type === "received").length > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {friendRequests.filter(r => r.type === "received").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="global" className="flex items-center gap-2">
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

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!isMobile || chatOpen ? 'block' : 'hidden'}`}>
            {activeChatUser ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(activeChatUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeChatUser.name}</h3>
                      <p className="text-xs text-muted">
                        {activeChatUser.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  {isMobile && (
                    <Button variant="ghost" size="sm" onClick={closeChat}>
                      ✕
                    </Button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading.chat ? (
                    <div className="text-center py-8">Loading messages...</div>
                  ) : messages[activeChatUser._id]?.length > 0 ? (
                    <>
                      {messages[activeChatUser._id].map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.sender === 'me' 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-secondary text-secondary-foreground rounded-tl-none'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted">
                      <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} className="bg-primary hover:bg-primary/90">
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
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

export default Friends; 