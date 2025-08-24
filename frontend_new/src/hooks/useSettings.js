// src/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useSettings = (session) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [personalities, setPersonalities] = useState({ positive: [], negative: [], question: [], universal: [] });
  const [personalityPositive, setPersonalityPositive] = useState('');
  const [personalityNegative, setPersonalityNegative] = useState('');
  const [personalityQuestion, setPersonalityQuestion] = useState('');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [linkFaq, setLinkFaq] = useState('');
  const [linkTerms, setLinkTerms] = useState('');
  const [linkSupport, setLinkSupport] = useState('');
  
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const [settingsRes, personalitiesRes] = await Promise.all([
      supabase.from('settings').select('*').eq('id', 1).single(),
      supabase.from('personalities').select('*'),
    ]);
    
    if (settingsRes.data) {
      const d = settingsRes.data;
      setToken(d.facebook_token || '');
      setPersonalityPositive(d.personality_positive || '');
      setPersonalityNegative(d.personality_negative || '');
      setPersonalityQuestion(d.personality_question || '');
      setAutoReplyEnabled(d.auto_reply_enabled || false);
      setContactEmail(d.contact_email || '');
      setLinkFaq(d.link_faq || '');
      setLinkTerms(d.link_terms || '');
      setLinkSupport(d.link_support || '');
    }
    
    if (personalitiesRes.data) {
      const d = personalitiesRes.data;
      setPersonalities({
        positive: d.filter(p => p.category === 'positive'),
        negative: d.filter(p => p.category === 'negative'),
        question: d.filter(p => p.category === 'question'),
        universal: d.filter(p => p.category === 'universal'),
      });
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session, fetchSettings]);

  const saveSettings = async (uiHooks) => {
    uiHooks.setLoadingAction('Ukládání nastavení...');
    uiHooks.setMessage('Ukládání strategie a odkazů...');
    
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
    
    uiHooks.setMessage(error ? `Chyba při ukládání: ${error.message}` : 'Nastavení úspěšně uložena!');
    uiHooks.setLoadingAction('');
  };

  return {
    loading,
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
    saveSettings
  };
};