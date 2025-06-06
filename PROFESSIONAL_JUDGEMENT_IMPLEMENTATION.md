# Professional Judgement Implementation

## Overview

This implementation adds a new Professional Judgement interview mode to the existing InterviewDashboard component. The new mode integrates with the `/api/professional-judgement` endpoint and provides an audio-driven interview experience.

## Key Features

### 1. Dual Mode System

- **Motivation Interview Mode**: Original functionality with timestamps-based video segments
- **Professional Judgement Mode**: New audio-driven interview with scenario-based questions

### 2. API Integration

- New `professionalJudgement()` method in `APIService`
- Authenticated requests with Bearer token
- Form data submission with audio files
- Proper error handling and fallback to Motivation mode

### 3. Audio Recording & Processing

- Automatic recording when user starts speaking during pause segments
- 5-second silence detection to stop recording and send response
- Audio blob creation and file conversion for API submission

### 4. Interview Flow

1. **Initial Load**: Send request with `start: true` to get first question
2. **Question Display**: Show video, candidatePrompt, and background info
3. **User Response**: Record audio during pause segment
4. **Next Question**: Send audio with `start: false` to get next question
5. **End Detection**: Handle "interview end" message

### 5. UI Components

- Mode toggle buttons (Motivation vs Professional Judgement)
- Information display panel showing:
  - Station name and scenario
  - Candidate prompt (your role)
  - Background information
  - Recording status indicator

## Technical Implementation

### State Management

```javascript
// Professional Judgement specific states
const [isProfessionalJudgement, setIsProfessionalJudgement] = useState(true);
const [interviewData, setInterviewData] = useState(null);
const [currentQuestionId, setCurrentQuestionId] = useState("start");
const [currentScenario, setCurrentScenario] = useState("Social Media");
const [isRecordingResponse, setIsRecordingResponse] = useState(false);
const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
```

### API Method

```javascript
static async professionalJudgement({ scenario, id, start, audioFile }) {
  // Authenticated form data submission
  // Returns interview data with question, candidatePrompt, background
}
```

### Audio Detection Logic

- Monitors audio levels during pause segments
- Starts recording when speech detected
- Stops recording after 5 seconds of silence
- Sends audio to API for processing

## Request/Response Format

### Initial Request (start: true)

```javascript
{
  scenario: "Social Media",
  id: "start",
  start: true
}
```

### Response

```javascript
{
  stationName: "Professional Judgement",
  scenario: "Social Media",
  url: "video_url",
  candidatePrompt: "Your role description",
  background: "Scenario background",
  question: {
    id: "start",
    text: "Question text",
    startTimestamp: "0:00",
    endTimestamp: "0:04"
  },
  pause: {
    startTimestamp: "1:32",
    endTimestamp: "3:15"
  }
}
```

### Follow-up Request (start: false)

```javascript
FormData {
  scenario: "Social Media",
  id: "start",
  start: false,
  audio: File(audioBlob)
}
```

### Follow-up Response

```javascript
{
  question: {
    id: "B1",
    text: "Next question text",
    startTimestamp: "0:31",
    endTimestamp: "0:38"
  }
}
// OR
{
  message: "interview end",
  pause: { ... }
}
```

## Error Handling

- API authentication errors handled gracefully
- Automatic fallback to Motivation mode if Professional Judgement fails
- Non-JSON response handling
- Audio recording error recovery

## Usage

1. Toggle between modes using the mode selector
2. In Professional Judgement mode, the interview automatically starts with the scenario
3. Watch the video question, then respond during the pause segment
4. Recording starts automatically when you speak
5. Stop speaking for 5 seconds to submit your response
6. Continue until interview completion

## Files Modified

- `src/server.js`: Added `professionalJudgement()` API method
- `src/components/InterviewDashboard/InterviewDashboard.jsx`: Main implementation
- Added mode toggle UI, audio recording, API integration, and interview flow logic

## Configuration

- Default scenario: "Social Media"
- Silence detection: 5 seconds (300 frames at 60fps)
- Audio format: WebM with Opus codec
- Authentication: Bearer token required
