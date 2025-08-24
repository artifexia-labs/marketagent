// src/components/PostsPanel.js
import React from 'react';
import { useData } from '../context/DataContext';
import { PostsIcon, LoaderIcon } from './Icons';
import PostEmbed from './PostEmbed';

const PostsPanel = () => {
  const { content, ui } = useData();
  const { posts, selectedPost, handlePostSelect } = content;
  const { isLoading } = ui;

  // Главная защита, если данные грузятся или их нет
  if (isLoading && (!posts || posts.length === 0)) {
    return (
      <div className="panel posts-panel">
        <div className="panel-content">
          <div className="panel-header">
            <h2><PostsIcon /> POSTS</h2>
          </div>
          <div className="panel-body">
            <div className="loading-state"><LoaderIcon /> LOADING TRANSMISSIONS...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="panel posts-panel">
        <div className="panel-content">
          <div className="panel-header">
            <h2><PostsIcon /> POSTS</h2>
          </div>
          <div className="panel-body">
            <div className="empty-state">NO TRANSMISSIONS DETECTED.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel posts-panel">
      {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
      <div className="panel-content">
        <div className="panel-header">
          <h2><PostsIcon /> POSTS</h2>
        </div>
        <div className="panel-body">
          {posts.map((post, index) => (
            post && post.id ? (
              <PostEmbed
                key={post.id}
                post={post}
                isSelected={selectedPost?.id === post.id}
                onPostSelect={handlePostSelect}
              />
            ) : null
          ))}
        </div>
      </div>
      {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
    </div>
  );
};

export default PostsPanel;