import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useData } from '../context/DataContext';
import { LoaderIcon, KnowledgeIcon } from './Icons';

// Иконки для файлов
const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

const sanitizeFileName = (filename) => {
    const parts = filename.split('.');
    const extension = parts.pop();
    const name = parts.join('.');
    const sanitizedName = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9-._]/g, '').replace(/_{2,}/g, '_').replace(/-{2,}/g, '-');
    return `${sanitizedName}.${extension}`;
};

const FileUpload = () => {
    const { ui } = useData();
    const { setMessage } = ui;
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const listFiles = useCallback(async () => {
        const { data, error } = await supabase.storage.from('knowledge_files').list();
        if (error) {
            setMessage(`Chyba při načítání souborů: ${error.message}`);
        } else {
            setFiles(data);
        }
    }, [setMessage]);

    useEffect(() => {
        listFiles();
    }, [listFiles]);

    // ... (handleDrag, handleDrop, handleChange, handleFileUpload, handleDeleteFile остаются без изменений)
    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); };
    const handleDrop = async (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files); };
    const handleChange = (e) => { e.preventDefault(); if (e.target.files?.[0]) handleFileUpload(e.target.files); };
    const handleFileUpload = async (selectedFiles) => {
        setUploading(true);
        setMessage('Nahrávám soubor...');
        const file = selectedFiles[0];
        const safeFileName = sanitizeFileName(file.name);
        const { error } = await supabase.storage.from('knowledge_files').upload(safeFileName, file, { cacheControl: '3600', upsert: true });
        setUploading(false);
        if (error) {
            setMessage(`Chyba při nahrávání: ${error.message}`);
        } else {
            setMessage(`Soubor ${safeFileName} byl úspěšně nahrán!`);
            listFiles();
        }
    };
    const handleDeleteFile = async (fileName) => {
        const { error } = await supabase.storage.from('knowledge_files').remove([fileName]);
        if (error) {
            setMessage(`Chyba při mazání souboru: ${error.message}`);
        } else {
            setMessage(`Soubor ${fileName} byl smazán.`);
            listFiles();
        }
    };
    
    // --- НОВАЯ ТЕСТОВАЯ ФУНКЦИЯ ---
    const handleTestConnection = async () => {
        setMessage('Testuji připojení k úložišti...');
        const { data, error } = await supabase.storage.from('knowledge_files').list();
        if (error) {
            setMessage(`TEST SELHAL: ${error.message}`);
            console.error("Test connection error:", error);
        } else {
            setMessage(`TEST ÚSPĚŠNÝ: Nalezeno ${data.length} souborů.`);
            console.log("Test connection success, files found:", data);
        }
    };

    return (
        <div className="settings-section">
            <h3 className="settings-header"><KnowledgeIcon /> Znalostní Soubory</h3>
            
            {/* --- НОВАЯ КНОПКА --- */}
            <button onClick={handleTestConnection} className="button-secondary" style={{marginBottom: '16px'}}>Test Connection</button>

            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input type="file" id="input-file-upload" multiple={false} onChange={handleChange} accept=".pdf,.txt,.docx" />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                    <div>
                        <p>Přetáhněte soubory sem nebo klikněte pro výběr</p>
                        <p className="upload-hint">Podporované formáty: PDF, TXT, DOCX</p>
                        {uploading && <LoaderIcon />}
                    </div> 
                </label>
                {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </form>

            <div className="file-list">
                {files.length > 0 ? (
                    files.map(file => (
                        <div key={file.id} className="file-item">
                            <FileIcon />
                            <span className="file-name">{file.name}</span>
                            <button className="delete-button" onClick={() => handleDeleteFile(file.name)}>
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="empty-list-hint">Zatím nebyly nahrány žádné soubory.</p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
