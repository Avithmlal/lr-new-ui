import React, { useState, useEffect, useCallback } from 'react';
import { Plus, User } from 'lucide-react';
import { getMyAvatars, getAvatarWithVideo } from '../../../api/avatarService';
import VideoAvatarCard from './VideoAvatarCard';
import CreateVideoAvatarModal from './CreateVideoAvatarModal';
import VideoPreviewModal from './VideoPreviewModal';
import LoadingCard from '../Common/LoadingCard';
import EmptyState from '../Common/EmptyState';
import Pagination from '../Common/Pagination';
import SearchAndFilter from '../Common/SearchAndFilter';

const VideoAvatars = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12);
  const [searchKey, setSearchKey] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const sortOptions = [
    { field: 'name', label: 'Name' },
    { field: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', label: 'Updated Date' },
    { field: 'status', label: 'Status' }
  ];

  const fetchAvatars = useCallback(async (page, search, sortF, sortO) => {
    try {
      setLoading(true);
      const response = await getMyAvatars(page, itemsPerPage, search, sortF, sortO);
      console.log('Avatar API Response:', response); // Debug log
      
      // Sort avatars to ensure default appears first
      const avatarsData = response.data || [];
      const sortedAvatars = [...avatarsData].sort((a, b) => {
        // Default avatars come first
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        
        // For non-default avatars, maintain existing order
        return 0;
      });
      
      setAvatars(sortedAvatars);
      
      // Extract totalCount from response.info.totalCount (backend structure)
      const totalCount = response.info?.totalCount || 0;
      console.log('Total Count:', totalCount); // Debug log
      
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch avatars:', err);
      setError('Failed to load avatars. Please try again.');
      setAvatars([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchAvatars(currentPage, searchKey, sortField, sortOrder);
  }, [currentPage, searchKey, sortField, sortOrder, fetchAvatars]);

  const handleAvatarCreated = useCallback((newAvatar) => {
    // Reset to first page and refresh data
    setCurrentPage(1);
    setIsCreateModalOpen(false);
  }, []);

  const handleAvatarUpdated = (updatedAvatar) => {
    setAvatars(prev => {
      const updated = prev.map(avatar => 
        avatar._id === updatedAvatar._id ? updatedAvatar : avatar
      );
      
      // Re-sort to ensure default avatar remains first
      return updated.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });
    });
  };

  const handleAvatarDeleted = useCallback((deletedAvatarId) => {
    // Refresh current page after deletion - this will be handled by useEffect
    setAvatars(prev => prev.filter(avatar => avatar._id !== deletedAvatarId));
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

  const handlePreview = useCallback(async (avatar) => {
    try {
      setPreviewLoading(true);
      setSelectedAvatar(avatar);
      setIsPreviewModalOpen(true);
      
      // Fetch avatar with video URL
      const response = await getAvatarWithVideo(avatar._id);
      setVideoUrl(response.data.sampleURL || response.data.url || null);
      
    } catch (error) {
      console.error('Failed to fetch video URL:', error);
      setVideoUrl(null);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewModalOpen(false);
    setSelectedAvatar(null);
    setVideoUrl(null);
    setPreviewLoading(false);
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchAvatars}
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
          <h2 className="text-2xl font-bold text-gray-900">Video Avatars</h2>
          <p className="text-gray-600 mt-1">
            Create and manage your custom video avatars
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Avatar
        </button>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchValue={searchKey}
        onSearchChange={handleSearchChange}
        placeholder="Search avatars by name..."
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
      ) : avatars.length === 0 ? (
        <EmptyState
          icon={User}
          title={searchKey ? "No avatars found" : "No video avatars yet"}
          description={
            searchKey 
              ? `No avatars found matching "${searchKey}". Try adjusting your search.`
              : "Create your first video avatar to get started with personalized video content."
          }
          actionLabel="Create Video Avatar"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <VideoAvatarCard
                key={avatar._id}
                avatar={avatar}
                onUpdate={handleAvatarUpdated}
                onDelete={handleAvatarDeleted}
                onPreview={handlePreview}
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
        <CreateVideoAvatarModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onAvatarCreated={handleAvatarCreated}
        />
      )}

      {/* Video Preview Modal */}
      {isPreviewModalOpen && selectedAvatar && (
        <VideoPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handleClosePreview}
          avatar={selectedAvatar}
          videoUrl={videoUrl}
          loading={previewLoading}
        />
      )}
    </div>
  );
};

export default VideoAvatars;