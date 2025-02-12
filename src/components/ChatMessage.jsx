import React from 'react';

const ChatMessage = ({ sender, message, timestamp, isTranscribing }) => {
  const isAI = sender === 'AI';
  
  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fade-up`}>
      {/* Avatar - Only shown for AI messages */}
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-teal-foreground text-sm">
          AI
        </div>
      )}
      
      {/* Message Bubble */}
      <div className={`max-w-[80%] rounded-2xl p-3 ${
        isAI 
          ? 'bg-teal text-teal-foreground rounded-tl-sm' 
          : 'bg-primary text-primary-foreground rounded-tr-sm'
      }`}>
        {/* Sender Name */}
        <div className="font-semibold mb-1 text-sm">
          {isAI ? 'AI' : 'You'}
        </div>
        
        {/* Message Content */}
        <div className="text-base break-words">
          {isTranscribing ? (
            <div className="flex items-center gap-2">
              <span className="animate-pulse">Transcribing audio...</span>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            message
          )}
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <div className="text-xs mt-1 opacity-75">
            {timestamp}
          </div>
        )}
      </div>

      {/* Avatar - Only shown for user messages */}
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground text-sm">
          You
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 