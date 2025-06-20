'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/Task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Task | null;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPriority(initialData.priority);
      setCategory(initialData.category ?? '');
    } else {
      // Limpar formulário
      setTitle('');
      setPriority('medium');
      setCategory('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        priority,
        category: category.trim() ?? undefined,
        completed: initialData?.completed || false,
      });
      
      // Limpar formulário apenas se não estivermos editando
      if (!initialData) {
        setTitle('');
        setPriority('medium');
        setCategory('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="task-form">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título da Tarefa *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da tarefa..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
          data-testid="title-input"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioridade
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            data-testid="priority-select"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoria
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Trabalho, Pessoal..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            data-testid="category-input"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            data-testid="cancel-button"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          data-testid="submit-button"
        >
          {initialData ? 'Salvar Alterações' : 'Adicionar Tarefa'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
