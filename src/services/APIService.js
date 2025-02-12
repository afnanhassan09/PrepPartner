class APIService {
  static async getScenarioVideo(scenarioName) {
    // This is a mock implementation. Replace with actual API calls.
    const mockVideos = {
      'Abdominal pain': {
        url: '/videos/abdominal-pain.mp4',
        title: 'Abdominal Pain Case'
      },
      'Flank pain': {
        url: '/videos/flank-pain.mp4',
        title: 'Flank Pain Case'
      },
      'Sepsis': {
        url: '/videos/sepsis.mp4',
        title: 'Sepsis Case'
      },
      'UG bleeding': {
        url: '/videos/ug-bleeding.mp4',
        title: 'UG Bleeding Case'
      },
      'Compartment syndrome': {
        url: '/videos/compartment-syndrome.mp4',
        title: 'Compartment Syndrome Case'
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mockVideos[scenarioName]) {
      return mockVideos[scenarioName];
    }
    
    throw new Error('Scenario not found');
  }
}

export default APIService; 