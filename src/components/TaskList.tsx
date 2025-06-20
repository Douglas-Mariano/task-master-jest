'use client';

import React from 'react';
import { Task } from '@/types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, onEdit, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center" data-testid="loading-state">
        <div className="text-gray-400 dark:text-gray-500">
          Carregando tarefas...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center" data-testid="empty-state">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-400 dark:text-gray-500">
          Comece adicionando uma nova tarefa acima.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20" data-testid="task-list">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white" data-testid="task-count">
          Suas Tarefas ({tasks.length})
        </h2>
      </div>
      
      <div className="space-y-3" data-testid="tasks-container">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
