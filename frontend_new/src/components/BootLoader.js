// src/components/BootLoader.js
import React, { useState, useEffect, useRef } from 'react';
import './BootLoader.css';

const bootSequence = [
  { text: 'JSTX KERNEL V4.0 INITIALIZING...', delay: 100 },
  { text: 'MEMORY CHECK: 100% OK', delay: 200 },
  { text: 'LOADING AI COGNITIVE MODULES...', delay: 150 },
  { text: '  > SENTIMENT ANALYSIS CORE... LOADED', delay: 100 },
  { text: '  > INTENT RECOGNITION... LOADED', delay: 100 },
  { text: '  > PERSONALITY MATRIX... LOADED', delay: 100 },
  { text: 'CONNECTING TO SUPABASE CLUSTER...', delay: 300 },
  { text: 'CONNECTION ESTABLISHED. AUTH TOKEN VALIDATED.', delay: 200 },
  { text: 'FETCHING FACEBOOK GRAPH API DATA...', delay: 150 },
  { text: '  > POSTS... SYNCED', delay: 100 },
  { text: '  > COMMENTS... SYNCED', delay: 100 },
  { text: 'RENDERING HUD INTERFACE...', delay: 250 },
  { text: 'ALL SYSTEMS NOMINAL. WELCOME, OPERATOR.', delay: 500 },
];

const BootLoader = ({ onBootComplete }) => {
  const [lines, setLines] = useState([]);
  const [caretVisible, setCaretVisible] = useState(true);
  
  const onBootCompleteRef = useRef(onBootComplete);
  
  useEffect(() => {
    onBootCompleteRef.current = onBootComplete;
  }, [onBootComplete]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const processLine = (index) => {
      if (!isMounted || index >= bootSequence.length) {
        // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Проверяем, существует ли функция, прежде чем ее вызывать
        if(isMounted && typeof onBootCompleteRef.current === 'function') {
            timeoutId = setTimeout(() => {
              onBootCompleteRef.current();
            }, 500);
        }
        return;
      }
      
      const currentEntry = bootSequence[index];
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setLines(prev => [...prev, currentEntry.text]);
          processLine(index + 1);
        }
      }, currentEntry.delay);
    };

    processLine(0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Пустой массив зависимостей = запустить один раз

  useEffect(() => {
    const caretInterval = setInterval(() => {
      setCaretVisible(v => !v);
    }, 500);
    return () => clearInterval(caretInterval);
  }, []);

  return (
    <div className="bootloader">
      <div className="bootloader-text">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {lines.length < bootSequence.length && caretVisible && <span>_</span>}
      </div>
    </div>
  );
};

export default BootLoader;