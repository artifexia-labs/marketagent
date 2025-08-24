// src/components/SettingsPanel.js
import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { SettingsIcon, KnowledgeIcon, LoaderIcon, LinkIcon, FileIcon } from './Icons';

const SettingsPanel = () => {
  const { settings, knowledge, ui } = useData();
  const {
    token, setToken, personalities, personalityPositive, setPersonalityPositive,
    personalityNegative, setPersonalityNegative, personalityQuestion, setPersonalityQuestion,
    autoReplyEnabled, setAutoReplyEnabled,
    contactEmail, setContactEmail, linkFaq, setLinkFaq, linkTerms, setLinkTerms, linkSupport, setLinkSupport,
    saveSettings
  } = settings;
  const {
    websiteUrl, setWebsiteUrl, userProvidedInfo, setUserProvidedInfo, knowledgeFiles,
    handleGenerateSummary, handleCreatePersonality, handleFileUpload
  } = knowledge;
  const { isLoading, loadingAction } = ui;
  const fileInputRef = useRef(null);

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
    <div className="panel settings-panel">
      <div className="panel-content">
        <div className="panel-header">
          <h2><SettingsIcon /> SYSTEM SETTINGS</h2>
        </div>
        <div className="panel-body">
          <details open>
              <summary>RESPONSE STRATEGY</summary>
              <div className="settings-group">
                <ToggleSwitch
                  label="AUTOMATED AI RESPONSE"
                  enabled={autoReplyEnabled}
                  onChange={setAutoReplyEnabled}
                />
              </div>
              <div className="settings-group">
                <label>Facebook Page Token</label>
                <input type="password" placeholder="Insert Token..." value={token} onChange={(e) => setToken(e.target.value)} />
              </div>
              <div className="settings-group">
                <label>On <strong>POSITIVE</strong> comments:</label>
                <select value={personalityPositive} onChange={(e) => setPersonalityPositive(e.target.value)}>
                  {personalities.positive.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  {personalities.universal.length > 0 && <optgroup label="Universal (AI)">
                    {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  </optgroup>}
                </select>
              </div>
              <div className="settings-group">
                <label>On <strong>NEGATIVE</strong> comments:</label>
                <select value={personalityNegative} onChange={(e) => setPersonalityNegative(e.target.value)}>
                  {personalities.negative.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  {personalities.universal.length > 0 && <optgroup label="Universal (AI)">
                    {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  </optgroup>}
                </select>
              </div>
              <div className="settings-group">
                <label>On <strong>QUESTIONS</strong>:</label>
                <select value={personalityQuestion} onChange={(e) => setPersonalityQuestion(e.target.value)}>
                  {personalities.question.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  {personalities.universal.length > 0 && <optgroup label="Universal (AI)">
                    {personalities.universal.map(p => <option key={p.id} value={p.name}>{p.display_name_cz}</option>)}
                  </optgroup>}
                </select>
              </div>
          </details>

          <details>
              <summary><LinkIcon/> LINKS & CONTACTS</summary>
              <div className="settings-group">
                <label>Contact Email for Escalation</label>
                <input type="email" placeholder="support@corporation.net" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
               <div className="settings-group">
                <label>Link to FAQ</label>
                <input type="url" placeholder="https://your-domain.com/faq" value={linkFaq} onChange={(e) => setLinkFaq(e.target.value)} />
              </div>
               <div className="settings-group">
                <label>Link to Terms of Service</label>
                <input type="url" placeholder="https://your-domain.com/terms" value={linkTerms} onChange={(e) => setLinkTerms(e.target.value)} />
              </div>
               <div className="settings-group">
                <label>Link to Customer Support</label>
                <input type="url" placeholder="https://your-domain.com/support" value={linkSupport} onChange={(e) => setLinkSupport(e.target.value)} />
              </div>
          </details>

          <details>
              <summary><KnowledgeIcon/> KNOWLEDGE BASE</summary>
              <div className="settings-group">
                  <label>Website URL for Analysis</label>
                  <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://your-domain.com"/>
              </div>
              <div className="settings-group">
                  <label>Key Brand Information (Manual)</label>
                  <textarea value={userProvidedInfo} onChange={(e) => setUserProvidedInfo(e.target.value)} rows={4} placeholder="We are a cybernetics corporation..."></textarea>
              </div>
              <button onClick={handleGenerateSummary} disabled={isLoading} className="button-secondary">
                  {isLoading && loadingAction.includes('svodky') ? <LoaderIcon /> : 'GENERATE SUMMARY FROM WEB/TEXT'}
              </button>
              <button onClick={handleCreatePersonality} disabled={isLoading} className="button-secondary" style={{marginTop: '10px'}}>
                  {isLoading && loadingAction.includes('osobnosti') ? <LoaderIcon /> : 'CREATE PERSONALITY (AI)'}
              </button>
              <div className="knowledge-files-section">
                  <h4>Knowledge Files</h4>
                  <p>Upload files (PDF, DOCX, TXT) for the AI to learn from.</p>
                  <input type="file" ref={fileInputRef} onChange={onFileSelect} style={{ display: 'none' }} accept=".pdf,.docx,.txt"/>
                  <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className="button-secondary">
                      <FileIcon /> UPLOAD FILE
                  </button>
                   <ul className="files-list">
                      {knowledgeFiles.map(file => <li key={file.id}>{file.name}</li>)}
                  </ul>
              </div>
          </details>

          <div className="settings-footer">
              <button onClick={saveSettings} disabled={isLoading} className="button-primary">
                {isLoading && loadingAction.includes('nastavení') ? <LoaderIcon /> : 'COMMIT ALL CHANGES'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;