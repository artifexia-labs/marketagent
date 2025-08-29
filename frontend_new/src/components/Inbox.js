// src/components/Inbox.js
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LoaderIcon, CommentsIcon } from './Icons';
import InboxItemCard from './InboxItemCard';
import './Inbox.css';

const Inbox = () => {
  const { inbox, ui } = useData();
  const { inboxItems, unansweredItems, fetchInbox, fetchUnanswered } = inbox;
  const { isLoading } = ui;

  const [activeFilter, setActiveFilter] = useState('process');

  const handleRefresh = () => {
      fetchInbox();
      fetchUnanswered();
  };

  const itemsToDisplay = activeFilter === 'process' ? inboxItems : unansweredItems;
  const emptyStateMessages = {
      process: {
          title: "QUEUE EMPTY",
          text: "AI CORE HAS PROCESSED ALL INCOMING SIGNALS."
      },
      unanswered: {
          title: "ALL TARGETS NEUTRALIZED",
          text: "NO MANUAL RESPONSE REQUIRED. STANDING BY."
      }
  };
  const currentEmptyState = emptyStateMessages[activeFilter];

  return (
    <div className="panel inbox-panel">
      {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
      <div className="panel-content">
        <div className="panel-header">
          <h2><CommentsIcon /> INBOX</h2>
          <div className="inbox-filters">
              <button
                  className={`button-secondary ${activeFilter === 'process' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('process')}>
                  AI QUEUE <span className="item-count">{inboxItems.length}</span>
              </button>
              <button
                  className={`button-secondary ${activeFilter === 'unanswered' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('unanswered')}>
                  MANUAL RESPONSE <span className="item-count">{unansweredItems.length}</span>
              </button>
          </div>
          <button onClick={handleRefresh} disabled={isLoading} className="button-primary">
            {isLoading ? <LoaderIcon /> : 'FORCE SYNC'}
          </button>
        </div>
        <div className="panel-body">
          {isLoading && itemsToDisplay.length === 0 && (
              <div className="loading-state"><LoaderIcon /> ACQUIRING TARGETS...</div>
          )}
          {!isLoading && itemsToDisplay.length === 0 && (
            <div className="empty-state inbox-zero">
              <h2>{currentEmptyState.title}</h2>
              <p>{currentEmptyState.text}</p>
            </div>
          )}
          <div className="inbox-list">
              {itemsToDisplay.map(item => (
                  <InboxItemCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      </div>
      {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
    </div>
  );
};

export default Inbox;