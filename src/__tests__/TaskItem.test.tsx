import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '@/components/TaskItem';
import { Task } from '@/types/Task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2024-01-01T10:00:00'),
  updatedAt: new Date('2024-01-01T10:00:00'),
  priority: 'medium',
  category: 'Work',
};

const mockTaskCompleted: Task = {
  ...mockTask,
  id: '2',
  title: 'Completed Task',
  completed: true,
};

const mockTaskHighPriority: Task = {
  ...mockTask,
  id: '3',
  title: 'High Priority Task',
  priority: 'high',
};

const mockTaskLowPriority: Task = {
  ...mockTask,
  id: '4',
  title: 'Low Priority Task',
  priority: 'low',
};

const mockTaskWithoutCategory: Task = {
  ...mockTask,
  id: '5',
  title: 'Task without category',
  category: undefined,
};

const mockTaskWithoutDescription: Task = {
  ...mockTask,
  id: '6',
  title: 'Task without description',
  description: undefined,
};

const mockTaskUpdated: Task = {
  ...mockTask,
  id: '7',
  title: 'Updated Task',
  updatedAt: new Date('2024-01-02T15:30:00'),
};

const defaultProps = {
  onToggleComplete: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

describe('TaskItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task item correctly', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    expect(screen.getByTestId(`task-item-${mockTask.id}`)).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('renders task without description', () => {
    render(<TaskItem task={mockTaskWithoutDescription} {...defaultProps} />);
    
    expect(screen.getByText('Task without description')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders task without category', () => {
    render(<TaskItem task={mockTaskWithoutCategory} {...defaultProps} />);
    
    expect(screen.getByText('Task without category')).toBeInTheDocument();
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('displays correct priority labels and colors', () => {
    const { rerender } = render(<TaskItem task={mockTaskHighPriority} {...defaultProps} />);
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toHaveClass('bg-red-100', 'text-red-800', 'border-red-300');

    rerender(<TaskItem task={mockTask} {...defaultProps} />);
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Média')).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-300');

    rerender(<TaskItem task={mockTaskLowPriority} {...defaultProps} />);
    expect(screen.getByText('Baixa')).toBeInTheDocument();
    expect(screen.getByText('Baixa')).toHaveClass('bg-green-100', 'text-green-800', 'border-green-300');
  });

  it('shows completed task with correct styling', () => {
    render(<TaskItem task={mockTaskCompleted} {...defaultProps} />);
    
    const titleElement = screen.getByText('Completed Task');
    expect(titleElement).toHaveClass('line-through', 'text-gray-500');
    
    const taskItem = screen.getByTestId(`task-item-${mockTaskCompleted.id}`);
    expect(taskItem).toHaveClass('border-green-500', 'opacity-75');
  });

  it('shows uncompleted task with correct styling based on priority', () => {
    const { rerender } = render(<TaskItem task={mockTaskHighPriority} {...defaultProps} />);
    expect(screen.getByTestId(`task-item-${mockTaskHighPriority.id}`)).toHaveClass('border-red-500');

    rerender(<TaskItem task={mockTask} {...defaultProps} />);
    expect(screen.getByTestId(`task-item-${mockTask.id}`)).toHaveClass('border-yellow-500');

    rerender(<TaskItem task={mockTaskLowPriority} {...defaultProps} />);
    expect(screen.getByTestId(`task-item-${mockTaskLowPriority.id}`)).toHaveClass('border-green-500');
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(defaultProps.onToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('shows checkbox as checked for completed tasks', () => {
    render(<TaskItem task={mockTaskCompleted} {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const editButton = screen.getByTestId(`edit-task-${mockTask.id}`);
    fireEvent.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const deleteButton = screen.getByTestId(`delete-task-${mockTask.id}`);
    fireEvent.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('displays formatted creation date', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    expect(screen.getByText(/Criado em: 01\/01\/2024/)).toBeInTheDocument();
  });

  it('displays updated date when task was modified', () => {
    render(<TaskItem task={mockTaskUpdated} {...defaultProps} />);
    
    expect(screen.getByText(/Criado em: 01\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Atualizado em: 02\/01\/2024/)).toBeInTheDocument();
  });

  it('does not display updated date when task was not modified', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    expect(screen.getByText(/Criado em: 01\/01\/2024/)).toBeInTheDocument();
    expect(screen.queryByText(/Atualizado em:/)).not.toBeInTheDocument();
  });

  it('displays edit and delete buttons with correct titles', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const editButton = screen.getByTestId(`edit-task-${mockTask.id}`);
    const deleteButton = screen.getByTestId(`delete-task-${mockTask.id}`);
    
    expect(editButton).toHaveAttribute('title', 'Editar tarefa');
    expect(deleteButton).toHaveAttribute('title', 'Excluir tarefa');
  });

  it('renders SVG icons for edit and delete buttons', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const editButton = screen.getByTestId(`edit-task-${mockTask.id}`);
    const deleteButton = screen.getByTestId(`delete-task-${mockTask.id}`);
    
    expect(editButton.querySelector('svg')).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  it('applies hover effects on buttons', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const editButton = screen.getByTestId(`edit-task-${mockTask.id}`);
    const deleteButton = screen.getByTestId(`delete-task-${mockTask.id}`);
    
    expect(editButton).toHaveClass('hover:bg-blue-50');
    expect(deleteButton).toHaveClass('hover:bg-red-50');
  });

  it('renders with dark mode classes', () => {
    render(<TaskItem task={mockTask} {...defaultProps} />);
    
    const taskItem = screen.getByTestId(`task-item-${mockTask.id}`);
    expect(taskItem).toHaveClass('dark:bg-gray-800');
  });
});
