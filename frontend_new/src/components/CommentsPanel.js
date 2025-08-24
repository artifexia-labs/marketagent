// src/components/CommentsPanel.js
import React from 'react';
import { useData } from '../context/DataContext';
import { CommentsIcon, LoaderIcon } from './Icons';

const CommentThread = ({ comment }) => (
    <div className="item-card comment-thread-view">
        <p><strong>{comment.from?.name || 'UNKNOWN'}:</strong> {comment.message}</p>
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
      {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
      <div className="panel-content">
        <div className="panel-header">
          <h2><CommentsIcon /> COMMENTS</h2>
          <button
              onClick={() => fetchComments(selectedPost.id)}
              disabled={!selectedPost || isLoading}
              className="button-secondary"
          >
            {isLoading && loadingAction.includes('komentářů') ? <LoaderIcon /> : 'SYNC & INJECT TO INBOX'}
          </button>
        </div>
        <div className="panel-body">
          {!selectedPost && <div className="empty-state">SELECT TRANSMISSION TO DECRYPT COMMENTS.</div>}
          {selectedPost && isLoading && comments.length === 0 && <div className="loading-state"><LoaderIcon /></div>}
          {selectedPost && !isLoading && comments.length === 0 && <div className="empty-state">NO COMMENTS DETECTED FOR THIS TRANSMISSION.</div>}

          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
      {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
    </div>
  );
};

export default CommentsPanel;