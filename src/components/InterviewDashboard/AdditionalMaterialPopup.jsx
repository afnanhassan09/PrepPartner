import React from "react";
import CloseIcon from "./icons/CloseIcon"; // You may need to create this icon

const AdditionalMaterialPopup = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 animate-fade">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Additional Material</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={imageUrl} 
            alt="Additional Material" 
            className="max-w-full h-auto rounded-lg shadow-md"
          />
          <p className="text-gray-600 text-center">
            Review this additional material related to your case study.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalMaterialPopup; 