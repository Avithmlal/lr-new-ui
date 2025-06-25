import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download, ExternalLink } from 'lucide-react';

const VideoPreviewModal = ({ isOpen, onClose, avatar, videoUrl, loading: externalLoading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, videoUrl]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleDownload = () => {
    if (videoUrl && !isIframeUrl(videoUrl)) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${avatar.name}-preview.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isIframeUrl = (url) => {
    return url && url.includes('iframe.mediadelivery.net');
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoError = () => {
    setError('Failed to load video. The video file may be corrupted or unavailable.');
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{avatar.name}</h2>
            <p className="text-sm text-gray-600">Video Preview</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          {(loading || externalLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {error || (!videoUrl && !externalLoading && !loading) ? (
            <div className="aspect-video flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <p className="text-lg mb-2">Unable to load video</p>
                <p className="text-sm text-gray-400">
                  {error || 'Video URL not available for this avatar'}
                </p>
              </div>
            </div>
          ) : videoUrl ? (
            isIframeUrl(videoUrl) ? (
              <div className="relative">
                <iframe
                  src={videoUrl}
                  className="w-full aspect-video"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={() => setLoading(false)}
                  onError={handleVideoError}
                />
                
                {/* Iframe overlay for external link */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-sm">
                      Video hosted on external service
                    </div>
                    <button
                      onClick={() => window.open(videoUrl, '_blank')}
                      className="text-white hover:text-blue-400 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full aspect-video"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={handleVideoError}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  preload="metadata"
                />

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-blue-400 transition-colors"
                        disabled={loading || externalLoading || error}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-blue-400 transition-colors"
                        disabled={loading || externalLoading || error}
                      >
                        {isMuted ? (
                          <VolumeX className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleDownload}
                        className="text-white hover:text-blue-400 transition-colors"
                        disabled={loading || error || !videoUrl || isIframeUrl(videoUrl)}
                        title="Download video"
                      >
                        <Download className="w-5 h-5" />
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-blue-400 transition-colors"
                        disabled={loading || error}
                        title="Fullscreen"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <p className="text-lg mb-2">Loading video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Avatar Info */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 text-gray-600">{avatar.status}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(avatar.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Default:</span>
              <span className="ml-2 text-gray-600">
                {avatar.isDefault ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Video ID:</span>
              <span className="ml-2 text-gray-600 font-mono text-xs">
                {avatar.videoId || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;