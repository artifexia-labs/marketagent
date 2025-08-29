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
import LandingPage from './pages/LandingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BootLoader from './components/BootLoader'; 

const AnimatedBackground = () => <div className="particles"></div>;

const AppController = () => {
  const { session, isAuthLoading } = useData();

  if (isAuthLoading) {
    return <BootLoader />; 
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    );
  }

  // Если сессия есть, ВСЕГДА показываем дашборд
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<InboxPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Любой другой маршрут для залогиненного пользователя ведет на главную */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <AnimatedBackground />
      <AppController />
    </>
  );
}

export default App;