// src/context/DataContext.js
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAuthSession } from '../hooks/useAuthSession';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';
import { useInbox } from '../hooks/useInbox';
import { useAnalytics } from '../hooks/useAnalytics';
import { useKnowledge } from '../hooks/useKnowledge';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // useAuthSession - единственный источник правды об авторизации
  const { session, user, profile, isAuthLoading } = useAuthSession();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [message, setMessage] = useState('Vítejte v AI Market Agent!');

  // API для управления UI, обернуто в useMemo для стабильности
  const uiApi = useMemo(() => ({
    setIsLoading,
    setLoadingAction,
    setMessage,
  }), []);

  // Состояние UI, обернуто в useMemo для предотвращения лишних ререндеров
  const uiState = useMemo(() => ({
    isLoading,
    loadingAction,
    message
  }), [isLoading, loadingAction, message]);

  // Все хуки получают profile, чтобы знать, можно ли им начинать работу
  const settings = useSettings(session, profile, uiApi);
  const content = useContent(session, profile, uiApi);
  const inbox = useInbox(session, profile, uiApi, settings.autoReplyEnabled);
  const analytics = useAnalytics(session, profile, uiApi);
  const knowledge = useKnowledge(session, profile, uiApi);

  // Создаем финальный объект контекста, который будет пересоздаваться только при реальном изменении данных
  const value = useMemo(() => ({
    session,
    user,
    profile,
    isAuthLoading,
    ui: { ...uiState, ...uiApi },
    settings,
    knowledge,
    content,
    inbox,
    analytics
  }), [
    session, user, profile, isAuthLoading, uiState, uiApi, settings,
    knowledge, content, inbox, analytics
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Хук для легкого доступа к контексту
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};