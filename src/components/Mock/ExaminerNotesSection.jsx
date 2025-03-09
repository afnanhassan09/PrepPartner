import React, { useState } from "react";
import ExaminerIcon from "./icons/ExaminerIcon";
import MinimizeIcon from "./icons/MinimizeIcon";
import ExpandIcon from "./icons/ExpandIcon";

const ExaminerNotesSection = ({
  isExaminerNotesMinimized,
  setIsExaminerNotesMinimized,
}) => {
  const [examinerNotes, setExaminerNotes] =
    useState(`Medical School Interview - Examiner Guidelines

Key Areas to Assess:
1. Motivation & Commitment
 • Understanding of medical profession
 • Long-term career goals
 • Work experience/volunteering

2. Communication Skills
 • Clarity of expression
 • Active listening
 • Non-verbal communication
 • Professional demeanor

3. Ethical Awareness
 • Medical Awareness
 • Patient confidentiality
 • Current healthcare issues
 • Decision-making process

4. Academic Excellence
 • Scientific knowledge
 • Research experience
 • Study habits
 • Time management

5. Personal Qualities
 • Empathy and compassion
 • Leadership potential
 • Teamwork abilities
 • Stress management

Scoring Guidelines:
5 - Exceptional
4 - Above Average
3 - Satisfactory
2 - Needs Improvement
1 - Unsatisfactory

Additional Notes
• Watch for candidate's ability to handle pressure
• Assess problem-solving approach
• Note any unique experiences or perspectives
• Consider cultural awareness and sensitivity`);
  return (
    <div className="animate-fade-up mt-6">
      <div className="rounded-2xl bg-background-secondary/50 backdrop-blur-sm border border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ExaminerIcon />
            <h2 className="text-xl font-semibold text-black">Examiner Notes</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setIsExaminerNotesMinimized(!isExaminerNotesMinimized)
              }
              className="p-2 hover:bg-teal/10 rounded-lg transition-colors"
            >
              {isExaminerNotesMinimized ? <ExpandIcon /> : <MinimizeIcon />}
            </button>
          </div>
        </div>

        {!isExaminerNotesMinimized && (
          <div className="transition-all duration-300">
            <textarea
              value={examinerNotes}
              onChange={(e) => setExaminerNotes(e.target.value)}
              className="w-full h-96 bg-background/50 backdrop-blur-sm rounded-xl p-4 text-black placeholder-gray-400 
                        border border-border/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none
                        transition-all duration-200 resize-none scrollbar-thin scrollbar-thumb-purple-500/50 
                        scrollbar-track-transparent font-mono text-sm leading-relaxed"
              style={{
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.05)",
              }}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{examinerNotes.length} characters</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([examinerNotes], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "examiner-notes.txt";
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

export default ExaminerNotesSection;
