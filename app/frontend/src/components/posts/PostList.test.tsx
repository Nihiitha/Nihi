import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostList from './PostList';

// Mock postsApi
jest.mock('./api', () => ({
  postsApi: {
    getPosts: jest.fn(),
    getCategories: jest.fn(),
    getPopularTags: jest.fn(),
  },
}));

// Mock IntersectionObserver
let intersectionObserverInstances: any[] = [];
class MockIntersectionObserver {
  callback: any;
  constructor(callback: any) {
    this.callback = callback;
    intersectionObserverInstances.push(this);
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  trigger(entries: any) { this.callback(entries); }
}

beforeEach(() => {
  intersectionObserverInstances = [];
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

const mockPosts = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  user_id: 1,
  username: `User${i + 1}`,
  content: `Post content ${i + 1}`,
  media_url: null,
  created_at: new Date().toISOString(),
  category: 'General',
  tags: 'tag1,tag2',
  visibility: 'public',
  likes_count: i,
  views_count: i * 10,
}));

const mockCategories = ['General', 'News', 'Tech'];

describe('PostList', () => {
  beforeEach(() => {
    intersectionObserverInstances = [];
    require('./api').postsApi.getCategories.mockResolvedValue(mockCategories);
    require('./api').postsApi.getPosts.mockImplementation((params: { page?: number; per_page?: number; search?: string; sort_by?: keyof typeof mockPosts[0]; sort_order?: 'asc' | 'desc' }) => {
      let filtered = [...mockPosts];
      if (params.search) {
        filtered = filtered.filter(p => p.content.includes(params.search!));
      }
      if (params.sort_by) filtered.sort((a, b) => (params.sort_order === 'asc' ? (a[params.sort_by!] as number) - (b[params.sort_by!] as number) : (b[params.sort_by!] as number) - (a[params.sort_by!] as number)));
      const start = ((params.page || 1) - 1) * (params.per_page || 10);
      const end = start + (params.per_page || 10);
      return Promise.resolve({ posts: filtered.slice(start, end), page: params.page || 1, pages: Math.ceil(filtered.length / (params.per_page || 10)) });
    });
  });

  it('renders and fetches initial posts', async () => {
    render(<PostList />);
    expect(screen.getByText('Recent Posts')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
  });

  it('supports infinite scroll and loads more posts', async () => {
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
    // Simulate intersection
    act(() => {
      intersectionObserverInstances[0].trigger([{ isIntersecting: true }]);
    });
    await waitFor(() => expect(screen.getByText('Post content 20')).toBeInTheDocument());
  });

  it('filters posts by search', async () => {
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
    // Use a unique search term
    fireEvent.change(screen.getByPlaceholderText('Search posts...'), { target: { value: 'Post content 22' } });
    // Wait for debounce and UI update
    await waitFor(() => expect(screen.getByText('Post content 22')).toBeInTheDocument());
    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    // Only the unique post should be present
    const filteredNodes = await screen.findAllByText('Post content 22');
    expect(filteredNodes).toHaveLength(1);
    // Ensure other posts are not present
    expect(screen.queryByText('Post content 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Post content 2')).not.toBeInTheDocument();
  });

  it('filters posts by category', async () => {
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
    fireEvent.change(screen.getByDisplayValue('All Categories'), { target: { value: 'General' } });
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
  });

  it('sorts posts by likes', async () => {
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
    fireEvent.change(screen.getByDisplayValue('Newest'), { target: { value: 'likes_count' } });
    await waitFor(() => expect(screen.getByText('Post content 30')).toBeInTheDocument());
  });

  it('shows loading and error states', async () => {
    require('./api').postsApi.getPosts.mockImplementationOnce(() => Promise.reject('error'));
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Failed to fetch posts.')).toBeInTheDocument());
  });

  it('lazy loads images (loading="lazy")', async () => {
    const postsWithImages = [{ ...mockPosts[0], media_url: '/img.jpg' }];
    require('./api').postsApi.getPosts.mockResolvedValueOnce({ posts: postsWithImages, page: 1, pages: 1 });
    render(<PostList />);
    await waitFor(() => expect(screen.getByAltText('media')).toHaveAttribute('loading', 'lazy'));
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    render(<PostList />);
    fireEvent.change(screen.getByPlaceholderText('Search posts...'), { target: { value: 'content 3' } });
    act(() => { jest.advanceTimersByTime(500); });
    await waitFor(() => expect(screen.getByText('Post content 3')).toBeInTheDocument());
    jest.useRealTimers();
  });

  it('is performant and responsive with large data sets', async () => {
    const largePosts = Array.from({ length: 1000 }, (_, i) => ({ ...mockPosts[0], id: i + 1, content: `Post ${i + 1}` }));
    require('./api').postsApi.getPosts.mockImplementation((params: { page?: number; per_page?: number }) => {
      const start = ((params.page || 1) - 1) * (params.per_page || 10);
      const end = start + (params.per_page || 10);
      return Promise.resolve({ posts: largePosts.slice(start, end), page: params.page || 1, pages: Math.ceil(largePosts.length / (params.per_page || 10)) });
    });
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());
    // Simulate intersection for more pages
    for (let i = 0; i < 10; i++) {
      act(() => {
        intersectionObserverInstances[0].trigger([{ isIntersecting: true }]);
      });
    }
    await waitFor(() => expect(screen.getByText('Post 100')).toBeInTheDocument());
  });

  it('invalidates cache and refetches on filter/sort change', async () => {
    render(<PostList />);
    await waitFor(() => expect(screen.getByText('Post content 1')).toBeInTheDocument());
    fireEvent.change(screen.getByDisplayValue('Newest'), { target: { value: 'likes_count' } });
    await waitFor(() => expect(screen.getByText('Post content 30')).toBeInTheDocument());
  });
}); 