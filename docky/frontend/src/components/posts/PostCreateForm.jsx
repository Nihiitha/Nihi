import React, { useState } from 'react';
import PostPreview from './PostPreview';

const PostCreateForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ content, media });
      setContent('');
      setMedia(null);
      setPreview(false);
    } catch (err) {
      setError('Failed to submit post.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block font-semibold">Post Content</label>
      <textarea
        className="w-full border rounded p-2"
        rows={5}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your post..."
      />
      <label className="block font-semibold">Media (Image/Video)</label>
      <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={() => setPreview(!preview)} className="px-3 py-1 bg-gray-200 rounded">
          {preview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {preview && <PostPreview content={content} media={media} />}
    </form>
  );
};

export default PostCreateForm; 