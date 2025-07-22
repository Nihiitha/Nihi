import React, { useEffect, useState } from 'react';

interface Post {
  id: number;
  user_id: number;
  username: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/posts');
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{post.username || `User #${post.user_id}`}</span>
              <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <div className="mb-2 whitespace-pre-line">{post.content}</div>
            {post.media_url && (
              <div className="mt-2">
                {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img src={`http://localhost:5000${post.media_url}`} alt="media" className="max-w-xs max-h-48 rounded" />
                ) : post.media_url.match(/\.(mp4|mov|avi)$/i) ? (
                  <video controls className="max-w-xs max-h-48">
                    <source src={`http://localhost:5000${post.media_url}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : post.media_url.match(/\.pdf$/i) ? (
                  <a href={`http://localhost:5000${post.media_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList; 