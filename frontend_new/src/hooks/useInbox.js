// src/hooks/useInbox.js
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useInbox = (session, uiHooks, autoReplyEnabled) => {
  const [inboxItems, setInboxItems] = useState([]);
  const [unansweredItems, setUnansweredItems] = useState([]);

  const fetchInbox = useCallback(async () => {
    const { data, error } = await supabase.from('comment_analytics').select('*').in('status', ['new']).order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching inbox:", error);
    } else {
      setInboxItems(data || []);
    }
  }, []);

  const fetchUnanswered = useCallback(async () => {
    const { data, error } = await supabase.from('comment_analytics').select('*').eq('status', 'unanswered').order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching unanswered:", error);
    } else {
      setUnansweredItems(data || []);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchInbox();
      fetchUnanswered();
    }
  }, [session, fetchInbox, fetchUnanswered]);
  
  // Этот useEffect отвечает за запуск автоответчика
  useEffect(() => {
    if (session && autoReplyEnabled && inboxItems.length > 0) {
      uiHooks.setMessage(`Nalezeno ${inboxItems.length} komentářů k automatickému zpracování...`);
      inboxItems.forEach(item => {
        supabase.functions.invoke('process-comment', { body: { comment: item } })
          .then(({ error }) => {
            if (error) console.error(`Chyba při zpracování ${item.id}:`, error);
          });
      });
      setInboxItems([]);
      setTimeout(() => {
          fetchInbox();
          fetchUnanswered();
      }, 5000);
    }
  }, [session, inboxItems, autoReplyEnabled, fetchInbox, fetchUnanswered, uiHooks]);

  const handleReply = async (commentId, replyText) => {
    uiHooks.setLoadingAction('Odpovídám...');
    uiHooks.setMessage('Publikování odpovědi na Facebook...');
    try {
      const { error } = await supabase.functions.invoke('reply-to-comment', { body: { commentId, message: replyText } });
      if (error) throw new Error(error.message);
      uiHooks.setMessage('Odpověď byla úspěšně publikována!');
      setUnansweredItems(prev => prev.filter(item => item.comment_id !== commentId));
      await supabase.from('comment_analytics').update({ status: 'replied' }).eq('comment_id', commentId);
    } catch (error) {
      uiHooks.setMessage(`Chyba při publikování: ${error.message}`);
    } finally {
      uiHooks.setLoadingAction('');
    }
  };
  
  return {
    inboxItems,
    unansweredItems,
    fetchInbox,
    fetchUnanswered,
    handleReply,
  };
};