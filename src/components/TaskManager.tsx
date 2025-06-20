'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterType } from '@/types/Task';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import TaskStats from '@/components/TaskStats';
import TaskPagination from '@/components/TaskPagination';
import Modal from '@/components/Modal';
import Dropdown from '@/components/Dropdown';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Garantir que estamos no cliente antes de acessar localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carregar tarefas do localStorage
  useEffect(() => {
    if (!isClient) return;
    
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas do localStorage:', error);
        localStorage.removeItem('tasks');
      }
    }
  }, [isClient]);

  // Salvar tarefas no localStorage
  useEffect(() => {
    if (!isClient || tasks.length === 0) return;
    
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  }, [tasks, isClient]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) return;
    
    // Gerar ID apenas no cliente
    const id = typeof window !== 'undefined' && window.crypto?.randomUUID 
      ? window.crypto.randomUUID()
      : `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    if (!isClient) return;
    
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    if (!isClient) return;
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    if (!isClient) return;
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const filteredTasks = useMemo(() => {
    if (!isClient) return [];
    
    return tasks.filter(task => {
      switch (filter) {
        case 'pending':
          return !task.completed;
        case 'completed':
          return task.completed;
        default:
          return true;
      }
    });
  }, [tasks, filter, isClient]);

  // Ordenar tarefas: não concluídas primeiro, depois por prioridade e data de criação
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
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
  }, [filteredTasks]);

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

  // Opções para o dropdown de filtro
  const filterOptions = [
    { 
      value: 'all', 
      label: 'Todas', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    },
    { 
      value: 'pending', 
      label: 'Pendentes', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    },
    { 
      value: 'completed', 
      label: 'Concluídas', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
  ];

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="task-manager">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4" data-testid="action-bar">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Dropdown
              options={filterOptions}
              value={filter}
              onChange={(value) => {
                setFilter(value as FilterType);
                setCurrentPage(1);
              }}
              label="Filtrar"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>}
              buttonClassName="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
            />

            <button
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              data-testid="stats-toggle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Estatísticas</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isStatsExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            data-testid="add-task-button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {isStatsExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden" data-testid="stats-section">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Estatísticas das Tarefas
            </h3>
            <button
              onClick={() => setIsStatsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md transition-colors"
              data-testid="stats-close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <TaskStats tasks={isClient ? tasks : []} isLoading={!isClient} />
          </div>
        </div>
      )}

      <TaskList
        tasks={currentTasks}
        onToggleComplete={toggleTaskComplete}
        onDelete={deleteTask}
        onEdit={handleEditTask}
        isLoading={!isClient}
      />

      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={sortedTasks.length}
        showAll={showAll}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onShowAll={handleShowAll}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        data-testid="task-modal"
      >
        <TaskForm
          onSubmit={handleSaveEdit}
          initialData={editingTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default TaskManager;
