const API_URL = 'http://localhost:5000';

export const postsApi = {
  createPost: async (user_id: string, content: string, media?: File) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('content', content);
    if (media) formData.append('media', media);
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  getPosts: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
  },
}; 