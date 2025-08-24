// src/context/DataContext.js
import React, { createContext, useContext, useState } from 'react';

// Импортируем все наши новые хуки
import { useAuthSession } from '../hooks/useAuthSession';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';
import { useInbox } from '../hooks/useInbox';
import { useAnalytics } from '../hooks/useAnalytics';
import { useKnowledge } from '../hooks/useKnowledge';

// UI хук для сообщений и лоадеров, чтобы не передавать функции во все хуки
const useUIState = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState('');
    const [message, setMessage] = useState('Vítejte v AI Market Agent!');
    return { isLoading, setIsLoading, loadingAction, setLoadingAction, message, setMessage };
};

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { session, user, isAuthLoading } = useAuthSession();
  const uiState = useUIState();

  // Каждый хук получает сессию и, если нужно, UI-хуки для управления состоянием загрузки
  const settings = useSettings(session, uiState);
  const knowledge = useKnowledge(session, uiState);
  const content = useContent(session, uiState);
  const inbox = useInbox(session, uiState, settings.autoReplyEnabled); // Inbox зависит от настроек
  const analytics = useAnalytics(session, uiState);

  const value = {
    session,
    user,
    isAuthLoading,
    ui: uiState,
    settings,
    knowledge,
    content,
    inbox,
    analytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};