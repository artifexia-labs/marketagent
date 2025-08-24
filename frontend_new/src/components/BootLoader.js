// src/components/BootLoader.js
import React, { useState, useEffect } from 'react';

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

  // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
  // Я переписал эту часть, чтобы она была более стабильной.
  // Вместо того чтобы менять внешнюю переменную, мы передаём
  // нужный индекс прямо в функцию. Это решает проблему.
  useEffect(() => {
    const processLine = (index) => {
      // Проверяем, что мы не вышли за пределы массива
      if (index < bootSequence.length) {
        const currentEntry = bootSequence[index];
        setTimeout(() => {
          // Добавляем новую строку и вызываем функцию для следующей
          setLines(prev => [...prev, currentEntry.text]);
          processLine(index + 1);
        }, currentEntry.delay);
      } else {
        // Если все строки показаны, завершаем загрузку
        setTimeout(onBootComplete, 500);
      }
    };

    // Начинаем процесс с самого первого элемента (индекс 0)
    processLine(0);
  }, [onBootComplete]);
  // --- КОНЕЦ ИСПРАВЛЕНИЯ ---


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