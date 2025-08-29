// src/pages/SettingsPage.js
import React, { useRef } from 'react'; // <-- Убрали useState и useEffect
import { useData } from '../context/DataContext';
import { SettingsIcon, KnowledgeIcon, LoaderIcon, LinkIcon, FileIcon } from '../components/Icons';
import './SettingsPage.css';
import { supabase } from '../supabaseClient';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>;


const SettingsPage = () => {
  const { settings, knowledge, ui } = useData();
  const {
    profile,
    personalities, personalityPositive, setPersonalityPositive,
    personalityNegative, setPersonalityNegative, personalityQuestion, setPersonalityQuestion,
    autoReplyEnabled, setAutoReplyEnabled,
    contactEmail, setContactEmail, linkFaq, setLinkFaq, linkTerms, setLinkTerms, linkSupport, setLinkSupport,
    saveSettings, handleFacebookDisconnect
  } = settings;
  const {
    websiteUrl, setWebsiteUrl, userProvidedInfo, setUserProvidedInfo, knowledgeFiles,
    handleGenerateSummary, handleCreatePersonality, handleFileUpload, handleFileDelete
  } = knowledge;
  const { isLoading, loadingAction, setMessage } = ui;
  const fileInputRef = useRef(null);

  const handleFacebookLogin = async () => {
      setMessage("Přihlašování k Facebooku...");
      const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
              scopes: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
              redirectTo: window.location.href,
          },
      });

      if (error) {
          setMessage(`Chyba při přihlášení: ${error.message}`);
      }
  };
  
  // --- ГЛАВНЫЙ ФИКС: МЫ УДАЛИЛИ ОТСЮДА useEffect С onAuthStateChange ---
  // Эта логика теперь централизована в App.js

  const onFileSelect = () => {
      const file = fileInputRef.current.files[0];
      if (file) handleFileUpload(file);
  }

  const ToggleSwitch = ({ label, enabled, onChange }) => (
    <div className="toggle-switch-container">
      <label className="toggle-switch-label">{label}</label>
      <label className="toggle-switch">
        <input type="checkbox" checked={enabled} onChange={e => onChange(e.target.checked)} />
        <span className="slider round"></span>
      </label>
    </div>
  );

  return (
    <div className="page-layout">
        <div className="panel settings-panel">
            <div className="panel-header">
                <h2><SettingsIcon /> Nastavení Systému</h2>
            </div>
            <div className="panel-body">
                <div className="settings-section">
                    <h3 className="settings-section-header">STRATEGIE ODPOVĚDÍ</h3>
                    
                    <div className="settings-group">
                        <label>Propojení s Facebookem</label>
                        {profile?.facebook_token ? (
                            <div className='facebook-status connected'>
                                <span><FacebookIcon /> Účet je připojen</span>
                                <button onClick={handleFacebookDisconnect} disabled={isLoading} className="button-secondary danger">Odpojit</button>
                            </div>
                        ) : (
                            <div className='facebook-status'>
                                <span><FacebookIcon /> Účet není připojen</span>
                                <button onClick={handleFacebookLogin} disabled={isLoading} className="button-primary">Propojit s Facebookem</button>
                            </div>
                        )}
                    </div>

                    <div className="settings-group">
                        <ToggleSwitch
                        label="AUTOMATICKÁ AI ODPOVĚĎ"
                        enabled={autoReplyEnabled}
                        onChange={setAutoReplyEnabled}
                        />
                    </div>
                    <div className="settings-group">
                        <label>Na <strong>POZITIVNÍ</strong> komentáře:</label>
                        <select value={personalityPositive} onChange={(e) => setPersonalityPositive(e.target.value)}>
                        {personalities.positive.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        {personalities.universal.length > 0 && <optgroup label="Univerzální (AI)">
                            {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        </optgroup>}
                        </select>
                    </div>
                    <div className="settings-group">
                        <label>Na <strong>NEGATIVNÍ</strong> komentáře:</label>
                        <select value={personalityNegative} onChange={(e) => setPersonalityNegative(e.target.value)}>
                        {personalities.negative.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        {personalities.universal.length > 0 && <optgroup label="Univerzální (AI)">
                            {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        </optgroup>}
                        </select>
                    </div>
                    <div className="settings-group">
                        <label>Na <strong>DOTAZY</strong>:</label>
                        <select value={personalityQuestion} onChange={(e) => setPersonalityQuestion(e.target.value)}>
                        {personalities.question.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        {personalities.universal.length > 0 && <optgroup label="Univerzální (AI)">
                            {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                        </optgroup>}
                        </select>
                    </div>
                </div>

                <div className="settings-section">
                    <h3 className="settings-section-header"><LinkIcon/> ODKAZY A KONTAKTY</h3>
                    <div className="settings-group">
                        <label>Kontaktní Email pro Eskalaci</label>
                        <input type="email" placeholder="podpora@firma.cz" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                    </div>
                    <div className="settings-group">
                        <label>Odkaz na FAQ</label>
                        <input type="url" placeholder="https://vase-domena.cz/faq" value={linkFaq} onChange={(e) => setLinkFaq(e.target.value)} />
                    </div>
                    <div className="settings-group">
                        <label>Odkaz na Obchodní Podmínky</label>
                        <input type="url" placeholder="https://vase-domena.cz/podminky" value={linkTerms} onChange={(e) => setLinkTerms(e.target.value)} />
                    </div>
                    <div className="settings-group">
                        <label>Odkaz na Zákaznickou Podporu</label>
                        <input type="url" placeholder="https://vase-domena.cz/podpora" value={linkSupport} onChange={(e) => setLinkSupport(e.target.value)} />
                    </div>
                </div>

                <div className="settings-section">
                    <h3 className="settings-section-header"><KnowledgeIcon/> BÁZE ZNALOSTÍ</h3>
                    <div className="settings-group">
                        <label>URL Webu pro Analýzu</label>
                        <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://vase-domena.cz"/>
                    </div>
                    <div className="settings-group">
                        <label>Klíčové Informace o Značce (Manuálně)</label>
                        <textarea value={userProvidedInfo} onChange={(e) => setUserProvidedInfo(e.target.value)} rows={4} placeholder="Jsme firma zabývající se kybernetikou..."></textarea>
                    </div>
                    <div className="button-group">
                        <button onClick={handleGenerateSummary} disabled={isLoading} className="button-secondary">
                            {isLoading && loadingAction.includes('svodky') ? <LoaderIcon /> : 'GENEROVAT SHRNUTÍ'}
                        </button>
                        <button onClick={handleCreatePersonality} disabled={isLoading} className="button-secondary">
                            {isLoading && loadingAction.includes('osobnosti') ? <LoaderIcon /> : 'VYTVOŘIT OSOBNOST (AI)'}
                        </button>
                    </div>
                    <div className="knowledge-files-section">
                        <h4>Znalostní Soubory</h4>
                        <p>Nahrajte soubory (PDF, DOCX, TXT), ze kterých se AI bude učit.</p>
                        <input type="file" ref={fileInputRef} onChange={onFileSelect} style={{ display: 'none' }} accept=".pdf,.docx,.txt"/>
                        <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className="button-secondary">
                            <FileIcon /> NAHRÁT SOUBOR
                        </button>
                        <ul className="files-list">
                            {knowledgeFiles.map(file => (
                                <li key={file.id}>
                                    <span>{file.name}</span>
                                    <button 
                                        onClick={() => handleFileDelete(file.name)} 
                                        disabled={isLoading} 
                                        className="delete-file-btn"
                                        title="Smazat soubor"
                                    >
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="settings-footer">
                    <button onClick={() => saveSettings(websiteUrl)} disabled={isLoading} className="button-primary">
                        {isLoading && loadingAction.includes('nastavení') ? <LoaderIcon /> : 'ULOŽIT VŠECHNY ZMĚNY'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsPage;