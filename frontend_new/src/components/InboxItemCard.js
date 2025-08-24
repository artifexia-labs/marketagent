// src/components/InboxItemCard.js
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LoaderIcon } from './Icons';

const InboxItemCard = ({ item }) => {
    const { inbox, ui, settings } = useData();
    const { handleReply } = inbox;
    const { isLoading } = ui;
    const { autoReplyEnabled } = settings;

    const [replyText, setReplyText] = useState(item.navrh_odpovedi || '');

    const onReply = () => {
        if (replyText.trim()) {
            handleReply(item.comment_id, replyText);
        }
    };
    
    // Карточка для очереди "Ke zpracování (AI)"
    if (item.status === 'new' || item.status === 'processed') {
        if (autoReplyEnabled) {
            return (
                 <div className="inbox-item-card processing">
                    <div className="item-content">
                        <p className="comment-message">"{item.message}"</p>
                    </div>
                    <div className="processing-status">
                        <LoaderIcon/> Probíhá automatické zpracování...
                    </div>
                </div>
            )
        }
        // Если автоответчик выключен, эта очередь пуста, но на всякий случай оставим заглушку
        return null; 
    }

    // Карточка для очереди "Čeká na odpověď"
    if (item.status === 'unanswered') {
        return (
            <div className="inbox-item-card">
                <div className="item-header">
                    <span className="item-author">{item.source || 'Neznámý'}</span>
                    <span className="item-date">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <div className="item-content">
                    <p className="comment-message">"{item.message}"</p>
                </div>
                <div className="item-reply-section">
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Napište odpověď..."
                        rows={3}
                        disabled={isLoading}
                    />
                    <div className="item-actions">
                        <button onClick={onReply} disabled={isLoading || !replyText} className="button-reply">
                            {isLoading ? <LoaderIcon/> : 'Odeslat odpověď'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return null; // На случай появления других статусов
};

export default InboxItemCard;