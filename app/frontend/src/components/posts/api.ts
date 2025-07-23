const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface PostData {
  content: string;
  media_url?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post?: any;
  error?: string;
}

export const postsApi = {
  createPost: async (user_id: string, content: string, media?: File) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('content', content);
    if (media) formData.append('media', media);
    const response = await fetch(`${API_URL}/posts/`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Fetch posts with advanced query params
   * @param params Query params: page, per_page, category, visibility, search, tags, sort_by, sort_order
   */
  getPosts: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/posts/?${query}`);
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_URL}/posts/categories`);
    return response.json();
  },

  getPopularTags: async () => {
    const response = await fetch(`${API_URL}/posts/popular-tags`);
    return response.json();
  },
}; 