// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import './Auth.css'; // Используем те же стили
import { JustaxLogo, LoaderIcon } from '../components/Icons';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            throw error;
        }

        setMessage('Регистрация прошла успешно! Пожалуйста, проверьте свою почту для подтверждения.');

    } catch (error) {
        setMessage(`Ошибка регистрации: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <JustaxLogo />
          <h2>Создание аккаунта</h2>
        </div>
        <form onSubmit={handleSignUp} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="new.operator@justax.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Придумайте надежный пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? <LoaderIcon /> : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
        </form>
        {message && <p className="auth-message success">{message}</p>}
        <div className="auth-footer">
          <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;