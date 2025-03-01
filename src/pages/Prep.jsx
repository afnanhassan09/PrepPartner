import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Prep = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [studyCount, setStudyCount] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const topics = [
    'Abdominal Pain',
    'Flank Pain',
    'Sepsis',
    'UG Bleeding',
    'Compartment Syndrome',
  ];

  const dummyData = {
    'Abdominal Pain': 'Dummy data for Abdominal Pain',
    'Flank Pain': 'Dummy data for Flank Pain',
    'Sepsis': 'Dummy data for Sepsis',
    'UG Bleeding': 'Dummy data for UG Bleeding',
    'Compartment Syndrome': 'Dummy data for Compartment Syndrome',
  };

  const handleOptionClick = (option) => {
    navigate(`/section-detail/${option}`);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setStudyCount((prev) => ({ ...prev, [topic]: (prev[topic] || 0) + 1 }));
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-teal leading-tight mb-6">Select an Option</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-8 cursor-pointer hover:bg-teal-100 transition-all duration-300" onClick={() => handleOptionClick('Clinical')}> 
            <h2 className="text-xl font-semibold text-teal mb-2">Clinical</h2>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 cursor-pointer hover:bg-teal-100 transition-all duration-300" onClick={() => handleOptionClick('Management')}> 
            <h2 className="text-xl font-semibold text-teal mb-2">Management</h2>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 cursor-pointer hover:bg-teal-100 transition-all duration-300" onClick={() => handleOptionClick('Portfolio')}> 
            <h2 className="text-xl font-semibold text-teal mb-2">Portfolio</h2>
          </div>
        </div>

        {showPopup && (
          <div className="fixed left-4 top-1/4 bg-white rounded-xl shadow-lg p-5 max-w-xs z-50 border-l-4 border-teal-500 animate-bounce">
            <h3 className="font-bold text-teal-800">Select a Section</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {topics.map((topic) => (
                <li key={topic} className="cursor-pointer hover:text-teal-600" onClick={() => handleTopicClick(topic)}>{topic}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedTopic && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-teal mb-4">{selectedTopic} Details</h2>
            <p>{dummyData[selectedTopic]}</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="Add your notes here..."
            />
            <div className="mt-4">
              <p className="text-gray-600">Study Count: {studyCount[selectedTopic] || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prep; 