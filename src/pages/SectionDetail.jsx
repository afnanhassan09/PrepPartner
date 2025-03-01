import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SectionDetail = () => {
  const { option } = useParams();
  const [notes, setNotes] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [readCount, setReadCount] = useState(0);

  // Expanded dummy data with more content and image URLs
  const dummyData = {
    'Abdominal Pain': {
      content: `
        <h2 class="text-xl font-bold text-teal mb-4">Abdominal Pain Overview</h2>
        <p class="mb-4">Abdominal pain is one of the most common presentations in emergency medicine. The differential diagnosis is broad, ranging from benign self-limiting conditions to life-threatening emergencies requiring immediate intervention.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Key Clinical Considerations</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Location, radiation, and character of pain</li>
          <li>Associated symptoms (nausea, vomiting, diarrhea, fever)</li>
          <li>Timing and progression of symptoms</li>
          <li>Relevant past medical history</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Red Flags</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Severe, sudden-onset pain</li>
          <li>Signs of peritonitis</li>
          <li>Hypotension or tachycardia</li>
          <li>Advanced age (>65 years)</li>
          <li>Immunocompromised status</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Diagnostic Approach</h3>
        <p class="mb-4">Initial evaluation should include a thorough history and physical examination, followed by appropriate laboratory and imaging studies based on the clinical presentation.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Management Principles</h3>
        <p>Treatment depends on the underlying cause but may include pain management, fluid resuscitation, antibiotics, and surgical consultation when appropriate.</p>
      `,
      image: '/placeholder.svg?height=300&width=500'
    },
    'Flank Pain': {
      content: `
        <h2 class="text-xl font-bold text-teal mb-4">Flank Pain: Clinical Approach</h2>
        <p class="mb-4">Flank pain commonly presents in emergency settings and may indicate renal or urological pathology, though musculoskeletal and other causes should be considered.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Common Etiologies</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Nephrolithiasis (kidney stones)</li>
          <li>Pyelonephritis</li>
          <li>Renal infarction</li>
          <li>Musculoskeletal strain</li>
          <li>Herpes zoster</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Clinical Assessment</h3>
        <p class="mb-4">Evaluate for costovertebral angle tenderness, associated urinary symptoms, fever, and history of kidney stones or urinary tract infections.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Diagnostic Studies</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Urinalysis</li>
          <li>Complete blood count</li>
          <li>Basic metabolic panel</li>
          <li>CT scan (non-contrast for suspected nephrolithiasis)</li>
          <li>Ultrasound (particularly in pregnant patients)</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Treatment Considerations</h3>
        <p>Management includes pain control (NSAIDs preferred for nephrolithiasis), hydration, antibiotics for infection, and urological consultation when indicated.</p>
      `,
      image: '/placeholder.svg?height=300&width=500'
    },
    'Sepsis': {
      content: `
        <h2 class="text-xl font-bold text-teal mb-4">Sepsis: Early Recognition and Management</h2>
        <p class="mb-4">Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Early recognition and intervention are critical to improving outcomes.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Sepsis Criteria (Sepsis-3)</h3>
        <p class="mb-4">Suspected or documented infection plus an acute change in SOFA score ≥2 points. Quick SOFA (qSOFA) criteria can be used for rapid bedside assessment:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Respiratory rate ≥22/min</li>
          <li>Altered mental status</li>
          <li>Systolic blood pressure ≤100 mmHg</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Initial Management</h3>
        <ol class="list-decimal pl-5 mb-4">
          <li>Obtain blood cultures before antibiotic administration</li>
          <li>Administer broad-spectrum antibiotics within 1 hour</li>
          <li>Begin fluid resuscitation (30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L)</li>
          <li>Measure lactate level</li>
        </ol>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Ongoing Management</h3>
        <p class="mb-4">Reassess volume status and tissue perfusion. Consider vasopressors if hypotension persists despite fluid resuscitation. Source control should be achieved as soon as possible.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Monitoring and Reassessment</h3>
        <p>Continuous monitoring of vital signs, urine output, mental status, and laboratory parameters is essential. Repeat lactate measurement if initially elevated.</p>
      `,
      image: '/placeholder.svg?height=300&width=500'
    },
    'UG Bleeding': {
      content: `
        <h2 class="text-xl font-bold text-teal mb-4">Upper Gastrointestinal Bleeding</h2>
        <p class="mb-4">Upper gastrointestinal (UG) bleeding refers to hemorrhage originating from the esophagus, stomach, or duodenum. It represents a common emergency with significant morbidity and mortality.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Clinical Presentation</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Hematemesis (vomiting of blood or coffee-ground material)</li>
          <li>Melena (black, tarry stools)</li>
          <li>Hematochezia (bright red blood per rectum) in massive UG bleeding</li>
          <li>Signs of hemodynamic instability</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Common Causes</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Peptic ulcer disease (most common)</li>
          <li>Gastritis/esophagitis</li>
          <li>Variceal bleeding</li>
          <li>Mallory-Weiss tears</li>
          <li>Malignancy</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Initial Management</h3>
        <ol class="list-decimal pl-5 mb-4">
          <li>Assess airway, breathing, circulation</li>
          <li>Establish large-bore IV access (two lines if possible)</li>
          <li>Fluid resuscitation</li>
          <li>Blood product transfusion as needed</li>
          <li>Consider proton pump inhibitor therapy</li>
        </ol>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Risk Stratification</h3>
        <p>The Glasgow-Blatchford score and AIMS65 score can help predict the need for intervention and risk of mortality.</p>
      `,
      image: '/placeholder.svg?height=300&width=500'
    },
    'Compartment Syndrome': {
      content: `
        <h2 class="text-xl font-bold text-teal mb-4">Compartment Syndrome: A Surgical Emergency</h2>
        <p class="mb-4">Compartment syndrome occurs when increased pressure within a confined anatomical space compromises circulation and function of tissues within that space. It represents a true surgical emergency requiring prompt recognition and intervention.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Clinical Features (6 P's)</h3>
        <ul class="list-disc pl-5 mb-4">
          <li><strong>Pain:</strong> Severe, out of proportion to injury, exacerbated by passive stretch</li>
          <li><strong>Paresthesia:</strong> Sensory deficit in nerve distribution</li>
          <li><strong>Paralysis:</strong> Motor weakness (late finding)</li>
          <li><strong>Pallor:</strong> Pale appearance of affected limb</li>
          <li><strong>Pulselessness:</strong> Diminished or absent pulses (very late finding)</li>
          <li><strong>Poikilothermia:</strong> Cool temperature of affected limb</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Common Causes</h3>
        <ul class="list-disc pl-5 mb-4">
          <li>Fractures (especially tibial shaft)</li>
          <li>Crush injuries</li>
          <li>Reperfusion after vascular injury or repair</li>
          <li>Tight casts or dressings</li>
          <li>Burns</li>
          <li>Prolonged limb compression (e.g., drug overdose)</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Diagnosis</h3>
        <p class="mb-4">Primarily clinical. Compartment pressure measurement may be helpful in unconscious patients or when clinical assessment is difficult. Normal compartment pressure is &lt;10-12 mmHg. Pressures &gt;30 mmHg or within 30 mmHg of diastolic pressure indicate compartment syndrome.</p>
        
        <h3 class="text-lg font-semibold text-teal mb-2">Management</h3>
        <p>Immediate fasciotomy is the definitive treatment. Remove constrictive dressings, elevate limb to heart level (not above), and avoid hypotension.</p>
      `,
      image: '/placeholder.svg?height=300&width=500'
    },
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (option) {
      const savedNotes = localStorage.getItem(`notes-${option}`);
      if (savedNotes) setNotes(savedNotes);

      const savedFlag = localStorage.getItem(`flag-${option}`);
      if (savedFlag) setIsFlagged(JSON.parse(savedFlag));

      const savedReadCount = localStorage.getItem(`readCount-${option}`);
      if (savedReadCount) {
        setReadCount(parseInt(savedReadCount));
      } else {
        // Initialize read count to 1 for first visit
        setReadCount(1);
        localStorage.setItem(`readCount-${option}`, '1');
      }
    }
  }, [option]);

  // Save notes to localStorage
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes-${option}`, newNotes);
  };

  // Toggle flag status
  const toggleFlag = () => {
    const newFlagStatus = !isFlagged;
    setIsFlagged(newFlagStatus);
    localStorage.setItem(`flag-${option}`, JSON.stringify(newFlagStatus));
  };

  // Increment read count
  const incrementReadCount = () => {
    const newCount = readCount + 1;
    setReadCount(newCount);
    localStorage.setItem(`readCount-${option}`, newCount.toString());
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 flex flex-col md:flex-row animate-fade-up">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 border border-border mb-4 md:mb-0 md:mr-4">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-teal ml-3">Navigation</h2>
        </div>
        
        <ul className="space-y-2">
          <li>
            <Link 
              to="/section-detail/Abdominal Pain" 
              className={`block p-3 rounded-lg transition-all duration-200 ${option === 'Abdominal Pain' ? 'bg-secondary text-teal font-medium' : 'hover:bg-secondary/50 text-foreground'}`}
            >
              Abdominal Pain
            </Link>
          </li>
          <li>
            <Link 
              to="/section-detail/Flank Pain" 
              className={`block p-3 rounded-lg transition-all duration-200 ${option === 'Flank Pain' ? 'bg-secondary text-teal font-medium' : 'hover:bg-secondary/50 text-foreground'}`}
            >
              Flank Pain
            </Link>
          </li>
          <li>
            <Link 
              to="/section-detail/Sepsis" 
              className={`block p-3 rounded-lg transition-all duration-200 ${option === 'Sepsis' ? 'bg-secondary text-teal font-medium' : 'hover:bg-secondary/50 text-foreground'}`}
            >
              Sepsis
            </Link>
          </li>
          <li>
            <Link 
              to="/section-detail/UG Bleeding" 
              className={`block p-3 rounded-lg transition-all duration-200 ${option === 'UG Bleeding' ? 'bg-secondary text-teal font-medium' : 'hover:bg-secondary/50 text-foreground'}`}
            >
              UG Bleeding
            </Link>
          </li>
          <li>
            <Link 
              to="/section-detail/Compartment Syndrome" 
              className={`block p-3 rounded-lg transition-all duration-200 ${option === 'Compartment Syndrome' ? 'bg-secondary text-teal font-medium' : 'hover:bg-secondary/50 text-foreground'}`}
            >
              Compartment Syndrome
            </Link>
          </li>
        </ul>
        
        <div className="mt-8 pt-6 border-t border-border">
          <Link to="/notes" className="flex items-center p-3 rounded-lg text-teal hover:bg-secondary transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View All Notes
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full md:w-3/4 flex flex-col">
        {/* Header with Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-teal mb-4 md:mb-0">
              {option}
            </h1>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleFlag}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${isFlagged ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2`} fill={isFlagged ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {isFlagged ? 'Flagged' : 'Flag as Difficult'}
              </button>
              
              <button 
                onClick={incrementReadCount}
                className="flex items-center px-4 py-2 bg-teal text-teal-foreground rounded-lg hover:bg-teal/90 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read: {readCount}
              </button>
            </div>
          </div>
        </div>
        
        {/* Content and Notes */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Main Content */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6 border border-border">
            {dummyData[option] && (
              <div className="space-y-6">
                <img 
                  src={dummyData[option].image || "/placeholder.svg"} 
                  alt={`Illustration for ${option}`} 
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-6 bg-background-secondary"
                />
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: dummyData[option].content }}
                />
                
                {/* Clinical Pearls Section */}
                <div className="mt-8 p-4 bg-background-secondary rounded-lg border border-border">
                  <h3 className="text-lg font-semibold text-teal mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Clinical Pearls
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Remember to consider atypical presentations in elderly and immunocompromised patients.</li>
                    <li>Serial examinations are often more valuable than a single assessment.</li>
                    <li>When in doubt, consult early rather than late.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Notes Section */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-lg font-semibold text-teal">Your Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add your notes here..."
              className="w-full h-64 p-3 border border-border rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all duration-200"
            ></textarea>
            
            {/* Quick Reference */}
            <div className="mt-6 p-4 bg-background-secondary rounded-lg border border-border">
              <h4 className="font-medium text-teal mb-2">Quick Reference</h4>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Use bullet points for key findings</li>
                <li>• Note important differential diagnoses</li>
                <li>• Highlight management priorities</li>
                <li>• Record questions for further study</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDetail;
