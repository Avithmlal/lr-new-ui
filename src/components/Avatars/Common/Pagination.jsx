import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  showInfo = true 
}) => {
  const getVisiblePages = () => {
    if (totalPages <= 1) return [1];
    
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always show page 1
    rangeWithDots.push(1);

    // If we have more than one page
    if (totalPages > 1) {
      // Calculate middle range
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      // Add dots before middle range if needed
      if (currentPage - delta > 2) {
        rangeWithDots.push('...');
      }

      // Add middle range
      rangeWithDots.push(...range);

      // Add dots after middle range if needed
      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...');
      }

      // Always show last page if it's different from first page
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    // Remove duplicates while preserving order
    return rangeWithDots.filter((page, index, arr) => 
      arr.indexOf(page) === index
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Debug logs
  console.log('Pagination props:', { currentPage, totalPages, totalItems, itemsPerPage });

  // Always show pagination if there are items, even if only 1 page
  if (totalItems === 0) return null;

  const visiblePages = getVisiblePages();
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  console.log('Visible pages:', visiblePages);

  return (
    <div className="flex items-center justify-between py-4">
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md ${
                    page === currentPage
                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;