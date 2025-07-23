import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PostCreate from './components/posts/PostCreate';
import PostList from './components/posts/PostList';
import Profile from './components/profile/Profile';
import ProfileEdit from './components/profile/ProfileEdit';
import UserDashboard from './pages/UserDashboard';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <nav className="bg-gray-100 p-4 flex gap-6 justify-center text-lg font-medium">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        <Link to="/profile/1" className="text-blue-600 hover:underline">Profile</Link>
        <Link to="/posts/create" className="text-blue-600 hover:underline">Create Post</Link>
        <Link to="/posts" className="text-blue-600 hover:underline">Post List</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/:userId/edit" element={<ProfileEdit />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
