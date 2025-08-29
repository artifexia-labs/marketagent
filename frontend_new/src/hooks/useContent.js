// src/hooks/useContent.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

export const useContent = (session, profile, uiHooks) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const fetchInitiated = useRef(false);

  const { setLoadingAction, setMessage, setIsLoading } = uiHooks;

  const fetchPosts = useCallback(async () => {
    setLoadingAction('Načítání příspěvků...');
    try {
      const { data, error } = await supabase.functions.invoke('get-facebook-posts');
      if (error || data.error) throw new Error(error?.message || data.error);
      setPosts(data.data || []);
      setMessage(`Automaticky načteno ${data.data?.length || 0} příspěvků.`);
    } catch (error) {
      if (error.message.includes('Facebook token не найден')) {
          setMessage('Pro načtení příspěvků propojte účet s Facebookem v nastavení.');
      } else {
          setMessage(`Chyba při načítání příspěvků: ${error.message}`);
      }
    } finally {
      setLoadingAction('');
    }
  }, [setLoadingAction, setMessage]);

  useEffect(() => {
    // --- ИЗМЕНЕНИЕ: Убираем проверку на facebook_token ---
    if (session && !fetchInitiated.current) {
      fetchInitiated.current = true;
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