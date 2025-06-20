'use client';

import React, { useState, useEffect } from 'react';
import { Task, FilterType } from '@/types/Task';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import TaskFilter from '@/components/TaskFilter';
import TaskStats from '@/components/TaskStats';
import Modal from '@/components/Modal';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Task Master
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie suas tarefas com simplicidade e eficiência
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Estatísticas */}
          <TaskStats tasks={isClient ? tasks : []} isLoading={!isClient} />
          
          {/* Botão para adicionar nova tarefa */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              Pronto para ser mais produtivo?
            </h2>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nova Tarefa</span>
            </button>
          </div>

      {/* Filtros */}
      <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

      {/* Lista de tarefas */}
      <TaskList
        tasks={isClient ? filteredTasks : []}
        onToggleComplete={toggleTaskComplete}
        onDelete={deleteTask}
        onEdit={handleEditTask}
        isLoading={!isClient}
      />

          {/* Modal para adicionar/editar tarefas */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          >
            <TaskForm
              onSubmit={handleSaveEdit}
              initialData={editingTask}
              onCancel={handleCloseModal}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
