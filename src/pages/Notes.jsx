import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotesPage = () => {
  const [allNotes, setAllNotes] = useState({});
  const [flaggedSections, setFlaggedSections] = useState([]);
  const [readCounts, setReadCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get all notes from localStorage
    const notes = {};
    const flagged = [];
    const counts = {};
    
    // Get all keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Get notes
      if (key.startsWith('notes-')) {
        const section = key.replace('notes-', '');
        const noteContent = localStorage.getItem(key);
        if (noteContent && noteContent.trim() !== '') {
          notes[section] = noteContent;
        }
      }
      
      // Get flagged sections
      if (key.startsWith('flag-')) {
        const section = key.replace('flag-', '');
        const isFlagged = JSON.parse(localStorage.getItem(key));
        if (isFlagged) {
          flagged.push(section);
        }
      }
      
      // Get read counts
      if (key.startsWith('readCount-')) {
        const section = key.replace('readCount-', '');
        counts[section] = parseInt(localStorage.getItem(key));
      }
    }
    
    setAllNotes(notes);
    setFlaggedSections(flagged);
    setReadCounts(counts);
  }, []);

  // Filter notes based on search term
  const filteredNotes = Object.entries(allNotes).filter(([section, note]) => {
    return section.toLowerCase().includes(searchTerm.toLowerCase()) || 
           note.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate total reads
  const totalReads = Object.values(readCounts).reduce((sum, count) => sum + count, 0);

  // Get most read section
  const mostReadSection = Object.entries(readCounts).reduce(
    (max, [section, count]) => count > (max.count || 0) ? {section, count} : max, 
    {}
  );

  return (
    <div className="min-h-screen bg-background py-6 px-4 animate-fade-up">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-teal mb-4 md:mb-0">
              Your Study Notes
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Link 
                to="/interview-prep"
                className="px-4 py-2 bg-teal text-teal-foreground rounded-lg hover:bg-teal/90 transition-all duration-200 text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Notes Count */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted">Total Notes</p>
                <p className="text-2xl font-bold text-teal">{Object.keys(allNotes).length}</p>
              </div>
            </div>
          </div>
          
          {/* Flagged Count */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted">Flagged Sections</p>
                <p className="text-2xl font-bold text-primary">{flaggedSections.length}</p>
              </div>
            </div>
          </div>
          
          {/* Most Read */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted">Total Reads</p>
                <p className="text-2xl font-bold text-teal">{totalReads}</p>
                {mostReadSection.section && (
                  <p className="text-xs text-muted mt-1">Most read: {mostReadSection.section}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Flagged Sections */}
        {flaggedSections.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-border">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Flagged as Difficult
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flaggedSections.map((section) => (
                <Link 
                  key={section}
                  to={`/section-detail/${section}`}
                  className="p-4 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{section}</span>
                    <span className="text-sm text-muted">Read: {readCounts[section] || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Notes Content */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-xl font-bold text-teal mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Your Notes
          </h2>
          
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted">
                {searchTerm ? "No notes match your search." : "You haven't added any notes yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNotes.map(([section, note]) => (
                <div key={section} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-background-secondary p-4">
                    <div className="flex items-center">
                      <h3 className="font-medium text-teal">{section}</h3>
                      {flaggedSections.includes(section) && (
                        <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                          Flagged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted mr-3">Read: {readCounts[section] || 0}</span>
                      <Link 
                        to={`/section-detail/${section}`}
                        className="px-3 py-1 bg-teal text-teal-foreground rounded hover:bg-teal/90 transition-all duration-200 text-sm"
                      >
                        View Section
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="whitespace-pre-wrap">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
