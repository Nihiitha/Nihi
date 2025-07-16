import { mockUser, mockActivity } from "./mockData";

export function fetchUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUser), 800);
  });
}

export function fetchUserActivity(offset = 0, limit = 5) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActivity.slice(offset, offset + limit)), 800);
  });
}

export function updateUserProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, ...data }), 1000);
  });
}

export function uploadProfileImage(file) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 1200);
  });
} 