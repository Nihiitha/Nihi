import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Feed from './pages/Feed';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <nav className="bg-gray-100 p-4 flex gap-4">
        <Link to="/feed" className="text-blue-600 hover:underline">Feed</Link>
        {/* Add other navigation links here */}
      </nav>
      <Routes>
        <Route path="/feed" element={<Feed />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
