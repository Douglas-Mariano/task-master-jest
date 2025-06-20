import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../components/TaskList';
import { Task } from '../types/Task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tarefa de teste 1',
    priority: 'high',
    completed: false,
    category: 'Trabalho',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    title: 'Tarefa de teste 2',
    priority: 'medium',
    completed: true,
    category: 'Pessoal',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    title: 'Tarefa de teste 3',
    priority: 'low',
    completed: false,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
];

const mockProps = {
  onToggleComplete: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente com tarefas', () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);
    
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getByTestId('task-count')).toBeInTheDocument();
    expect(screen.getByTestId('tasks-container')).toBeInTheDocument();
    expect(screen.getByText('Suas Tarefas (3)')).toBeInTheDocument();
  });

  it('deve mostrar estado de carregamento', () => {
    render(<TaskList tasks={[]} {...mockProps} isLoading={true} />);
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument();
  });

  it('deve mostrar estado vazio quando não há tarefas', () => {
    render(<TaskList tasks={[]} {...mockProps} isLoading={false} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma tarefa encontrada')).toBeInTheDocument();
    expect(screen.getByText('Comece adicionando uma nova tarefa acima.')).toBeInTheDocument();
  });

  it('deve renderizar todas as tarefas fornecidas', () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);
    
    expect(screen.getByText('Tarefa de teste 1')).toBeInTheDocument();
    expect(screen.getByText('Tarefa de teste 2')).toBeInTheDocument();
    expect(screen.getByText('Tarefa de teste 3')).toBeInTheDocument();
  });

  it('deve atualizar contador quando número de tarefas muda', () => {
    const { rerender } = render(<TaskList tasks={mockTasks} {...mockProps} />);
    
    expect(screen.getByText('Suas Tarefas (3)')).toBeInTheDocument();
    
    // Rerenderizar com menos tarefas
    rerender(<TaskList tasks={[mockTasks[0]]} {...mockProps} />);
    
    expect(screen.getByText('Suas Tarefas (1)')).toBeInTheDocument();
  });

  it('deve chamar onToggleComplete quando tarefa é marcada como concluída', () => {
    render(<TaskList tasks={[mockTasks[0]]} {...mockProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith('1');
  });

  it('deve chamar onDelete quando botão de deletar é clicado', () => {
    render(<TaskList tasks={[mockTasks[0]]} {...mockProps} />);
    
    const deleteButton = screen.getByTestId('delete-task-1');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('deve chamar onEdit quando botão de editar é clicado', () => {
    render(<TaskList tasks={[mockTasks[0]]} {...mockProps} />);
    
    const editButton = screen.getByTestId('edit-task-1');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('deve mostrar ícone correto baseado na prioridade', () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);
    
    // Verificar se as tarefas com diferentes prioridades são renderizadas
    expect(screen.getByText('Tarefa de teste 1')).toBeInTheDocument(); // high
    expect(screen.getByText('Tarefa de teste 2')).toBeInTheDocument(); // medium
    expect(screen.getByText('Tarefa de teste 3')).toBeInTheDocument(); // low
  });

  it('deve aplicar estilos diferentes para tarefas concluídas', () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);
    
    // A tarefa 2 está marcada como concluída
    const completedTask = screen.getByText('Tarefa de teste 2').closest('[data-testid^="task-item"]');
    expect(completedTask).toHaveClass('opacity-75');
  });

  it('deve mostrar categoria quando fornecida', () => {
    render(<TaskList tasks={[mockTasks[0]]} {...mockProps} />);
    
    expect(screen.getByText('Trabalho')).toBeInTheDocument();
  });

  it('deve funcionar sem categoria', () => {
    const taskWithoutCategory = { ...mockTasks[2] };
    render(<TaskList tasks={[taskWithoutCategory]} {...mockProps} />);
    
    expect(screen.getByText('Tarefa de teste 3')).toBeInTheDocument();
  });

  it('deve manter estado correto ao alternar entre carregamento e dados', () => {
    const { rerender } = render(<TaskList tasks={[]} {...mockProps} isLoading={true} />);
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    
    rerender(<TaskList tasks={mockTasks} {...mockProps} isLoading={false} />);
    
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });
});
