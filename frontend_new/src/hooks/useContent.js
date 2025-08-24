// src/hooks/useContent.js
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useContent = (session, uiHooks) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
  // Мы "вытаскиваем" нужные функции из uiHooks, чтобы зависимости были стабильными
  const { setLoadingAction, setMessage, setIsLoading } = uiHooks;

  const fetchPosts = useCallback(async () => {
    setLoadingAction('Načítání příspěvků...');
    try {
      const { data, error } = await supabase.functions.invoke('get-facebook-posts');
      if (error || data.error) throw new Error(error?.message || data.error);
      setPosts(data.data || []);
      setMessage(`Automaticky načteno ${data.data?.length || 0} příspěvků.`);
    } catch (error) {
      // Важное изменение: выводим более понятное сообщение при блокировке
      if (error.message.includes('80001')) {
          setMessage('Ошибка: Facebook временно заблокировал запросы из-за их частоты. Пожалуйста, подождите 15-30 минут и обновите страницу.');
      } else {
          setMessage(`Chyba při automatickém načítání příspěvků: ${error.message}`);
      }
    } finally {
      setLoadingAction('');
    }
    // Теперь зависимости в useCallback стабильны и не будут меняться при каждом рендере
  }, [setLoadingAction, setMessage]);

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session, fetchPosts]);

  const fetchComments = useCallback(async (postId, isAutoReplyEnabled) => {
    if (!postId) return;
    setIsLoading(true);
    setLoadingAction('Načítání komentářů...');
    setComments([]);
    const loadingMessage = isAutoReplyEnabled ? "Synchronizuji komentáře pro AI..." : "Hledání komentářů bez odpovědi...";
    setMessage(loadingMessage);

    try {
      const { data, error } = await supabase.functions.invoke('get-facebook-comments', { body: { postId } });
      if (error || data.error) throw new Error(error?.message || data.error);
      setComments(data.data || []);
      
      let resultMessage = `Načteno ${data.data?.length || 0} vláken. `;
      if (data.autoReplyEnabled) {
          resultMessage += `${data.savedCount || 0} nových komentářů zařazeno do fronty pro AI.`;
      } else {
          resultMessage += `${data.savedCount || 0} komentářů přidáno do fronty 'Čeká na odpověď'.`;
      }
      setMessage(resultMessage);

    } catch (error) {
      setMessage(`Chyba při načítání komentářů: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  }, [setIsLoading, setLoadingAction, setMessage]);

  const handlePostSelect = useCallback((post, isAutoReplyEnabled) => {
    setSelectedPost(post);
    setMessage(`Vybrán příspěvek...`);
    fetchComments(post.id, isAutoReplyEnabled);
  }, [fetchComments, setMessage]);

  return {
    posts,
    selectedPost,
    comments,
    fetchPosts,
    handlePostSelect,
    fetchComments,
  };
};