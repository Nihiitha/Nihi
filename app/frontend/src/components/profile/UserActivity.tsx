import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaSpinner } from 'react-icons/fa';

interface Post {
  id: number;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

interface Activity {
  id: number;
  type: 'post' | 'like' | 'comment' | 'connection' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface UserActivityProps {
  userId: number;
  connectionCount: number;
  mutualConnections: number;
  isOwnProfile?: boolean;
}

const UserActivity: React.FC<UserActivityProps> = ({
  userId,
  connectionCount,
  mutualConnections,
  isOwnProfile = false
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: 1,
      content: "Just completed a major project milestone! Excited to share the results with our team. #projectmanagement #success",
      likes: 24,
      comments: 8,
      shares: 3,
      createdAt: '2024-01-15T10:30:00Z',
      isLiked: false
    },
    {
      id: 2,
      content: "Attended an amazing tech conference today. Learned so much about the latest trends in AI and machine learning.",
      image: '/conference-image.jpg',
      likes: 18,
      comments: 5,
      shares: 2,
      createdAt: '2024-01-14T16:45:00Z',
      isLiked: true
    },
    {
      id: 3,
      content: "Happy to announce that I've been promoted to Senior Developer! Grateful for the opportunities and support from my amazing team.",
      likes: 45,
      comments: 12,
      shares: 7,
      createdAt: '2024-01-13T09:15:00Z',
      isLiked: false
    }
  ];

  const mockActivities: Activity[] = [
    {
      id: 1,
      type: 'achievement',
      title: 'Earned "Top Contributor" Badge',
      description: 'For consistently providing valuable insights in the community',
      timestamp: '2024-01-15T14:20:00Z',
      icon: '🏆',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      type: 'connection',
      title: 'Connected with Sarah Johnson',
      description: 'Software Engineer at Google',
      timestamp: '2024-01-15T11:30:00Z',
      icon: '👥',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      type: 'post',
      title: 'Shared a post',
      description: 'About project management best practices',
      timestamp: '2024-01-15T10:30:00Z',
      icon: '📝',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      type: 'like',
      title: 'Liked a post by Mike Chen',
      description: 'About React performance optimization',
      timestamp: '2024-01-14T16:45:00Z',
      icon: '❤️',
      color: 'bg-red-100 text-red-800'
    }
  ];

  // Simulate API call with lazy loading
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock pagination - in real app, this would be an API call
    const newPosts = mockPosts.slice((page - 1) * 3, page * 3);
    const newActivities = mockActivities.slice((page - 1) * 2, page * 2);
    
    if (page === 1) {
      setPosts(newPosts);
      setActivities(newActivities);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
      setActivities(prev => [...prev, ...newActivities]);
    }
    
    setHasMore(page < 3); // Mock: only 3 pages of data
    setPage(prev => prev + 1);
    setLoading(false);
  }, [loading, hasMore, page]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreData();
      }
    });
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    return () => observer.current?.disconnect();
  }, [loading, hasMore, loadMoreData]);

  // Initial load
  useEffect(() => {
    loadMoreData();
  }, []);

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Connection Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connections</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{connectionCount}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{mutualConnections}</div>
            <div className="text-sm text-gray-600">Mutual</div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/default-avatar.png"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">You</p>
                    <p className="text-sm text-gray-500">{formatTimestamp(post.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FaEllipsisH className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-3">{post.content}</p>
              
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <FaHeart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    <FaComment className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
                    <FaShare className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading indicator for lazy loading */}
          {loading && (
            <div className="flex justify-center py-4">
              <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
          
          {/* Intersection observer target */}
          <div ref={loadingRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default UserActivity; 