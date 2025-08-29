// src/hooks/useAuthSession.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useAuthSession = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange - это единственный источник правды. Он срабатывает
    // один раз при загрузке и потом при каждом входе/выходе.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Если пользователь вошел, грузим его профиль
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Ошибка "профиль не найден" - это нормально для нового пользователя.
          // Любая другая ошибка - это проблема.
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          setProfile(userProfile);
        } else {
          // Если сессии нет, профиля тоже нет
          setProfile(null);
        }
      } catch (error) {
        console.error("Критическая ошибка при обработке авторизации:", error);
        setProfile(null); // Сбрасываем профиль при ошибке
      } finally {
        // ЭТОТ БЛОК ГАРАНТИРУЕТ, ЧТО ЗАГРУЗКА ЗАВЕРШИТСЯ
        setIsAuthLoading(false);
      }
    });

    // Отписываемся от слушателя, когда компонент больше не нужен
    return () => subscription.unsubscribe();
  }, []); // Пустой массив зависимостей = запустить только один раз

  return { session, user, profile, isAuthLoading };
};