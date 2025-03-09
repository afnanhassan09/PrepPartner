import React from "react";

const NavigationButtons = ({ selectedSection }) => {
  return (
    <div className="animate-fade-up mt-6 flex justify-center gap-4">
      <button
        onClick={() => {
          // Add your end interview logic here
          if (window.confirm("Are you sure you want to end the interview?")) {
            // Handle end interview
          }
        }}
        className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 
                   transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        End Interview
      </button>
      <button
        onClick={() => {
          // Add your next case logic here
          if (selectedSection) {
            // Handle next case
          } else {
            alert("Please select a case from the menu first");
          }
        }}
        className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-600 
                   transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        Next Case
      </button>
    </div>
  );
};

export default NavigationButtons;