import React from 'react';
import { PostCreate, PostList } from '../components/posts';

const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <PostCreate />
      <div className="my-8" />
      <PostList />
    </div>
  );
};

export default Feed; 