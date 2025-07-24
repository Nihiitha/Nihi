import { mockProfiles, mockActivities } from '../data/mockData';

function simulateDelay<T>(data: T, delay = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export const api = {
  // Mock login
  login: async (credentials: { email?: string; username?: string; password: string }) => {
    // Simulate login: accept any password, return userId=1 and a fake token
    if ((credentials.email || credentials.username) && credentials.password) {
      return simulateDelay({ token: 'mock-jwt-token', userId: 1 });
    }
    return simulateDelay({ error: 'Invalid credentials' });
  },

  // Mock signup
  signup: async (userData: { email: string; password: string; name: string }) => {
    if (userData.email && userData.password && userData.name) {
      return simulateDelay({ success: true, userId: 1 });
    }
    return simulateDelay({ error: 'Missing fields' });
  },

  // Mock get profile
  getProfile: async () => {
    const profile = mockProfiles.find((p) => p.id === 1);
    if (profile) return simulateDelay(profile);
    return simulateDelay({ error: 'Profile not found' });
  },

  // Mock update profile
  updateProfile: async (profileData: any) => {
    // Simulate success
    return simulateDelay({ success: true, profile: profileData });
  },

  // Mock get activity
  getActivity: async () => {
    // Return all activities for now
    return simulateDelay(mockActivities);
  },
}; 