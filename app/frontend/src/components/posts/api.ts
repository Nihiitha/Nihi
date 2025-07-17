const API_URL = 'http://localhost:5000';

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
  createPost: async (postData: PostData): Promise<CreatePostResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }
      
      return { success: true, post: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  uploadMedia: async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/posts/upload-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload media');
      }

      return { success: true, url: data.url };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  getPosts: async () => {
    const response = await fetch(`${API_URL}/api/posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  likePost: async (postId: number) => {
    const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },
}; 