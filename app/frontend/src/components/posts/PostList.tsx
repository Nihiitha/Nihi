import React, { useEffect, useState, useCallback } from 'react';
import { postsApi } from './api';
import useDebounce from '../../utils/useDebounce';
import useInfiniteScroll from '../../utils/useInfiniteScroll';

interface Post {
  id: number;
  user_id: number;
  username: string;
  content: string;
  media_url: string | null;
  created_at: string;
  category?: string;
  tags?: string;
  visibility?: string;
  likes_count?: number;
  views_count?: number;
}

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'likes_count', label: 'Most Liked' },
  { value: 'views_count', label: 'Most Viewed' },
];

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const debouncedSearch = useDebounce(search, 500);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch categories for filter dropdown
  useEffect(() => {
    postsApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Fetch posts (with filters, sorting, pagination)
  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = {
        page: reset ? 1 : page,
        per_page: perPage,
        search: debouncedSearch,
        category: category || undefined,
        tags: tags || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      const data = await postsApi.getPosts(params);
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.page < data.pages);
    } catch (err) {
      setError('Failed to fetch posts.');
    }
    setLoading(false);
  }, [page, perPage, debouncedSearch, category, tags, sortBy, sortOrder]);

  // Reset and refetch on filter/sort/search change
  useEffect(() => {
    setPage(1);
    setPosts([]); // Clear posts immediately on filter/search/sort change
    fetchPosts(true);
    // eslint-disable-next-line
  }, [debouncedSearch, category, tags, sortBy, sortOrder]);

  // Fetch more on page change (infinite scroll)
  useEffect(() => {
    if (page === 1) return;
    fetchPosts();
    // eslint-disable-next-line
  }, [page]);

  // Infinite scroll hook
  const sentinelRef = useInfiniteScroll({
    callback: () => {
      if (!loading && hasMore) setPage(p => p + 1);
    },
    hasMore,
    loading,
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1 min-w-[120px]"
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          className="border rounded p-2 flex-1 min-w-[120px]"
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          className="border rounded p-2"
          onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      {posts.length === 0 && !loading && <div className="text-gray-500">No posts found.</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{post.username || `User #${post.user_id}`}</span>
              <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</span>
              {post.category && <span className="ml-2 text-xs bg-gray-200 rounded px-2">{post.category}</span>}
              {post.visibility && <span className="ml-2 text-xs bg-blue-100 rounded px-2">{post.visibility}</span>}
            </div>
            <div className="mb-2 whitespace-pre-line">{post.content}</div>
            {post.tags && (
              <div className="mb-2 text-xs text-gray-600">Tags: {post.tags}</div>
            )}
            {post.media_url && (
              <div className="mt-2">
                {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={`${API_URL}${post.media_url}`}
                    alt="media"
                    className="max-w-xs max-h-48 rounded"
                    loading="lazy"
                  />
                ) : post.media_url.match(/\.(mp4|mov|avi)$/i) ? (
                  <video controls className="max-w-xs max-h-48">
                    <source src={`${API_URL}${post.media_url}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : post.media_url.match(/\.pdf$/i) ? (
                  <a href={`${API_URL}${post.media_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                ) : null}
              </div>
            )}
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span>👍 {post.likes_count ?? 0}</span>
              <span>👁️ {post.views_count ?? 0}</span>
            </div>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading && <div className="text-center text-gray-400 py-4">Loading...</div>}
    </div>
  );
};

export default PostList; 