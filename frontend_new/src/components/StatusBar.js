import React from 'react';
import { useData } from '../context/DataContext'; // Используем хук
import { LoaderIcon } from './Icons';

const StatusBar = () => {
  const { ui } = useData(); // Получаем данные из контекста
  const { isLoading, message } = ui;

  return (
    <footer className="status-bar">
      {isLoading && <LoaderIcon />}
      <p>{message}</p>
    </footer>
  );
};

export default StatusBar;
