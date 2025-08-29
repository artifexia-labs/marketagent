// src/hooks/useAnalytics.js
import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useAnalytics = (session, profile, uiApi) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [influenceIndex, setInfluenceIndex] = useState([]);

  const fetchAnalyticsData = useCallback(async () => {
    // Не запускаем, если нет сессии или профиля с токеном
    if (!session || !profile?.facebook_token) return;

    uiApi.setIsLoading(true);
    uiApi.setMessage("Načítání analytických dat...");
    try {
        const { data, error } = await supabase.from('comment_analytics').select('*, posts(reactions_total)').order('created_at', { ascending: false });
        if (error) throw error;
        setAnalyticsData(data);
        uiApi.setMessage(`Analytická data pro ${data.length} komentářů načtena.`);
    } catch (error) {
        uiApi.setMessage(`Chyba při načítání analytiky: ${error.message}`);
    } finally {
        uiApi.setIsLoading(false);
    }
  }, [session, profile, uiApi]);

  const fetchInfluenceIndex = useCallback(async () => {
    // Не запускаем, если нет сессии или профиля с токеном
    if (!session || !profile?.facebook_token) return;

    uiApi.setIsLoading(true);
    uiApi.setMessage("Výpočet indexu vlivu...");
    try {
      const { data, error } = await supabase.functions.invoke('calculate-influence-index');
      if (error || data.error) throw new Error(error?.message || data.error);
      setInfluenceIndex(data || []);
    } catch (error) {
      uiApi.setMessage(`Chyba při výpočtu indexu vlivu: ${error.message}`);
    } finally {
        uiApi.setIsLoading(false);
    }
  }, [session, profile, uiApi]);

  return {
    analyticsData,
    influenceIndex,
    fetchAnalyticsData,
    fetchInfluenceIndex,
  };
};