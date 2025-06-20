'use client';

import React, { useState, useMemo } from 'react';
import { Task } from '@/types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, onEdit, isLoading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Ordenar tarefas: não concluídas primeiro, depois por prioridade e data de criação
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Primeiro, tarefas não concluídas
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Depois por prioridade (alta > média > baixa)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Por último, por data de criação (mais recente primeiro)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks]);

  // Calcular paginação
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = showAll ? sortedTasks : sortedTasks.slice(startIndex, endIndex);

  // Reset da página quando mudar o número de itens por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500">
          Carregando tarefas...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
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
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Suas Tarefas ({tasks.length})
        </h2>
      </div>
      
      {/* Lista de tarefas */}
      <div className="space-y-3">
        {currentTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Controles de paginação */}
      {tasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Seletor de itens por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrar:
              </span>
              <div className="flex gap-1">
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleItemsPerPageChange(option)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      itemsPerPage === option && !showAll
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={handleShowAll}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    showAll
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
              </div>
            </div>

            {/* Informações de paginação */}
            {!showAll && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {startIndex + 1}-{Math.min(endIndex, tasks.length)} de {tasks.length}
                </span>
                
                {/* Botões de navegação */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ««
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  
                  {/* Páginas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    »»
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
