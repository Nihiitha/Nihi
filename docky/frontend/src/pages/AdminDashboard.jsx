import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts.');
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">All Submissions</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Content</th>
            <th className="p-2 border">Media</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td className="p-2 border">{post.username}</td>
              <td className="p-2 border">{post.content}</td>
              <td className="p-2 border">
                {post.media_url ? (
                  <a href={`http://localhost:5000${post.media_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                ) : '—'}
              </td>
              <td className="p-2 border">{new Date(post.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard; 