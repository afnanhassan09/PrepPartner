import React from 'react';

const scenarios = [
  'Abdominal pain',
  'Flank pain',
  'Sepsis',
  'UG bleeding',
  'Compartment syndrome'
];

const ScenarioSelector = ({ selectedScenario, onScenarioChange }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Scenarios</h2>
      <div className="space-y-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => onScenarioChange(scenario)}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedScenario === scenario
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-background-secondary'
            }`}
          >
            {scenario}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector; 