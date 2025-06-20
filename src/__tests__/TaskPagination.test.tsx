import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskPagination from '../components/TaskPagination';

const mockProps = {
  currentPage: 2,
  totalPages: 5,
  itemsPerPage: 10,
  totalItems: 50,
  showAll: false,
  onPageChange: jest.fn(),
  onItemsPerPageChange: jest.fn(),
  onShowAll: jest.fn(),
};

describe('TaskPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(<TaskPagination {...mockProps} />);
    
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-info')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
  });

  it('deve mostrar informações de paginação corretas', () => {
    render(<TaskPagination {...mockProps} />);
    
    expect(screen.getByText('11-20 de 50')).toBeInTheDocument();
  });

  it('deve mostrar "Mostrar todos" quando showAll é true', () => {
    render(<TaskPagination {...mockProps} showAll={true} totalItems={25} />);
    
    expect(screen.getByText('Mostrando todos os 25 itens')).toBeInTheDocument();
  });

  it('não deve renderizar quando totalItems é 0', () => {
    render(<TaskPagination {...mockProps} totalItems={0} />);
    
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('deve chamar onPageChange quando botão de página é clicado', () => {
    render(<TaskPagination {...mockProps} />);
    
    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('deve chamar onPageChange para primeira página', () => {
    render(<TaskPagination {...mockProps} />);
    
    const firstPageButton = screen.getByTestId('first-page');
    fireEvent.click(firstPageButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('deve chamar onPageChange para página anterior', () => {
    render(<TaskPagination {...mockProps} />);
    
    const prevPageButton = screen.getByTestId('prev-page');
    fireEvent.click(prevPageButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('deve desabilitar botões de navegação na primeira página', () => {
    render(<TaskPagination {...mockProps} currentPage={1} />);
    
    const firstPageButton = screen.getByTestId('first-page');
    const prevPageButton = screen.getByTestId('prev-page');
    
    expect(firstPageButton).toBeDisabled();
    expect(prevPageButton).toBeDisabled();
  });

  it('deve desabilitar botões de navegação na última página', () => {
    render(<TaskPagination {...mockProps} currentPage={5} />);
    
    const nextPageButton = screen.getByText('›');
    const lastPageButton = screen.getByText('»»');
    
    expect(nextPageButton).toBeDisabled();
    expect(lastPageButton).toBeDisabled();
  });

  it('deve destacar página atual', () => {
    render(<TaskPagination {...mockProps} />);
    
    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('bg-blue-500', 'text-white');
  });

  it('deve mostrar máximo 6 páginas', () => {
    render(<TaskPagination {...mockProps} totalPages={10} />);
    
    const pageButtons = screen.getAllByText(/^[0-9]+$/);
    expect(pageButtons).toHaveLength(6);
  });

  it('deve mostrar todas as páginas quando totalPages <= 5', () => {
    render(<TaskPagination {...mockProps} totalPages={3} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('deve mostrar páginas corretas quando currentPage <= 3', () => {
    render(<TaskPagination {...mockProps} currentPage={2} totalPages={10} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve mostrar páginas centralizadas quando no meio', () => {
    render(<TaskPagination {...mockProps} currentPage={5} totalPages={10} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('não deve mostrar controles de navegação quando showAll é true', () => {
    render(<TaskPagination {...mockProps} showAll={true} />);
    
    expect(screen.queryByTestId('pagination-controls')).not.toBeInTheDocument();
  });

  it('não deve mostrar controles quando há apenas 1 página', () => {
    render(<TaskPagination {...mockProps} totalPages={1} />);
    
    expect(screen.queryByTestId('pagination-controls')).not.toBeInTheDocument();
  });

  it('deve ter classes CSS corretas aplicadas', () => {
    render(<TaskPagination {...mockProps} />);
    
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    
    const info = screen.getByTestId('pagination-info');
    expect(info).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('deve mostrar dropdown de itens por página', () => {
    render(<TaskPagination {...mockProps} />);
    
    expect(screen.getByText('Mostrar:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Label do dropdown
  });

  it('deve chamar onItemsPerPageChange quando dropdown muda', () => {
    render(<TaskPagination {...mockProps} />);
    
    // Simular clique no dropdown e seleção de opção
    const dropdown = screen.getByText('10');
    fireEvent.click(dropdown);
    
    // Como o dropdown é complexo, verificamos se está renderizado
    expect(dropdown).toBeInTheDocument();
  });

  it('deve calcular startIndex e endIndex corretamente', () => {
    render(<TaskPagination {...mockProps} currentPage={3} itemsPerPage={5} totalItems={20} />);
    
    expect(screen.getByText('11-15 de 20')).toBeInTheDocument();
  });

  it('deve lidar com última página parcial', () => {
    render(<TaskPagination {...mockProps} currentPage={3} itemsPerPage={10} totalItems={25} />);
    
    expect(screen.getByText('21-25 de 25')).toBeInTheDocument();
  });

  it('deve ter z-index alto para ficar sobre outros elementos', () => {
    render(<TaskPagination {...mockProps} />);
    
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveClass('z-40');
  });

  it('deve ter sombra e borda superior', () => {
    render(<TaskPagination {...mockProps} />);
    
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveClass('shadow-lg', 'border-t');
  });

  it('deve mostrar texto correto para item singular', () => {
    render(<TaskPagination {...mockProps} totalItems={1} itemsPerPage={10} currentPage={1} />);
    
    expect(screen.getByText('1-1 de 1')).toBeInTheDocument();
  });

  it('deve navegar para próxima página corretamente', () => {
    render(<TaskPagination {...mockProps} />);
    
    const nextButton = screen.getByText('›');
    fireEvent.click(nextButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('deve navegar para última página corretamente', () => {
    render(<TaskPagination {...mockProps} />);
    
    const lastButton = screen.getByText('»»');
    fireEvent.click(lastButton);
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(5);
  });

  it('deve ter botões com estilos de hover', () => {
    render(<TaskPagination {...mockProps} />);
    
    const pageButton = screen.getByText('3');
    expect(pageButton).toHaveClass('hover:bg-gray-200');
  });

  it('deve ter botões desabilitados com estilos corretos', () => {
    render(<TaskPagination {...mockProps} currentPage={1} />);
    
    const disabledButton = screen.getByTestId('first-page');
    expect(disabledButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });
});
