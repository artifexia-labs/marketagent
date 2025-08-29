// src/pages/ConnectPage.js
import React, { useState, useEffect } from 'react'; // <--- ДОБАВЛЯЕМ useEffect
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { JustaxLogo, LoaderIcon } from '../components/Icons';

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>;

const ConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // <--- Теперь используется

  const handleFacebookLogin = async () => {
    setLoading(true);
    setMessage('Přesměrování na Facebook...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        scopes: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage(`Chyba: ${error.message}`);
      setLoading(false);
    }
  };

  // --- ЭТОТ ФРАГМЕНТ КОДА РЕШАЕТ ВСЮ ПРОБЛЕМУ ---
  // Он "слушает" событие входа в систему после редиректа с Facebook.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        // Если событие - это вход (SIGNED_IN) и в сессии есть provider_token...
        if (event === 'SIGNED_IN' && session?.provider_token) {
            setLoading(true);
            setMessage("Zpracovávám autorizaci, malý moment...");
            
            // Немедленно очищаем URL от служебных данных Facebook
            navigate('/connect', { replace: true });

            // Вызываем серверную функцию для обмена токена
            supabase.functions.invoke('exchange-facebook-token', {
                body: { shortLivedToken: session.provider_token }
            }).then(({ data, error }) => {
                if (error) {
                    setMessage(`Kritická chyba: ${error.message}`);
                    setLoading(false);
                } else {
                    setMessage(data.message + " Přesměrování...");
                    // После успеха перезагружаем всё приложение.
                    // Это самый надежный способ получить новое состояние профиля.
                    window.location.reload(); 
                }
            });
        }
    });

    // Отписываемся от слушателя при размонтировании компонента
    return () => subscription.unsubscribe();
  }, [navigate]); // <--- Добавили зависимость


  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <JustaxLogo />
          <h2>Poslední krok</h2>
        </div>
        <div className="auth-form" style={{textAlign: 'center', gap: '16px'}}>
          <p style={{color: 'var(--color-text-secondary)'}}>
            Pro dokončení registrace je nutné propojit váš účet s Facebookem.
          </p>
          <button onClick={handleFacebookLogin} className="button-primary" disabled={loading} style={{padding: '16px', fontSize: '16px'}}>
            {loading ? <LoaderIcon /> : <><FacebookIcon/> Propojit s Facebookem</>}
          </button>
        </div>
        {message && <p className="auth-message success">{message}</p>}
      </div>
    </div>
  );
};

export default ConnectPage;