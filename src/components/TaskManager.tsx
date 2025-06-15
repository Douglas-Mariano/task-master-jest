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
    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id: typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Estatísticas - só renderiza após hidratação */}
      {isClient && <TaskStats tasks={tasks} />}
      
      {/* Botão para adicionar nova tarefa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

      {/* Lista de tarefas - só renderiza após hidratação */}
      {isClient ? (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleTaskComplete}
          onDelete={deleteTask}
          onEdit={handleEditTask}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500">
            Carregando tarefas...
          </div>
        </div>
      )}

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
  );
};

export default TaskManager;
