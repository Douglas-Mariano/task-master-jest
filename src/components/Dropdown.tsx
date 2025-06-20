'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  icon?: React.ReactNode;
  buttonClassName?: string;
  showValue?: boolean; // Mostrar o valor selecionado
  openUpward?: boolean; // Abrir para cima
  openSideways?: boolean; // Abrir para o lado
  horizontalLayout?: boolean; // Layout horizontal (lado a lado)
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  icon,
  buttonClassName = "",
  showValue = false,
  openUpward = false,
  openSideways = false,
  horizontalLayout = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  // Calcular posição do dropdown
  const getDropdownPosition = () => {
    if (openSideways) return 'left-full top-0 ml-1';
    if (openUpward) return 'bottom-full mb-1 left-0';
    return 'top-full left-0';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${buttonClassName}`}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{label}</span>
          {showValue && selectedOption && (
            <span className="bg-white text-current text-xs px-2 py-1 rounded-full font-medium opacity-80">
              {selectedOption.label}
            </span>
          )}

        </div>
      </button>

      {isOpen && (
        <div className={`absolute ${horizontalLayout ? 'min-w-max' : 'w-full min-w-48'} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${getDropdownPosition()}`}>
          <div className={horizontalLayout ? "px-2 py-2" : "py-1"}>
            {horizontalLayout ? (
              <div className="flex gap-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-center px-4 py-1 text-sm rounded-md transition-colors min-w-[40px] ${
                      value === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === option.value
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
