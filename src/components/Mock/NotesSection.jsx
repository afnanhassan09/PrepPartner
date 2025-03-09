import React from "react";
import NotesIcon from "./icons/NotesIcon";
import MinimizeIcon from "./icons/MinimizeIcon";
import ExpandIcon from "./icons/ExpandIcon";

const NotesSection = ({ notes, setNotes, isNotesMinimized, setIsNotesMinimized }) => {
  return (
    <div className="animate-fade-up">
      <div className="rounded-2xl bg-background-secondary/50 backdrop-blur-sm border border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <NotesIcon />
            <h2 className="text-xl font-semibold text-black">My Notes</h2>
          </div>
          <button
            onClick={() => setIsNotesMinimized(!isNotesMinimized)}
            className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
          >
            {isNotesMinimized ? <ExpandIcon /> : <MinimizeIcon />}
          </button>
        </div>

        {!isNotesMinimized && (
          <div className="transition-all duration-300">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your interview notes here..."
              className="w-full h-48 bg-background/50 backdrop-blur-sm rounded-xl p-4 text-black placeholder-gray-400 
                        border border-border/50 focus:border-teal focus:ring-1 focus:ring-teal outline-none
                        transition-all duration-200 resize-none scrollbar-thin scrollbar-thumb-teal/50 
                        scrollbar-track-transparent"
              style={{
                boxShadow: "0 0 20px rgba(20, 184, 166, 0.05)",
              }}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{notes.length} characters</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setNotes("")}
                  className="px-3 py-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([notes], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "interview-notes.txt";
                    a.click();
                  }}
                  className="px-3 py-1 rounded-lg bg-teal/10 hover:bg-teal/20 text-teal transition-colors"
                >
                  Download Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSection;