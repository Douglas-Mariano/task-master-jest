'use client';

import React from 'react';
import Dropdown from './Dropdown';

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  showAll: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onShowAll: () => void;
}

const ITEMS_PER_PAGE_OPTIONS = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: 'all', label: 'Todos' }
];

const TaskPagination: React.FC<TaskPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  showAll,
  onPageChange,
  onItemsPerPageChange,
  onShowAll
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handleItemsPerPageChange = (value: string) => {
    if (value === 'all') {
      onShowAll();
    } else {
      onItemsPerPageChange(Number(value));
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40" data-testid="pagination">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrar:
            </span>
            <div className="relative">
              <Dropdown
                options={ITEMS_PER_PAGE_OPTIONS}
                value={showAll ? 'all' : itemsPerPage.toString()}
                onChange={handleItemsPerPageChange}
                label={showAll ? 'Todos' : itemsPerPage.toString()}
                buttonClassName="bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 text-sm px-1 py-1 min-w-[50px] justify-center"
                showValue={false}
                openUpward={false}
                openSideways={true}
                horizontalLayout={true}
              />
            </div>
          </div>

          <div className="flex items-center gap-4" data-testid="pagination-info">
            {!showAll && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {startIndex + 1}-{endIndex} de {totalItems}
              </span>
            )}
            {showAll && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando todos os {totalItems} itens
              </span>
            )}
            
            {!showAll && totalPages > 1 && (
              <div className="flex gap-1" data-testid="pagination-controls">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="first-page"
                >
                  ««
                </button>
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="prev-page"
                >
                  ‹
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »»
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPagination;
