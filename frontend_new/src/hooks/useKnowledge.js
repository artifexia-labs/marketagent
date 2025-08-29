// src/hooks/useKnowledge.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useKnowledge = (session, profile, uiHooks) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [userProvidedInfo, setUserProvidedInfo] = useState('');
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);

  const fetchInitialKnowledge = useCallback(async () => {
    // --- ИЗМЕНЕНИЕ: Убираем проверку на facebook_token ---
    if (!session) {
        return;
    }

    const [knowledgeRes, filesRes, profileRes] = await Promise.all([
        supabase.from('knowledge_base').select('*').eq('user_id', session.user.id).single(),
        supabase.storage.from('knowledge_files').list(session.user.id),
        supabase.from('profiles').select('website_url').eq('id', session.user.id).single()
    ]);

    if (knowledgeRes.data) setUserProvidedInfo(knowledgeRes.data.user_provided_info || '');
    if (filesRes.data) setKnowledgeFiles(filesRes.data);
    if (profileRes.data) setWebsiteUrl(profileRes.data.website_url || '');

  }, [session]);


  useEffect(() => {
    fetchInitialKnowledge();
  }, [fetchInitialKnowledge]);

  const handleFileUpload = async (file) => {
    if (!file || !session) return;
    uiHooks.setIsLoading(true);
    uiHooks.setMessage(`Nahrávám soubor ${file.name}...`);
    try {
        const { error } = await supabase.storage.from('knowledge_files').upload(`${session.user.id}/${file.name}`, file, { upsert: true });
        if (error) throw error;
        uiHooks.setMessage(`Soubor ${file.name} nahrán. Spouštím zpracování...`);
        const { data: filesData } = await supabase.storage.from('knowledge_files').list(session.user.id);
        if (filesData) setKnowledgeFiles(filesData);
    } catch (error) {
        uiHooks.setMessage(`Chyba při nahrávání souboru: ${error.message}`);
    } finally {
        uiHooks.setIsLoading(false);
    }
  };

  const handleFileDelete = async (fileName) => {
      if (!session || !window.confirm(`Opravdu si přejete smazat soubor "${fileName}"?`)) {
          return;
      }
      uiHooks.setIsLoading(true);
      uiHooks.setMessage(`Mažu soubor ${fileName}...`);
      try {
          const { error: removeError } = await supabase.storage.from('knowledge_files').remove([`${session.user.id}/${fileName}`]);
          if (removeError) throw removeError;
          
          const { error: deleteError } = await supabase.from('knowledge_vectors').delete().eq('file_name', fileName).eq('user_id', session.user.id);
          if (deleteError) throw deleteError;

          uiHooks.setMessage(`Soubor ${fileName} a související znalosti byly smazány.`);
          setKnowledgeFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
      } catch (error) {
          uiHooks.setMessage(`Chyba při mazání souboru: ${error.message}`);
      } finally {
          uiHooks.setIsLoading(false);
      }
  };

  const handleGenerateSummary = async () => {
    if (!session) return;
    uiHooks.setLoadingAction('Generování svodky...');
    uiHooks.setMessage('Ukládám informace a analyzuji web...');
    
    await supabase.from('knowledge_base').upsert({ user_id: session.user.id, user_provided_info: userProvidedInfo }, { onConflict: 'user_id' });

    const { data: summaryData, error: summaryError } = await supabase.functions.invoke('summarize-website', {
      body: { siteUrl: websiteUrl }
    });
    if (summaryError) {
        uiHooks.setMessage(`Chyba při analýze webu: ${summaryError.message}`);
        uiHooks.setLoadingAction('');
        return;
    }
    const combinedSummary = `Svodka z webu: ${summaryData.summary}\n\nDalší informace: ${userProvidedInfo}`;
    await supabase.from('knowledge_base').upsert({ user_id: session.user.id, website_summary: summaryData.summary, brand_voice_summary: combinedSummary }, { onConflict: 'user_id' });
    uiHooks.setMessage('Báze znalostí úspěšně aktualizována!');
    uiHooks.setLoadingAction('');
  };

  const handleCreatePersonality = async () => {
      if (!session) return;
      uiHooks.setLoadingAction('Vytváření osobnosti...');
      uiHooks.setMessage('Vytvářím novou AI osobnost na základě webu...');
      const { data: knowledge } = await supabase.from('knowledge_base').select('website_summary').eq('user_id', session.user.id).single();
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
    handleFileDelete,
    handleGenerateSummary,
    handleCreatePersonality,
  };
};