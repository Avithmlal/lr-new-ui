import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Mic } from 'lucide-react';
import { getMyVoices } from '../../../api/voiceService';
import VoiceAvatarCard from './VoiceAvatarCard';
import CreateVoiceAvatarModal from './CreateVoiceAvatarModal';
import LoadingCard from '../Common/LoadingCard';
import EmptyState from '../Common/EmptyState';
import Pagination from '../Common/Pagination';
import SearchAndFilter from '../Common/SearchAndFilter';

const VoiceAvatars = () => {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12);
  const [searchKey, setSearchKey] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const sortOptions = [
    { field: 'title', label: 'Title' },
    { field: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', label: 'Updated Date' },
    { field: 'status', label: 'Status' }
  ];

  const fetchVoices = useCallback(async (page, search, sortF, sortO) => {
    try {
      setLoading(true);
      const response = await getMyVoices(page, itemsPerPage, search, sortF, sortO);
      console.log('Voice API Response:', response); // Debug log
      
      setVoices(response.data || []);
      
      // Extract totalCount from response.info.totalCount (backend structure)
      const totalCount = response.info?.totalCount || 0;
      console.log('Voice Total Count:', totalCount); // Debug log
      
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch voices:', err);
      setError('Failed to load voice avatars. Please try again.');
      setVoices([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchVoices(currentPage, searchKey, sortField, sortOrder);
  }, [currentPage, searchKey, sortField, sortOrder, fetchVoices]);

  const handleVoiceCreated = useCallback((newVoice) => {
    // Reset to first page and refresh data
    setCurrentPage(1);
    setIsCreateModalOpen(false);
  }, []);

  const handleVoiceUpdated = (updatedVoice) => {
    setVoices(prev => 
      prev.map(voice => 
        voice._id === updatedVoice._id ? updatedVoice : voice
      )
    );
  };

  const handleVoiceDeleted = useCallback((deletedVoiceId) => {
    // Remove from local state - useEffect will handle refresh if needed
    setVoices(prev => prev.filter(voice => voice._id !== deletedVoiceId));
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((search) => {
    setSearchKey(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchVoices}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Voice Avatars</h2>
          <p className="text-gray-600 mt-1">
            Create and manage your custom voice avatars
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Voice
        </button>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchValue={searchKey}
        onSearchChange={handleSearchChange}
        placeholder="Search voices by title..."
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortOptions={sortOptions}
      />

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : voices.length === 0 ? (
        <EmptyState
          icon={Mic}
          title={searchKey ? "No voices found" : "No voice avatars yet"}
          description={
            searchKey 
              ? `No voices found matching "${searchKey}". Try adjusting your search.`
              : "Create your first voice avatar to add personalized audio to your videos."
          }
          actionLabel="Create Voice Avatar"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {voices.map((voice) => (
              <VoiceAvatarCard
                key={voice._id}
                voice={voice}
                onUpdate={handleVoiceUpdated}
                onDelete={handleVoiceDeleted}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateVoiceAvatarModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onVoiceCreated={handleVoiceCreated}
        />
      )}
    </div>
  );
};

export default VoiceAvatars;