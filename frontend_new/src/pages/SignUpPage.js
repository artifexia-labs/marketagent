// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import './Auth.css';
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
            options: {
                // --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
                // После клика на ссылку в письме, пользователь попадет на страницу входа.
                emailRedirectTo: `${window.location.origin}/login`
            }
        });

        if (error) {
            throw error;
        }

        // Обновляем сообщение для пользователя
        setMessage('Registrace proběhla úspěšně! Prosím, zkontrolujte svůj email, potvrďte účet a poté se můžete přihlásit.');

    } catch (error) {
        setMessage(`Chyba registrace: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <JustaxLogo />
          <h2>Vytvoření účtu</h2>
        </div>
        <form onSubmit={handleSignUp} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="novy.operator@justax.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Heslo</label>
            <input
              id="password"
              type="password"
              placeholder="Vymyslete si bezpečné heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? <LoaderIcon /> : 'ZAREGISTROVAT SE'}
          </button>
        </form>
        {message && <p className="auth-message success">{message}</p>}
        <div className="auth-footer">
          <p>Máte již účet? <Link to="/login">Přihlásit se</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;