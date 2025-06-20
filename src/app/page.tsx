'use client';

import React from 'react';
import TaskManager from '@/components/TaskManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Lista de Tarefas
          </h1>
        </div>
        <TaskManager />
      </div>
    </div>
  );
}
