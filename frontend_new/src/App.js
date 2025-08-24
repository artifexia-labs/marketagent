// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { useData } from './context/DataContext';
import Sidebar from './components/Sidebar';
import InboxPage from './pages/InboxPage';
import ContentPage from './pages/ContentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BootLoader from './components/BootLoader';

// Компонент для анимированного фона
const AnimatedBackground = () => <div className="particles"></div>;

// Компонент-обертка для защищенных роутов.
// Он проверяет, есть ли активная сессия. Если нет - перенаправляет на страницу входа.
const ProtectedRoute = ({ children }) => {
    const { session } = useData();
    return session ? children : <Navigate to="/login" />;
};

function App() {
  const { session, isAuthLoading } = useData();

  // Пока мы проверяем, авторизован ли пользователь, показываем красивый загрузчик.
  // Это предотвращает "мигание" интерфейса при перезагрузке страницы.
  if (isAuthLoading) {
      return (
        <>
            <AnimatedBackground />
            <BootLoader onBootComplete={() => {}} />
        </>
      );
  }

  return (
    <>
      <AnimatedBackground />
      {/* Если сессия есть (пользователь вошел), показываем главный дашборд */}
      {session ? (
        <div className="dashboard-container">
          <Sidebar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              
              {/* Если авторизованный пользователь случайно зайдет на /login, перекинем его на главную */}
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              
              {/* Любой другой неизвестный путь также перенаправит на главную */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Если сессии нет, показываем только страницы входа, регистрации и сброса пароля
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Любой другой путь, который попытается открыть неавторизованный пользователь, перенаправит его на /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;