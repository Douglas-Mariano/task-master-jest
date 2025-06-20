'use client';

import React from 'react';
import { FilterType } from '@/types/Task';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'Todas', icon: '📋' },
    { key: 'pending', label: 'Pendentes', icon: '⏳' },
    { key: 'completed', label: 'Concluídas', icon: '✅' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Filtrar Tarefas
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
              currentFilter === filter.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md hover:scale-102'
            }`}
          >
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;
