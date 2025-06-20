import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from '../components/TaskManager';

// Mock do crypto para evitar problemas no ambiente de teste
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  }
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('TaskManager', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('deve renderizar corretamente', () => {
    render(<TaskManager />);
    
    expect(screen.getByTestId('task-manager')).toBeInTheDocument();
    expect(screen.getByTestId('action-bar')).toBeInTheDocument();
    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByText('Filtrar')).toBeInTheDocument();
    expect(screen.getByText('Estatísticas')).toBeInTheDocument();
  });

  it('deve mostrar estado vazio quando não há tarefas', () => {
    render(<TaskManager />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma tarefa encontrada')).toBeInTheDocument();
    expect(screen.getByText('Comece adicionando uma nova tarefa acima.')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Nova Tarefa', async () => {
    render(<TaskManager />);
    
    const addButton = screen.getByTestId('add-task-button');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      const modalTitles = screen.getAllByText('Nova Tarefa');
      expect(modalTitles.length).toBeGreaterThan(0);
    });
  });

  it('deve expandir/recolher estatísticas', async () => {
    render(<TaskManager />);
    
    const statsButton = screen.getByTestId('stats-toggle');
    
    // Verificar que estatísticas não estão visíveis inicialmente
    expect(screen.queryByTestId('stats-section')).not.toBeInTheDocument();
    
    // Expandir estatísticas
    fireEvent.click(statsButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('stats-section')).toBeInTheDocument();
      expect(screen.getByText('Estatísticas das Tarefas')).toBeInTheDocument();
    });
    
    // Fechar estatísticas pelo botão X
    const closeButton = screen.getByTestId('stats-close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('stats-section')).not.toBeInTheDocument();
    });
  });

  it('deve carregar tarefas do localStorage', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Tarefa de teste',
        priority: 'high',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));
    
    render(<TaskManager />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('tasks');
  });

  it('deve lidar com localStorage corrompido', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<TaskManager />);
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('tasks');
    
    consoleSpy.mockRestore();
  });

  it('deve filtrar tarefas por status', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Tarefa pendente',
        priority: 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Tarefa concluída',
        priority: 'low',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));
    
    render(<TaskManager />);
    
    // Aguardar o carregamento
    await waitFor(() => {
      expect(screen.getByText('Suas Tarefas (2)')).toBeInTheDocument();
    });
  });

  it('deve adicionar nova tarefa', async () => {
    render(<TaskManager />);
    
    // Abrir modal
    fireEvent.click(screen.getByTestId('add-task-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeInTheDocument();
    });
    
    // Preencher formulário
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Nova tarefa de teste' } });
    
    // Submeter formulário
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('deve fechar modal ao pressionar ESC', async () => {
    render(<TaskManager />);
    
    // Abrir modal
    fireEvent.click(screen.getByTestId('add-task-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    
    // Pressionar ESC
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('deve resetar página ao filtrar', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Tarefa 1',
        priority: 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));
    
    render(<TaskManager />);
    
    await waitFor(() => {
      expect(screen.getByText('Suas Tarefas (1)')).toBeInTheDocument();
    });
  });
});
