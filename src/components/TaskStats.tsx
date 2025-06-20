'use client';

import React from 'react';
import { Task } from '@/types/Task';

interface TaskStatsProps {
  tasks: Task[];
  isLoading?: boolean;
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks, isLoading = false }) => {
  // Se está carregando, mostra dados vazios/loading
  const totalTasks = isLoading ? 0 : tasks.length;
  const completedTasks = isLoading ? 0 : tasks.filter(task => task.completed).length;
  const pendingTasks = isLoading ? 0 : totalTasks - completedTasks;
  const completionRate = isLoading ? 0 : (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  const highPriorityTasks = isLoading ? 0 : tasks.filter(task => task.priority === 'high' && !task.completed).length;
  const categories = isLoading ? [] : [...new Set(tasks.map(task => task.category).filter(Boolean))];

  const stats = [
    {
      label: 'Total de Tarefas',
      value: totalTasks,
      icon: '📋',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      label: 'Pendentes',
      value: pendingTasks,
      icon: '⏳',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    {
      label: 'Concluídas',
      value: completedTasks,
      icon: '✅',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    {
      label: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: '📊',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Estatísticas
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${stat.color} transition-transform hover:scale-105 ${isLoading ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Informações adicionais */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
        {highPriorityTasks > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-red-500">🔥</span>
            <span>{highPriorityTasks} tarefa{highPriorityTasks !== 1 ? 's' : ''} de alta prioridade pendente{highPriorityTasks !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {categories.length > 0 && (
          <div className="flex items-center space-x-1">
            <span>🏷️</span>
            <span>{categories.length} categoria{categories.length !== 1 ? 's' : ''}: {categories.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      {totalTasks > 0 && !isLoading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Progresso Geral</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;