import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('TaskManager - Teste de Configuração TSX', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('✅ Jest funciona perfeitamente com arquivos .tsx', () => {
    render(<TaskManager />);
    
    // Testa elementos que realmente existem no componente
    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma tarefa encontrada')).toBeInTheDocument();
    
    // Botão de estatísticas existe
    const statsButton = screen.getByText('Estatísticas');
    expect(statsButton).toBeInTheDocument();
    
    // Clica no botão de estatísticas para expandir
    fireEvent.click(statsButton);
    
    // Agora verifica se as estatísticas aparecem
    expect(screen.getByText('Total de Tarefas')).toBeInTheDocument();
  });

  it('✅ Renderização de componente React em TypeScript funciona', () => {
    const { container } = render(<TaskManager />);
    
    // Verifica se o componente foi renderizado
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('.max-w-4xl')).toBeInTheDocument();
  });
});
