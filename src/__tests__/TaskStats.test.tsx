import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskStats from '../components/TaskStats';
import { Task } from '../types/Task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tarefa alta prioridade pendente',
    priority: 'high',
    completed: false,
    category: 'Trabalho',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    title: 'Tarefa média prioridade concluída',
    priority: 'medium',
    completed: true,
    category: 'Pessoal',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    title: 'Tarefa baixa prioridade pendente',
    priority: 'low',
    completed: false,
    category: 'Trabalho',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    title: 'Tarefa alta prioridade concluída',
    priority: 'high',
    completed: true,
    category: 'Estudo',
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04'),
  },
  {
    id: '5',
    title: 'Tarefa sem categoria',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
];

describe('TaskStats', () => {
  it('deve renderizar corretamente com tarefas', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    expect(screen.getByText('Total de Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('Concluídas')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Conclusão')).toBeInTheDocument();
  });

  it('deve calcular estatísticas básicas corretamente', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Total
    expect(screen.getByText('3')).toBeInTheDocument(); // Pendentes
    expect(screen.getByText('2')).toBeInTheDocument(); // Concluídas
    
    // Usar getAllByText para o 40% que aparece duas vezes
    const percentElements = screen.getAllByText('40%');
    expect(percentElements.length).toBeGreaterThan(0);
  });

  it('deve mostrar tarefas de alta prioridade pendentes', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    expect(screen.getByText(/1 tarefa de alta prioridade pendente/)).toBeInTheDocument();
  });

  it('deve mostrar múltiplas tarefas de alta prioridade pendentes', () => {
    const tasksWithMultipleHighPriority = [
      ...mockTasks,
      {
        id: '6',
        title: 'Outra tarefa alta prioridade',
        priority: 'high' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    render(<TaskStats tasks={tasksWithMultipleHighPriority} />);
    
    expect(screen.getByText(/2 tarefas de alta prioridade pendentes/)).toBeInTheDocument();
  });

  it('deve mostrar categorias únicas', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    expect(screen.getByText(/3 categorias:/)).toBeInTheDocument();
    expect(screen.getByText(/Trabalho, Pessoal, Estudo/)).toBeInTheDocument();
  });

  it('deve mostrar barra de progresso com porcentagem correta', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    const progressElement = document.querySelector('[style*="width: 40%"]');
    expect(progressElement).toBeInTheDocument();
    
    expect(screen.getByText('Progresso Geral')).toBeInTheDocument();
  });

  it('deve lidar com lista vazia de tarefas', () => {
    render(<TaskStats tasks={[]} />);
    
    const allZeros = screen.getAllByText('0');
    expect(allZeros.length).toBeGreaterThan(0); // Total, Pendentes, Concluídas
    expect(screen.getByText('0%')).toBeInTheDocument(); // Taxa
    expect(screen.queryByText(/alta prioridade pendente/)).not.toBeInTheDocument();
    expect(screen.queryByText(/categorias:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Progresso Geral')).not.toBeInTheDocument();
  });

  it('deve calcular 100% de conclusão quando todas as tarefas estão concluídas', () => {
    const completedTasks = mockTasks.map(task => ({ ...task, completed: true }));
    render(<TaskStats tasks={completedTasks} />);
    
    const percentElements = screen.getAllByText('100%');
    expect(percentElements.length).toBeGreaterThan(0);
    expect(screen.getByText('0')).toBeInTheDocument(); // Pendentes
    
    // Usar getAllByText para número 5 que aparece em múltiplos lugares
    const fiveElements = screen.getAllByText('5');
    expect(fiveElements.length).toBeGreaterThan(0); // Total e Concluídas
  });

  it('deve mostrar 0% quando nenhuma tarefa está concluída', () => {
    const pendingTasks = mockTasks.map(task => ({ ...task, completed: false }));
    render(<TaskStats tasks={pendingTasks} />);
    
    const percentElements = screen.getAllByText('0%');
    expect(percentElements.length).toBeGreaterThan(0);
    
    // Usar getAllByText para número 5 que aparece em múltiplos lugares
    const fiveElements = screen.getAllByText('5');
    expect(fiveElements.length).toBeGreaterThan(0); // Total e Pendentes
    expect(screen.getByText('0')).toBeInTheDocument(); // Concluídas
  });

  it('deve ignorar tarefas concluídas no contador de alta prioridade', () => {
    const allHighPriorityTasks = mockTasks.map(task => ({ ...task, priority: 'high' as const }));
    render(<TaskStats tasks={allHighPriorityTasks} />);
    
    // Apenas as não concluídas devem ser contadas (3 pendentes)
    expect(screen.getByText(/3 tarefas de alta prioridade pendentes/)).toBeInTheDocument();
  });

  it('deve filtrar categorias vazias/nulas', () => {
    const tasksWithEmptyCategories = [
      {
        id: '1',
        title: 'Tarefa com categoria',
        priority: 'medium' as const,
        completed: false,
        category: 'Trabalho',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Tarefa sem categoria',
        priority: 'medium' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    render(<TaskStats tasks={tasksWithEmptyCategories} />);
    
    expect(screen.getByText(/1 categoria:/)).toBeInTheDocument();
    expect(screen.getByText(/Trabalho/)).toBeInTheDocument();
  });

  it('deve mostrar ícones corretos para cada estatística', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    const statsContainer = screen.getByText('Total de Tarefas').closest('.p-4');
    expect(statsContainer).toHaveTextContent('📋');
    
    const pendingContainer = screen.getByText('Pendentes').closest('.p-4');
    expect(pendingContainer).toHaveTextContent('⏳');
    
    const completedContainer = screen.getByText('Concluídas').closest('.p-4');
    expect(completedContainer).toHaveTextContent('✅');
    
    const rateContainer = screen.getByText('Taxa de Conclusão').closest('.p-4');
    expect(rateContainer).toHaveTextContent('📊');
  });

  it('deve aplicar hover effects nos cards', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    const totalCard = screen.getByText('Total de Tarefas').closest('.p-4');
    expect(totalCard).toHaveClass('hover:scale-105');
  });

  it('deve mostrar cores corretas para diferentes estatísticas', () => {
    render(<TaskStats tasks={mockTasks} />);
    
    const totalCard = screen.getByText('Total de Tarefas').closest('.p-4');
    expect(totalCard).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200');
    
    const pendingCard = screen.getByText('Pendentes').closest('.p-4');
    expect(pendingCard).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
    
    const completedCard = screen.getByText('Concluídas').closest('.p-4');
    expect(completedCard).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
    
    const rateCard = screen.getByText('Taxa de Conclusão').closest('.p-4');
    expect(rateCard).toHaveClass('bg-purple-100', 'text-purple-800', 'border-purple-200');
  });
});
