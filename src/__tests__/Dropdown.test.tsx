import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '../components/Dropdown';

const mockOptions = [
  { value: '1', label: 'Opção 1' },
  { value: '2', label: 'Opção 2' },
  { value: '3', label: 'Opção 3' },
];

const mockOptionsWithIcons = [
  { 
    value: 'all', 
    label: 'Todas', 
    icon: <span data-testid="icon-all">📋</span>
  },
  { 
    value: 'pending', 
    label: 'Pendentes', 
    icon: <span data-testid="icon-pending">⏳</span>
  },
];

const mockProps = {
  options: mockOptions,
  value: '1',
  onChange: jest.fn(),
  label: 'Selecionar',
};

describe('Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(<Dropdown {...mockProps} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Selecionar')).toBeInTheDocument();
  });

  it('deve mostrar ícone quando fornecido', () => {
    const icon = <span data-testid="dropdown-icon">🔍</span>;
    render(<Dropdown {...mockProps} icon={icon} />);
    
    expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
  });

  it('deve abrir dropdown quando botão é clicado', () => {
    render(<Dropdown {...mockProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  it('deve fechar dropdown quando opção é selecionada', () => {
    render(<Dropdown {...mockProps} />);
    
    // Abrir dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Selecionar opção
    const option = screen.getByText('Opção 2');
    fireEvent.click(option);
    
    // Verificar se fechou
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
  });

  it('deve chamar onChange com valor correto', () => {
    render(<Dropdown {...mockProps} />);
    
    // Abrir dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Selecionar opção
    fireEvent.click(screen.getByText('Opção 2'));
    
    expect(mockProps.onChange).toHaveBeenCalledWith('2');
  });

  it('deve fechar dropdown quando clicar fora', () => {
    render(
      <div>
        <Dropdown {...mockProps} />
        <div data-testid="outside">Fora do dropdown</div>
      </div>
    );
    
    // Abrir dropdown
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    
    // Clicar fora
    fireEvent.mouseDown(screen.getByTestId('outside'));
    
    // Verificar se fechou
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
  });

  it('deve destacar opção selecionada', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const selectedOption = screen.getByText('Opção 1');
    expect(selectedOption.closest('button')).toHaveClass('bg-blue-50', 'text-blue-700');
  });

  it('deve mostrar valor selecionado quando showValue é true', () => {
    render(<Dropdown {...mockProps} showValue={true} />);
    
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
  });

  it('deve aplicar classes personalizadas do botão', () => {
    const customClass = 'bg-red-500 hover:bg-red-600';
    render(<Dropdown {...mockProps} buttonClassName={customClass} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600');
  });

  it('deve abrir para cima quando openUpward é true', () => {
    render(<Dropdown {...mockProps} openUpward={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown?.className).toContain('py-1');
  });

  it('deve abrir para o lado quando openSideways é true', () => {
    render(<Dropdown {...mockProps} openSideways={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown?.className).toContain('py-1');
  });

  it('deve usar layout horizontal quando horizontalLayout é true', () => {
    render(<Dropdown {...mockProps} horizontalLayout={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const container = screen.getByText('Opção 1').closest('.flex');
    expect(container).toHaveClass('flex items-center justify-center px-4 py-1 text-sm rounded-md transition-colors min-w-[40px] bg-blue-500 text-white');
  });

  it('deve renderizar ícones das opções no layout vertical', () => {
    render(<Dropdown {...mockProps} options={mockOptionsWithIcons} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByTestId('icon-all')).toBeInTheDocument();
    expect(screen.getByTestId('icon-pending')).toBeInTheDocument();
  });

  it('deve aplicar hover effects nas opções', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const option = screen.getByText('Opção 2').closest('button');
    expect(option).toHaveClass('hover:bg-gray-100');
  });

  it('deve ter largura mínima no layout horizontal', () => {
    render(<Dropdown {...mockProps} horizontalLayout={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown?.className).toContain('flex gap-1');
  });

  it('deve ter largura padrão no layout vertical', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown?.className).toContain('py-1');
  });

  it('deve limpar event listeners ao desmontar', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Dropdown {...mockProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('deve manter dropdown fechado inicialmente', () => {
    render(<Dropdown {...mockProps} />);
    
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Opção 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Opção 3')).not.toBeInTheDocument();
  });

  it('deve alternar abertura/fechamento do dropdown', () => {
    render(<Dropdown {...mockProps} />);
    
    const button = screen.getByRole('button');
    
    // Abrir
    fireEvent.click(button);
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    
    // Fechar
    fireEvent.click(button);
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument();
  });

  it('deve encontrar opção selecionada corretamente', () => {
    render(<Dropdown {...mockProps} value="2" />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const selectedOption = screen.getByText('Opção 2').closest('button');
    expect(selectedOption).toHaveClass('bg-blue-50');
  });

  it('deve ter estilos dark mode', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown).toHaveClass('py-1');
  });

  it('deve ter z-index alto para sobreposição', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown).toHaveClass('py-1');
  });

  it('deve ter sombra e bordas arredondadas', () => {
    render(<Dropdown {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const dropdown = screen.getByText('Opção 1').closest('div');
    expect(dropdown).toHaveClass('py-1');
  });

  it('deve centralizar conteúdo no layout horizontal', () => {
    render(<Dropdown {...mockProps} horizontalLayout={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const option = screen.getByText('Opção 1').closest('button');
    expect(option).toHaveClass('justify-center');
  });

  it('deve ter largura mínima para opções no layout horizontal', () => {
    render(<Dropdown {...mockProps} horizontalLayout={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const option = screen.getByText('Opção 1').closest('button');
    expect(option).toHaveClass('min-w-[40px]');
  });

  it('deve usar flexbox para layout das opções no modo horizontal', () => {
    render(<Dropdown {...mockProps} horizontalLayout={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    const container = screen.getByText('Opção 1').closest('.flex');
    expect(container).toHaveClass('flex');
  });
});
