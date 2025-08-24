// src/hooks/useAnalytics.js
import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useAnalytics = (session, uiHooks) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [influenceIndex, setInfluenceIndex] = useState([]);

  const fetchAnalyticsData = useCallback(async () => {
    uiHooks.setIsLoading(true);
    uiHooks.setMessage("Načítání analytických dat...");
    const { data, error } = await supabase.from('comment_analytics').select('*, posts(reactions_total)').order('created_at', { ascending: false });
    if (error) {
      uiHooks.setMessage(`Chyba při načítání analytiky: ${error.message}`);
    } else {
      setAnalyticsData(data);
      uiHooks.setMessage(`Analytická data pro ${data.length} komentářů načtena.`);
    }
    uiHooks.setIsLoading(false);
  }, [uiHooks]);

  const fetchInfluenceIndex = useCallback(async () => {
    uiHooks.setIsLoading(true);
    uiHooks.setMessage("Výpočet indexu vlivu...");
    try {
      const { data, error } = await supabase.functions.invoke('calculate-influence-index');
      if (error || data.error) throw new Error(error?.message || data.error);
      setInfluenceIndex(data || []);
    } catch (error) {
      uiHooks.setMessage(`Chyba při výpočtu indexu vlivu: ${error.message}`);
    }
    uiHooks.setIsLoading(false);
  }, [uiHooks]);

  return {
    analyticsData,
    influenceIndex,
    fetchAnalyticsData,
    fetchInfluenceIndex,
  };
};