import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Profile from '../components/profile/Profile';
import ProfileEdit from '../pages/ProfileEdit';
import ProfileView from '../components/profile/ProfileView';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
// import Feed from '../components/feed/Feed'; // Unused for now
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/profile/:userId',
    element: <Profile />,
  },
  {
    path: '/profile',
    element: <ProfileView />,
  },
  {
    path: '/profile/:userId/edit',
    element: <ProfileEdit />,
  },
  {
    path: '/posts/create',
    element: <PostCreate />,
  },
  {
    path: '/posts',
    element: <PostList />,
  },
  {
    path: '/jobs',
    element: <JobList />,
  },
  {
    path: '/messages',
    element: <MessageList />,
  },
]); 