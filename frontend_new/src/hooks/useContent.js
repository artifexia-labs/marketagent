// src/hooks/useContent.js
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useContent = (session, uiHooks) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchPosts = useCallback(async () => {
    uiHooks.setLoadingAction('Načítání příspěvků...');
    try {
      const { data, error } = await supabase.functions.invoke('get-facebook-posts');
      if (error || data.error) throw new Error(error?.message || data.error);
      setPosts(data.data || []);
      uiHooks.setMessage(`Automaticky načteno ${data.data?.length || 0} příspěvků.`);
    } catch (error) {
      uiHooks.setMessage(`Chyba při automatickém načítání příspěvků: ${error.message}`);
    } finally {
      uiHooks.setLoadingAction('');
    }
  }, [uiHooks]);

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session, fetchPosts]);

  const fetchComments = useCallback(async (postId, isAutoReplyEnabled) => {
    if (!postId) return;
    uiHooks.setIsLoading(true);
    uiHooks.setLoadingAction('Načítání komentářů...');
    setComments([]);
    const loadingMessage = isAutoReplyEnabled ? "Synchronizuji komentáře pro AI..." : "Hledání komentářů bez odpovědi...";
    uiHooks.setMessage(loadingMessage);

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
      uiHooks.setMessage(resultMessage);

    } catch (error) {
      uiHooks.setMessage(`Chyba při načítání komentářů: ${error.message}`);
    } finally {
      uiHooks.setIsLoading(false);
      uiHooks.setLoadingAction('');
    }
  }, [uiHooks]);

  const handlePostSelect = useCallback((post, isAutoReplyEnabled) => {
    setSelectedPost(post);
    uiHooks.setMessage(`Vybrán příspěvek...`);
    fetchComments(post.id, isAutoReplyEnabled);
  }, [fetchComments, uiHooks]);

  return {
    posts,
    selectedPost,
    comments,
    fetchPosts,
    handlePostSelect,
    fetchComments,
  };
};