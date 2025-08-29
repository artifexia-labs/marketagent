// src/components/CommentsPanel.js
import React from 'react';
import { useData } from '../context/DataContext';
import { CommentsIcon, LoaderIcon } from './Icons';
import './CommentsPanel.css'; // Убедись, что стили импортированы

const CommentThread = ({ comment }) => (
    <div className="comment-thread-view">
        <p><strong>{comment.from?.name || 'UNKNOWN'}:</strong> {comment.message}</p>
        {/* ИСПРАВЛЕНИЕ ЗДЕСЬ: Отображаем вложенные ответы */}
        {comment.comments && comment.comments.data.map(reply => (
            <div key={reply.id} className="comment-reply-view">
                <p><strong>{reply.from?.name || 'UNKNOWN'}:</strong> {reply.message}</p>
            </div>
        ))}
    </div>
);

const CommentsPanel = () => {
  const { content, ui } = useData();
  const { comments, selectedPost, fetchComments } = content;
  const { isLoading, loadingAction } = ui;

  return (
    <div className="panel comments-panel">
      <div className="panel-content">
        <div className="panel-header">
          <h2><CommentsIcon /> COMMENTS</h2>
          <button
              onClick={() => selectedPost && fetchComments(selectedPost.id, false)} // Добавил isAutoReplyEnabled = false
              disabled={!selectedPost || isLoading}
              className="button-secondary"
          >
            {isLoading && loadingAction.includes('komentářů') ? <LoaderIcon /> : 'SYNC & INJECT TO INBOX'}
          </button>
        </div>
        <div className="panel-body">
          {!selectedPost && <div className="empty-state"><h2>SELECT A POST</h2><p>Choose a post from the left panel to see comments.</p></div>}
          {selectedPost && isLoading && comments.length === 0 && <div className="loading-state"><LoaderIcon /> Loading Comments...</div>}
          {selectedPost && !isLoading && comments.length === 0 && <div className="empty-state"><h2>NO COMMENTS</h2><p>No comments found for this post.</p></div>}

          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;