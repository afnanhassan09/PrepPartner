import React from 'react';

const Notes = ({ title, value, onChange, readonly = false }) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <textarea
        className="w-full h-32 p-2 border border-border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readonly}
        placeholder={`Enter ${title.toLowerCase()} here...`}
      />
    </div>
  );
};

export default Notes; 