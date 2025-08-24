// src/pages/AccountPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useData } from '../context/DataContext';
import './AccountPage.css'; // Новые стили для этой страницы
import { LoaderIcon, UserIcon, LockIcon } from '../components/Icons'; // Добавим новые иконки

const AccountPage = () => {
  const { user } = useData();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMessage('Пароль успешно обновлен!');
      setPassword(''); // Очищаем поле после успеха
    } catch (error) {
      setMessage(`Ошибка обновления: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-layout">
      <div className="panel account-panel">
        <div className="panel-header">
          <h2><UserIcon /> Ваш Аккаунт</h2>
        </div>
        <div className="panel-body">
          <div className="account-info">
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="account-form">
            <h3><LockIcon /> Сменить пароль</h3>
            <div className="input-group">
              <label htmlFor="new-password">Новый пароль</label>
              <input
                id="new-password"
                type="password"
                placeholder="Введите новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button-secondary" disabled={loading}>
              {loading ? <LoaderIcon /> : 'Обновить пароль'}
            </button>
          </form>

          {message && <p className="account-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;