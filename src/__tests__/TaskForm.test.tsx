import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';
import { Task } from '../types/Task';

const mockTask: Task = {
  id: '1',
  title: 'Tarefa existente',
  priority: 'high',
  completed: false,
  category: 'Trabalho',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

const mockProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('priority-select')).toBeInTheDocument();
    expect(screen.getByTestId('category-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('deve mostrar botão de cancelar quando onCancel é fornecido', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('não deve mostrar botão de cancelar quando onCancel não é fornecido', () => {
    render(<TaskForm onSubmit={mockProps.onSubmit} />);
    
    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
  });

  it('deve preencher campos com dados iniciais quando fornecidos', () => {
    render(<TaskForm {...mockProps} initialData={mockTask} />);
    
    expect(screen.getByDisplayValue('Tarefa existente')).toBeInTheDocument();
    const prioritySelect = screen.getByTestId('priority-select') as HTMLSelectElement;
    expect(prioritySelect.value).toBe('high');
    expect(screen.getByDisplayValue('Trabalho')).toBeInTheDocument();
  });

  it('deve mostrar texto correto no botão de submit para nova tarefa', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByText('Adicionar Tarefa')).toBeInTheDocument();
  });

  it('deve mostrar texto correto no botão de submit para edição', () => {
    render(<TaskForm {...mockProps} initialData={mockTask} />);
    
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
  });

  it('deve atualizar campo de título quando usuário digita', () => {
    render(<TaskForm {...mockProps} />);
    
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Nova tarefa' } });
    
    expect(titleInput).toHaveValue('Nova tarefa');
  });

  it('deve atualizar campo de categoria quando usuário digita', () => {
    render(<TaskForm {...mockProps} />);
    
    const categoryInput = screen.getByTestId('category-input');
    fireEvent.change(categoryInput, { target: { value: 'Pessoal' } });
    
    expect(categoryInput).toHaveValue('Pessoal');
  });

  it('deve atualizar prioridade quando usuário seleciona', () => {
    render(<TaskForm {...mockProps} />);
    
    const prioritySelect = screen.getByTestId('priority-select');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    
    expect(prioritySelect).toHaveValue('high');
  });

  it('deve chamar onSubmit com dados corretos ao submeter formulário', async () => {
    render(<TaskForm {...mockProps} />);
    
    // Preencher campos
    fireEvent.change(screen.getByTestId('title-input'), { 
      target: { value: 'Tarefa de teste' } 
    });
    fireEvent.change(screen.getByTestId('priority-select'), { 
      target: { value: 'high' } 
    });
    fireEvent.change(screen.getByTestId('category-input'), { 
      target: { value: 'Teste' } 
    });
    
    // Submeter formulário
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Tarefa de teste',
        priority: 'high',
        category: 'Teste',
        completed: false,
      });
    });
  });

  it('deve chamar onSubmit com categoria undefined quando vazia', async () => {
    render(<TaskForm {...mockProps} />);
    
    fireEvent.change(screen.getByTestId('title-input'), { 
      target: { value: 'Tarefa sem categoria' } 
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'Tarefa sem categoria',
        priority: 'medium',
        category: '',
        completed: false,
      });
    });
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    render(<TaskForm {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('cancel-button'));
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('não deve submeter formulário se título estiver vazio', async () => {
    render(<TaskForm {...mockProps} />);
    
    // Tentar submeter sem título
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // onSubmit não deve ser chamado
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('deve limpar formulário após submissão quando não está editando', async () => {
    render(<TaskForm {...mockProps} />);
    
    // Preencher e submeter
    fireEvent.change(screen.getByTestId('title-input'), { 
      target: { value: 'Tarefa teste' } 
    });
    fireEvent.change(screen.getByTestId('category-input'), { 
      target: { value: 'Categoria teste' } 
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toHaveValue('');
      expect(screen.getByTestId('category-input')).toHaveValue('');
      expect(screen.getByTestId('priority-select')).toHaveValue('medium');
    });
  });

  it('não deve limpar formulário após submissão quando está editando', async () => {
    render(<TaskForm {...mockProps} initialData={mockTask} />);
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toHaveValue('Tarefa existente');
    });
  });

  it('deve resetar campos quando initialData muda', () => {
    const { rerender } = render(<TaskForm {...mockProps} />);
    
    // Preencher campos
    fireEvent.change(screen.getByTestId('title-input'), { 
      target: { value: 'Tarefa temporária' } 
    });
    
    // Mudar para modo de edição
    rerender(<TaskForm {...mockProps} initialData={mockTask} />);
    
    expect(screen.getByTestId('title-input')).toHaveValue('Tarefa existente');
    expect(screen.getByTestId('priority-select')).toHaveValue('high');
    expect(screen.getByTestId('category-input')).toHaveValue('Trabalho');
  });

  it('deve preservar status completed quando editando', async () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskForm {...mockProps} initialData={completedTask} />);
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: true,
        })
      );
    });
  });

  it('deve validar que título é obrigatório', () => {
    render(<TaskForm {...mockProps} />);
    
    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toHaveAttribute('required');
  });

  it('deve ter placeholders corretos nos campos', () => {
    render(<TaskForm {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Digite o título da tarefa...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Trabalho, Pessoal...')).toBeInTheDocument();
  });
});
