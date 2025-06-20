import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/Modal';

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  title: 'Modal de Teste',
  children: <div data-testid="modal-children">Conteúdo do modal</div>,
};

// Mock do document.body.style para testes
const originalBodyStyle = document.body.style;

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyStyle.overflow;
  });

  it('deve renderizar corretamente quando aberto', () => {
    render(<Modal {...mockProps} />);
    
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-close')).toBeInTheDocument();
  });

  it('não deve renderizar quando fechado', () => {
    render(<Modal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve mostrar título correto', () => {
    render(<Modal {...mockProps} />);
    
    expect(screen.getByText('Modal de Teste')).toBeInTheDocument();
  });

  it('deve renderizar children corretamente', () => {
    render(<Modal {...mockProps} />);
    
    expect(screen.getByTestId('modal-children')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('deve chamar onClose quando botão fechar é clicado', () => {
    render(<Modal {...mockProps} />);
    
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose quando overlay é clicado', () => {
    render(<Modal {...mockProps} />);
    
    const overlay = screen.getByTestId('modal-overlay').firstChild as HTMLElement;
    fireEvent.click(overlay);
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose quando tecla Escape é pressionada', () => {
    render(<Modal {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onClose para outras teclas', () => {
    render(<Modal {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    fireEvent.keyDown(document, { key: 'Tab' });
    
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('deve prevenir scroll do body quando modal está aberto', () => {
    render(<Modal {...mockProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('deve restaurar scroll do body quando modal é fechado', () => {
    const { rerender } = render(<Modal {...mockProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...mockProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('deve limpar event listeners quando componente é desmontado', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Modal {...mockProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('deve ter aria-label correto no botão fechar', () => {
    render(<Modal {...mockProps} />);
    
    const closeButton = screen.getByTestId('modal-close');
    expect(closeButton).toHaveAttribute('aria-label', 'Fechar modal');
  });

  it('deve ter classes de estilo corretas', () => {
    render(<Modal {...mockProps} />);
    
    const overlay = screen.getByTestId('modal-overlay');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
    
    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('relative', 'bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-xl');
    
    const title = screen.getByTestId('modal-title');
    expect(title).toHaveClass('text-xl', 'font-semibold');
  });

  it('deve permitir interação com overlay via teclado', () => {
    render(<Modal {...mockProps} />);
    
    const overlayBackground = screen.getByTestId('modal-overlay').firstChild as HTMLElement;
    
    fireEvent.keyDown(overlayBackground, { key: 'Escape' });
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('deve ter tabIndex e role corretos no overlay', () => {
    render(<Modal {...mockProps} />);
    
    const overlayBackground = screen.getByTestId('modal-overlay').firstChild as HTMLElement;
    
    expect(overlayBackground).toHaveAttribute('role', 'button');
    expect(overlayBackground).toHaveAttribute('tabIndex', '0');
    expect(overlayBackground).toHaveAttribute('aria-label', 'Fechar modal');
  });

  it('deve mostrar ícone de fechar correto', () => {
    render(<Modal {...mockProps} />);
    
    const closeButton = screen.getByTestId('modal-close');
    const svg = closeButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('deve aplicar estilos de hover no botão fechar', () => {
    render(<Modal {...mockProps} />);
    
    const closeButton = screen.getByTestId('modal-close');
    expect(closeButton).toHaveClass('hover:bg-gray-100', 'dark:hover:bg-gray-700');
  });

  it('deve ter overflow-y-auto para conteúdo grande', () => {
    render(<Modal {...mockProps} />);
    
    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('overflow-y-auto');
  });

  it('deve ter altura máxima configurada', () => {
    render(<Modal {...mockProps} />);
    
    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('max-h-[90vh]');
  });

  it('deve reagir corretamente a mudanças na prop isOpen', () => {
    const { rerender } = render(<Modal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    
    rerender(<Modal {...mockProps} isOpen={true} />);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('deve executar cleanup adequado ao mudar isOpen', () => {
    const { rerender } = render(<Modal {...mockProps} isOpen={true} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...mockProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });
});
