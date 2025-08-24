// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import './Auth.css'; // Используем те же стили
import { JustaxLogo, LoaderIcon } from '../components/Icons';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password', // Важно: ссылка на страницу, где будет форма для нового пароля
      });
      if (error) throw error;
      setMessage('Отлично! Если такой email есть в нашей базе, мы отправили на него инструкцию по сбросу пароля.');
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
          <h2>Сброс пароля</h2>
        </div>
        <form onSubmit={handlePasswordResetRequest} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Ваш Email</label>
            <input
              id="email"
              type="email"
              placeholder="operator@justax.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? <LoaderIcon /> : 'Отправить инструкцию'}
          </button>
        </form>
        {message && <p className="auth-message success">{message}</p>}
        <div className="auth-footer">
          <p>Вспомнили пароль? <Link to="/login">Войти</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;