// src/pages/ContentPage.js
import React from 'react';
import PostsPanel from '../components/PostsPanel';
import CommentsPanel from '../components/CommentsPanel';

const ContentPage = () => {
  return (
    <div className="content-layout">
      <PostsPanel />
      <CommentsPanel />
    </div>
  );
};

export default ContentPage;