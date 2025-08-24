// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { JustaxLogo, LoaderIcon } from '../components/Icons';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Supabase автоматически поймет пользователя по токену из URL
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMessage('Пароль успешно изменен! Сейчас вы будете перенаправлены на страницу входа.');
      
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <JustaxLogo />
          <h2>Укажите новый пароль</h2>
        </div>
        <form onSubmit={handlePasswordReset} className="auth-form">
          <div className="input-group">
            <label htmlFor="password">Новый пароль</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? <LoaderIcon /> : 'Сохранить новый пароль'}
          </button>
        </form>
        {message && <p className="auth-message success">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;