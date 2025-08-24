// src/components/PostEmbed.js
import React from 'react';

const PostEmbed = ({ post, isSelected, onPostSelect }) => {
  // FIX: Добавляем надежную проверку, чтобы компонент не падал,
  // если объект post по какой-то причине отсутствует.
  if (!post || !post.id) {
    return null; // Просто ничего не рендерим, если данные некорректны
  }

  const { message = '', created_time, permalink_url, id } = post;

  return (
    <div
      className={`post-embed ${isSelected ? 'selected' : ''}`}
      onClick={() => onPostSelect(post)}
    >
      <p>{message ? `${message.substring(0, 150)}...` : `[Příspěvek bez textu, ID: ${id}]`}</p>
      
      <div className="post-embed-footer">
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          {created_time ? new Date(created_time).toLocaleString() : 'No date'}
        </span>
        <a href={permalink_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          Zobrazit na Facebooku
        </a>
      </div>
    </div>
  );
};

export default PostEmbed;