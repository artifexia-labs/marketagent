// src/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useSettings = (session, profile, uiHooks) => {
  const [loading, setLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState(null);
  
  const [contactEmail, setContactEmail] = useState('');
  const [linkFaq, setLinkFaq] = useState('');
  const [linkTerms, setLinkTerms] = useState('');
  const [linkSupport, setLinkSupport] = useState('');
  
  const [personalities, setPersonalities] = useState({ positive: [], negative: [], question: [], universal: [] });
  const [personalityPositive, setPersonalityPositive] = useState('');
  const [personalityNegative, setPersonalityNegative] = useState('');
  const [personalityQuestion, setPersonalityQuestion] = useState('');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  
  const fetchProfileAndPersonalities = useCallback(async () => {
    // --- ИЗМЕНЕНИЕ: Убираем проверку на facebook_token ---
    if (!session?.user) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
      const [profileRes, personalitiesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase.from('personalities').select('*'),
      ]);

      if (profileRes.error) console.warn("Warning fetching user profile:", profileRes.error.message);
      if (personalitiesRes.error) throw personalitiesRes.error;

      const userProfile = profileRes.data;
      if (userProfile) {
        setLocalProfile(userProfile);
        setContactEmail(userProfile.contact_email || '');
        setLinkFaq(userProfile.link_faq || '');
        setLinkTerms(userProfile.link_terms || '');
        setLinkSupport(userProfile.link_support || '');
        setPersonalityPositive(userProfile.personality_positive || 'formální a vděčný');
        setPersonalityNegative(userProfile.personality_negative || 'empatický a řešící');
        setPersonalityQuestion(userProfile.personality_question || 'informativní a přesný');
        setAutoReplyEnabled(userProfile.auto_reply_enabled || false);
      }
      
      const d = personalitiesRes.data;
      setPersonalities({
        positive: d.filter(p => p.category === 'positive'),
        negative: d.filter(p => p.category === 'negative'),
        question: d.filter(p => p.category === 'question'),
        universal: d.filter(p => p.category === 'universal'),
      });

    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setLoading(false);
    }
  }, [session]); // <-- Убрали profile из зависимостей
  
  useEffect(() => {
    fetchProfileAndPersonalities();
  }, [fetchProfileAndPersonalities]);

  const saveSettings = async (websiteUrlToSave) => {
    if (!session?.user) return;
    
    uiHooks.setLoadingAction('Ukládání nastavení...');
    uiHooks.setMessage('Ukládání profilu...');
    
    const updates = {
      id: session.user.id,
      updated_at: new Date(),
      contact_email: contactEmail,
      link_faq: linkFaq,
      link_terms: linkTerms,
      link_support: linkSupport,
      personality_positive: personalityPositive,
      personality_negative: personalityNegative,
      personality_question: personalityQuestion,
      auto_reply_enabled: autoReplyEnabled,
      website_url: websiteUrlToSave,
    };
    
    const { error } = await supabase.from('profiles').upsert(updates);
    
    uiHooks.setMessage(error ? `Chyba při ukládání: ${error.message}` : 'Nastavení úspěšně uložena!');
    uiHooks.setLoadingAction('');
  };

  const handleFacebookDisconnect = async () => {
      if (!session?.user || !window.confirm("Opravdu chcete odpojit svůj účet Facebook?")) return;
      
      uiHooks.setLoadingAction('Odpojování...');
      uiHooks.setMessage('Mažu token...');

      const { error } = await supabase
          .from('profiles')
          .update({ facebook_token: null, updated_at: new Date() })
          .eq('id', session.user.id);

      if (error) {
          uiHooks.setMessage(`Chyba: ${error.message}`);
      } else {
          uiHooks.setMessage('Účet Facebook byl odpojen.');
          window.location.reload();
      }
      uiHooks.setLoadingAction('');
  };

  return {
    loading,
    profile: localProfile,
    contactEmail, setContactEmail,
    linkFaq, setLinkFaq,
    linkTerms, setLinkTerms,
    linkSupport, setLinkSupport,
    personalities,
    personalityPositive, setPersonalityPositive,
    personalityNegative, setPersonalityNegative,
    personalityQuestion, setPersonalityQuestion,
    autoReplyEnabled, setAutoReplyEnabled,
    saveSettings,
    handleFacebookDisconnect
  };
};