import React, { useState } from 'react';
import { PostCreateForm } from '../components/posts';

const UserDashboard = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handlePostSubmit = async ({ content, media }) => {
    setMessage('');
    if (!username.trim()) {
      setMessage('Username is required.');
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('content', content);
    if (media) formData.append('media', media);
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit post');
      setMessage('Post submitted successfully!');
    } catch (err) {
      setMessage('Failed to submit post.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      <input
        className="w-full border rounded p-2 mb-4"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <PostCreateForm onSubmit={handlePostSubmit} />
      {message && <div className="mt-2 text-blue-600">{message}</div>}
    </div>
  );
};

export default UserDashboard; 