import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterviewRoom from './components/InterviewRoom';
import Dashboard from './components/Dashboard';
import { SupabaseProvider } from './context/SupabaseContext';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/interview/:id" element={<InterviewRoom />} />
          </Routes>
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;