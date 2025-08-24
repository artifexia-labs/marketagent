import React from 'react';
import SettingsPanel from '../components/SettingsPanel';

// Простая страница, которая оборачивает нашу панель настроек
// для удобного отображения через роутер.
const SettingsPage = () => {
  return (
    <main className="settings-layout">
      <SettingsPanel />
    </main>
  );
};

export default SettingsPage;