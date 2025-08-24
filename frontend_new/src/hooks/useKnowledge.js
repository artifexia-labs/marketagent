// src/hooks/useKnowledge.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useKnowledge = (session, uiHooks) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [userProvidedInfo, setUserProvidedInfo] = useState('');
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);

  useEffect(() => {
    if (!session) return;
    
    const getInitialKnowledge = async () => {
        const [knowledgeRes, filesRes] = await Promise.all([
            supabase.from('knowledge_base').select('*').eq('id', 1).single(),
            supabase.storage.from('knowledge_files').list()
        ]);
        if (knowledgeRes.data) setUserProvidedInfo(knowledgeRes.data.user_provided_info || '');
        if (filesRes.data) setKnowledgeFiles(filesRes.data);
    };
    getInitialKnowledge();
  }, [session]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    uiHooks.setIsLoading(true);
    uiHooks.setMessage(`Nahrávám soubor ${file.name}...`);
    try {
        const { error } = await supabase.storage.from('knowledge_files').upload(file.name, file, { upsert: true });
        if (error) throw error;
        uiHooks.setMessage(`Soubor ${file.name} nahrán. Spouštím zpracování...`);
        const { data: filesData } = await supabase.storage.from('knowledge_files').list();
        if (filesData) setKnowledgeFiles(filesData);
    } catch (error) {
        uiHooks.setMessage(`Chyba při nahrávání souboru: ${error.message}`);
    } finally {
        uiHooks.setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    uiHooks.setLoadingAction('Generování svodky...');
    uiHooks.setMessage('Ukládám informace a analyzuji web...');
    await supabase.from('knowledge_base').upsert({ id: 1, user_provided_info: userProvidedInfo });
    const { data: summaryData, error: summaryError } = await supabase.functions.invoke('summarize-website', {
      body: { siteUrl: websiteUrl }
    });
    if (summaryError) {
        uiHooks.setMessage(`Chyba při analýze webu: ${summaryError.message}`);
        uiHooks.setLoadingAction('');
        return;
    }
    const combinedSummary = `Svodka z webu: ${summaryData.summary}\n\nDalší informace: ${userProvidedInfo}`;
    await supabase.from('knowledge_base').upsert({ id: 1, website_summary: summaryData.summary, brand_voice_summary: combinedSummary });
    uiHooks.setMessage('Báze znalostí úspěšně aktualizována!');
    uiHooks.setLoadingAction('');
  };

  const handleCreatePersonality = async () => {
      uiHooks.setLoadingAction('Vytváření osobnosti...');
      uiHooks.setMessage('Vytvářím novou AI osobnost na základě webu...');
      const { data: knowledge } = await supabase.from('knowledge_base').select('website_summary').eq('id', 1).single();
      if (!knowledge?.website_summary) {
          uiHooks.setMessage('Nejprve uložte a vygenerujte svodku v Bázi znalostí.');
          uiHooks.setLoadingAction('');
          return;
      }
      try {
          const { data, error } = await supabase.functions.invoke('create-ai-personality', {
              body: { websiteSummary: knowledge.website_summary }
          });
          if (error || data.error) throw new Error(error?.message || data.error);
          uiHooks.setMessage(`Nová osobnost "${data.newPersonality.display_name_cz}" byla úspěšně vytvořena!`);
          // Note: This won't automatically update the settings hook's personalities state.
          // A more advanced state manager (like Redux or Zustand) would handle this cross-hook update.
          // For now, a page refresh after creation would show the new personality.
      } catch (error) {
          uiHooks.setMessage(`Chyba při vytváření osobnosti: ${error.message}`);
      } finally {
          uiHooks.setLoadingAction('');
      }
  };

  return {
    websiteUrl, setWebsiteUrl,
    userProvidedInfo, setUserProvidedInfo,
    knowledgeFiles,
    handleFileUpload,
    handleGenerateSummary,
    handleCreatePersonality,
  };
};