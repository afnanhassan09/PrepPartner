import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Performance = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [performanceData, setPerformanceData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    current: 0,
    previous: 0,
    change: 0
  });

  // Station types for demonstration
  const stationTypes = {
    'Abdominal Pain': 'Clinical',
    'Flank Pain': 'Clinical',
    'Sepsis': 'Emergency',
    'UG Bleeding': 'Emergency',
    'Compartment Syndrome': 'Emergency'
  };

  // Generate sample performance data
  useEffect(() => {
    const generateSampleData = () => {
      const data = [];
      const stations = Object.keys(stationTypes);
      const today = new Date();
      
      // Generate last 14 days of data
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random station attempts for each day
        const attempts = Math.floor(Math.random() * 3); // 0-2 attempts per day
        
        for (let j = 0; j < attempts; j++) {
          const station = stations[Math.floor(Math.random() * stations.length)];
          data.push({
            id: `${date.toISOString()}-${j}`,
            date: date.toISOString(),
            station: station,
            type: stationTypes[station],
            score: Math.floor(Math.random() * 31) + 70, // Score between 70-100
            duration: Math.floor(Math.random() * 20) + 10 // Duration between 10-30 minutes
          });
        }
      }
      
      return data;
    };

    const data = generateSampleData();
    setPerformanceData(data);

    // Calculate weekly stats
    const currentWeekData = data.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const previousWeekData = data.filter(entry => {
      const entryDate = new Date(entry.date);
      const twoWeeksAgo = new Date();
      const oneWeekAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return entryDate >= twoWeeksAgo && entryDate < oneWeekAgo;
    });

    setWeeklyStats({
      current: currentWeekData.length,
      previous: previousWeekData.length,
      change: currentWeekData.length - previousWeekData.length
    });
  }, []);

  // Filter performance data based on selection
  const filteredData = selectedFilter === 'All' 
    ? performanceData 
    : performanceData.filter(entry => entry.station === selectedFilter);

  // Calculate average score for each station
  const stationAverages = Object.keys(stationTypes).reduce((acc, station) => {
    const stationData = performanceData.filter(entry => entry.station === station);
    const average = stationData.length 
      ? stationData.reduce((sum, entry) => sum + entry.score, 0) / stationData.length 
      : 0;
    acc[station] = Math.round(average);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background py-6 px-4 animate-fade-up">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-teal mb-2">PERFORMANCE</h1>
            <p className="text-muted">Track your progress across different stations</p>
          </div>
          <Link 
            to="/interview-prep"
            className="mt-4 md:mt-0 px-4 py-2 bg-teal text-teal-foreground rounded-lg hover:bg-teal/90 transition-all duration-200 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stations Practiced */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Stations Practiced</h3>
              <span className="text-xs text-muted">This Week</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-teal">{weeklyStats.current}</p>
                <p className="text-sm text-muted mt-1">stations</p>
              </div>
              <div className={`flex items-center ${weeklyStats.change >= 0 ? 'text-primary' : 'text-accent'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={weeklyStats.change >= 0 
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                  />
                </svg>
                <span className="text-sm font-medium">
                  {Math.abs(weeklyStats.change)} vs last week
                </span>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Average Score</h3>
              <span className="text-xs text-muted">All Time</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-teal">
                  {Math.round(
                    performanceData.reduce((sum, entry) => sum + entry.score, 0) / 
                    (performanceData.length || 1)
                  )}%
                </p>
                <p className="text-sm text-muted mt-1">overall average</p>
              </div>
              <div className="flex items-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">Performance</span>
              </div>
            </div>
          </div>

          {/* Total Time */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Total Practice Time</h3>
              <span className="text-xs text-muted">All Time</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-teal">
                  {Math.round(
                    performanceData.reduce((sum, entry) => sum + entry.duration, 0) / 60
                  )}h
                </p>
                <p className="text-sm text-muted mt-1">total hours</p>
              </div>
              <div className="flex items-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Practice Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Station Performance Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-teal mb-4">Station Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stationTypes).map(([station, type]) => {
              const stationData = performanceData.filter(entry => entry.station === station);
              const attempts = stationData.length;
              const averageScore = stationAverages[station];
              
              return (
                <div key={station} className="bg-white rounded-lg shadow-md p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{station}</h3>
                      <p className="text-sm text-muted">{type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      averageScore >= 90 ? 'bg-primary/20 text-primary' :
                      averageScore >= 80 ? 'bg-teal/20 text-teal' :
                      averageScore >= 70 ? 'bg-accent/20 text-accent' :
                      'bg-secondary/20 text-secondary'
                    }`}>
                      {averageScore}% avg
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Attempts</span>
                      <span className="font-medium text-foreground">{attempts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Best Score</span>
                      <span className="font-medium text-foreground">
                        {attempts ? Math.max(...stationData.map(d => d.score)) : 'N/A'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Avg Duration</span>
                      <span className="font-medium text-foreground">
                        {attempts ? Math.round(stationData.reduce((sum, d) => sum + d.duration, 0) / attempts) : 'N/A'} min
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-teal mb-4 md:mb-0">Station Overview</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                >
                  <option value="All">All Stations</option>
                  {Object.keys(stationTypes).map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background-secondary">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted">Station</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{entry.station}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{entry.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        entry.score >= 90 ? 'bg-primary/20 text-primary' :
                        entry.score >= 80 ? 'bg-teal/20 text-teal' :
                        entry.score >= 70 ? 'bg-accent/20 text-accent' :
                        'bg-secondary/20 text-secondary'
                      }`}>
                        {entry.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{entry.duration} minutes</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;