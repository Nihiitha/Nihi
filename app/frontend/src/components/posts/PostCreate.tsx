import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../common/ImageUpload';
// You can use a simple textarea for rich text, or integrate a library like react-quill for full rich text support
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const PostCreate: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!userId.trim()) {
      setError('User ID is required.');
      return;
    }
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('content', content);
    if (media) formData.append('media', media);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${API_URL}/posts/`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit post');
      setSuccess('Post submitted successfully!');
      setContent('');
      setMedia(null);
      setPreview(false);
      // Redirect to post list
      navigate('/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to submit post.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded p-2"
            type="text"
            placeholder="Enter your User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          {/* For rich text, replace textarea with ReactQuill if desired */}
          <textarea
            className="w-full border rounded p-2"
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your post..."
          />
          <ImageUpload label="Media (Image/Video)" onImageChange={setMedia} />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setPreview(!preview)} className="px-3 py-1 bg-gray-200 rounded">
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </form>
        {preview && (
          <div className="border rounded p-4 mt-4 bg-gray-50">
            <h4 className="font-bold mb-2">Preview</h4>
            <div className="mb-2 whitespace-pre-line">{content}</div>
            {media && (
              <div>
                {media.type.startsWith('image') ? (
                  <img src={URL.createObjectURL(media)} alt="preview" className="max-w-xs max-h-48" />
                ) : media.type.startsWith('video') ? (
                  <video controls className="max-w-xs max-h-48">
                    <source src={URL.createObjectURL(media)} type={media.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCreate; 