// src/hooks/useSupabaseData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';

export const useSupabaseData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState('');
  const [message, setMessage] = useState('Vítejte v AI Market Agent!');
  const [inboxItems, setInboxItems] = useState([]);
  const [unansweredItems, setUnansweredItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [token, setToken] = useState('');
  const [personalities, setPersonalities] = useState({ positive: [], negative: [], question: [], universal: [] });
  const [personalityPositive, setPersonalityPositive] = useState('formální a vděčný');
  const [personalityNegative, setPersonalityNegative] = useState('empatický a řešící');
  const [personalityQuestion, setPersonalityQuestion] = useState('informativní a přesný');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [linkFaq, setLinkFaq] = useState('');
  const [linkTerms, setLinkTerms] = useState('');
  const [linkSupport, setLinkSupport] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [userProvidedInfo, setUserProvidedInfo] = useState('');
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [influenceIndex, setInfluenceIndex] = useState([]);

  // Ref to track comments currently being processed to avoid duplicates
  const processingIds = useRef(new Set());

  // --- Data Fetching Logic ---
  const fetchInbox = useCallback(async () => {
    // Теперь мы не показываем комментарии, которые находятся в обработке
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

  const fetchPosts = useCallback(async () => {
    setLoadingAction('Načítání příspěvků...');
    try {
      const { data, error } = await supabase.functions.invoke('get-facebook-posts');
      if (error || data.error) throw new Error(error?.message || data.error);
      setPosts(data.data || []);
      setMessage(`Automaticky načteno ${data.data?.length || 0} příspěvků.`);
    } catch (error) {
      setMessage(`Chyba při automatickém načítání příspěvků: ${error.message}`);
    } finally {
      setLoadingAction('');
    }
  }, []);

  // --- Initial Data Load Effect ---
  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      setMessage('Načítání úvodních dat...');
      const [settingsRes, knowledgeRes, personalitiesRes, filesRes] = await Promise.all([
        supabase.from('settings').select('*').eq('id', 1).single(),
        supabase.from('knowledge_base').select('*').eq('id', 1).single(),
        supabase.from('personalities').select('*'),
        supabase.storage.from('knowledge_files').list()
      ]);
      if (settingsRes.data) {
        const d = settingsRes.data;
        setToken(d.facebook_token || '');
        setPersonalityPositive(d.personality_positive || 'formální a vděčný');
        setPersonalityNegative(d.personality_negative || 'empatický a řešící');
        setPersonalityQuestion(d.personality_question || 'informativní a přesný');
        setAutoReplyEnabled(d.auto_reply_enabled || false);
        setContactEmail(d.contact_email || '');
        setLinkFaq(d.link_faq || '');
        setLinkTerms(d.link_terms || '');
        setLinkSupport(d.link_support || '');
      }
      if (knowledgeRes.data) setUserProvidedInfo(knowledgeRes.data.user_provided_info || '');
      if (personalitiesRes.data) {
        const d = personalitiesRes.data;
        setPersonalities({
          positive: d.filter(p => p.category === 'positive'),
          negative: d.filter(p => p.category === 'negative'),
          question: d.filter(p => p.category === 'question'),
          universal: d.filter(p => p.category === 'universal'),
        });
      }
      if (filesRes.data) setKnowledgeFiles(filesRes.data);
      await Promise.all([fetchInbox(), fetchUnanswered(), fetchPosts()]);
      setMessage('Připraven!');
      setIsLoading(false);
    };
    getInitialData();
  }, [fetchInbox, fetchUnanswered, fetchPosts]);

  // --- Auto-Reply Trigger Effect (Simplified) ---
  useEffect(() => {
    // Если включен автоответчик и есть новые комментарии для обработки
    if (autoReplyEnabled && inboxItems.length > 0) {
      setMessage(`Nalezeno ${inboxItems.length} komentářů k automatickému zpracování...`);
      // Запускаем обработку для ВСЕХ новых комментариев.
      // Бэкенд сам разберется с дубликатами благодаря "замку".
      inboxItems.forEach(item => {
        supabase.functions.invoke('process-comment', { body: { comment: item } })
          .then(({ error }) => {
            if (error) {
              console.error(`Chyba při zpracování ${item.id}:`, error);
            }
          });
      });
      // Оптимистично убираем их из UI, чтобы не было мерцания
      setInboxItems([]);
      // Запускаем повторную проверку через некоторое время, чтобы обновить списки
      setTimeout(() => {
          fetchInbox();
          fetchUnanswered();
      }, 5000); // 5 секунд
    }
  }, [inboxItems, autoReplyEnabled, fetchInbox, fetchUnanswered]);

  const fetchComments = useCallback(async (postId) => {
    if (!postId) return;
    setIsLoading(true);
    setLoadingAction('Načítání komentářů...');
    setComments([]);
    const loadingMessage = autoReplyEnabled ? "Synchronizuji komentáře pro AI..." : "Hledání komentářů bez odpovědi...";
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
      await Promise.all([fetchInbox(), fetchUnanswered()]);
    } catch (error) {
      setMessage(`Chyba při načítání komentářů: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  }, [fetchInbox, fetchUnanswered, autoReplyEnabled]);

  const handlePostSelect = useCallback((post) => {
    setSelectedPost(post);
    setMessage(`Vybrán příspěvek...`);
    fetchComments(post.id);
  }, [fetchComments]);

  const handleReply = async (commentId, replyText) => {
    setIsLoading(true);
    setLoadingAction('Odpovídám...');
    setMessage('Publikování odpovědi na Facebook...');
    try {
      const { error } = await supabase.functions.invoke('reply-to-comment', { body: { commentId, message: replyText } });
      if (error) throw new Error(error.message);
      setMessage('Odpověď byla úspěšně publikována!');
      setUnansweredItems(prev => prev.filter(item => item.comment_id !== commentId));
      await supabase.from('comment_analytics').update({ status: 'replied' }).eq('comment_id', commentId);
    } catch (error) {
      setMessage(`Chyba při publikování: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };
  
  const saveSettings = async () => {
    setIsLoading(true);
    setLoadingAction('Ukládání nastavení...');
    setMessage('Ukládání strategie a odkazů...');
    const { error } = await supabase.from('settings').upsert({ 
      id: 1, 
      facebook_token: token,
      personality_positive: personalityPositive,
      personality_negative: personalityNegative,
      personality_question: personalityQuestion,
      auto_reply_enabled: autoReplyEnabled,
      contact_email: contactEmail,
      link_faq: linkFaq,
      link_terms: linkTerms,
      link_support: linkSupport,
    });
    setMessage(error ? `Chyba při ukládání: ${error.message}` : 'Nastavení úspěšně uložena!');
    setIsLoading(false);
    setLoadingAction('');
  };

  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    setMessage("Načítání analytických dat...");
    const { data, error } = await supabase.from('comment_analytics').select('*, posts(reactions_total)').order('created_at', { ascending: false });
    if (error) {
        setMessage(`Chyba při načítání analytiky: ${error.message}`);
    } else {
        setAnalyticsData(data);
        setMessage(`Analytická data pro ${data.length} komentářů načtena.`);
    }
    setIsLoading(false);
  }, []);

  const fetchInfluenceIndex = useCallback(async () => {
      setIsLoading(true);
      setMessage("Výpočet indexu vlivu...");
      try {
        const { data, error } = await supabase.functions.invoke('calculate-influence-index');
        if (error || data.error) throw new Error(error?.message || data.error);
        setInfluenceIndex(data || []);
      } catch (error) {
        setMessage(`Chyba při výpočtu indexu vlivu: ${error.message}`);
      }
      setIsLoading(false);
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    setMessage(`Nahrávám soubor ${file.name}...`);
    try {
        const { error } = await supabase.storage.from('knowledge_files').upload(file.name, file, { upsert: true });
        if (error) throw error;
        setMessage(`Soubor ${file.name} nahrán. Spouštím zpracování...`);
        const { data: filesData } = await supabase.storage.from('knowledge_files').list();
        if (filesData) setKnowledgeFiles(filesData);
    } catch (error) {
        setMessage(`Chyba při nahrávání souboru: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setLoadingAction('Generování svodky...');
    setMessage('Ukládám informace a analyzuji web...');
    await supabase.from('knowledge_base').upsert({ id: 1, user_provided_info: userProvidedInfo });
    const { data: summaryData, error: summaryError } = await supabase.functions.invoke('summarize-website', {
      body: { siteUrl: websiteUrl }
    });
    if (summaryError) {
        setMessage(`Chyba při analýze webu: ${summaryError.message}`);
        setIsLoading(false);
        return;
    }
    const combinedSummary = `Svodka z webu: ${summaryData.summary}\n\nDalší informace: ${userProvidedInfo}`;
    await supabase.from('knowledge_base').upsert({ id: 1, website_summary: summaryData.summary, brand_voice_summary: combinedSummary });
    setMessage('Báze znalostí úspěšně aktualizována!');
    setIsLoading(false);
    setLoadingAction('');
  };

  const handleCreatePersonality = async () => {
      setIsLoading(true);
      setLoadingAction('Vytváření osobnosti...');
      setMessage('Vytvářím novou AI osobnost na základě webu...');
      const { data: knowledge } = await supabase.from('knowledge_base').select('website_summary').eq('id', 1).single();
      if (!knowledge?.website_summary) {
          setMessage('Nejprve uložte a vygenerujte svodku v Bázi znalostí.');
          setIsLoading(false);
          return;
      }
      try {
          const { data, error } = await supabase.functions.invoke('create-ai-personality', {
              body: { websiteSummary: knowledge.website_summary }
          });
          if (error || data.error) throw new Error(error?.message || data.error);
          setMessage(`Nová osobnost "${data.newPersonality.display_name_cz}" byla úspěšně vytvořena!`);
          setPersonalities(prev => ({
              ...prev,
              universal: [...prev.universal, data.newPersonality]
          }));
      } catch (error) {
          setMessage(`Chyba při vytváření osobnosti: ${error.message}`);
      } finally {
          setIsLoading(false);
          setLoadingAction('');
      }
  };

  return {
    ui: { isLoading, loadingAction, message },
    settings: {
      token, setToken,
      personalities,
      personalityPositive, setPersonalityPositive,
      personalityNegative, setPersonalityNegative,
      personalityQuestion, setPersonalityQuestion,
      autoReplyEnabled, setAutoReplyEnabled,
      contactEmail, setContactEmail,
      linkFaq, setLinkFaq,
      linkTerms, setLinkTerms,
      linkSupport, setLinkSupport,
      saveSettings,
    },
    knowledge: {
        websiteUrl, setWebsiteUrl,
        userProvidedInfo, setUserProvidedInfo,
        knowledgeFiles,
        handleGenerateSummary,
        handleCreatePersonality,
        handleFileUpload
    },
    inbox: {
        inboxItems,
        unansweredItems,
        fetchInbox,
        fetchUnanswered,
        handleReply
    },
    analytics: {
        analyticsData,
        influenceIndex,
        fetchAnalyticsData,
        fetchInfluenceIndex
    },
    content: {
        posts,
        selectedPost,
        comments,
        fetchPosts,
        handlePostSelect,
        fetchComments
    }
  };
};