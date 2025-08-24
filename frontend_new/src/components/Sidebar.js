// src/components/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  JustaxLogo, InboxIcon, PostsIcon, AnalyticsIcon, 
  SettingsIcon, UserIcon, LogoutIcon // Импортируем новые иконки
} from './Icons';
import { useData } from '../context/DataContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useData();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Перенаправляем на страницу входа после выхода
  };

  return (
    <aside className="sidebar">
      <div>
        <header className="sidebar-header">
          <NavLink to="/" className="sidebar-logo">
            <JustaxLogo />
          </NavLink>
        </header>
        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item" end>
            <InboxIcon />
            <span>Inbox</span>
          </NavLink>
          <NavLink to="/content" className="nav-item">
            <PostsIcon />
            <span>Content</span>
          </NavLink>
          <NavLink to="/analytics" className="nav-item">
            <AnalyticsIcon />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/settings" className="nav-item">
            <SettingsIcon />
            <span>Settings</span>
          </NavLink>
          {/* Новый пункт меню для аккаунта */}
          <NavLink to="/account" className="nav-item">
            <UserIcon />
            <span>Account</span>
          </NavLink>
        </nav>
      </div>

      <footer className="sidebar-footer">
        <div className="user-profile">
          <span className="user-email">{user?.email}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <LogoutIcon />
          <span>Выйти</span>
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;