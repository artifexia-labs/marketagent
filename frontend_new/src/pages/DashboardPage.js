import React from 'react';
import PostsPanel from '../components/PostsPanel';
import CommentsPanel from '../components/CommentsPanel';
// Больше не импортируем SettingsPanel

const DashboardPage = () => {
  return (
    // Меняем класс на новый, для двух колонок
    <main className="dashboard-layout">
      <PostsPanel />
      <CommentsPanel />
      {/* Убрали панель настроек отсюда */}
    </main>
  );
};

export default DashboardPage;