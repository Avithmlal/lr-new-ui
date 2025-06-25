import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Video, 
  Image, 
  Upload, 
  Search, 
  X, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

export function ScriptEditor({ 
  script = '', 
  onScriptChange, 
  onMediaAssign,
  initialAnnotations = []
}) {
  const [text, setText] = useState(script);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [mediaOptionsPosition, setMediaOptionsPosition] = useState({ top: 0, left: 0 });
  const [showSlidePanel, setShowSlidePanel] = useState(false);
  const [showStockPanel, setShowStockPanel] = useState(false);
  const [stockKeyword, setStockKeyword] = useState('');
  const [uploadedPpt, setUploadedPpt] = useState(null);
  const [slides, setSlides] = useState([]);
  const [stockVideos, setStockVideos] = useState([]);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
  const [showAnnotationPreview, setShowAnnotationPreview] = useState(false);
  const [previewAnnotation, setPreviewAnnotation] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const [error, setError] = useState(null);
  
  const editorRef = useRef(null);
  const mediaOptionsRef = useRef(null);
  const previewRef = useRef(null);

  // Initialize with mock slides if PPT is uploaded
  useEffect(() => {
    if (uploadedPpt) {
      const mockSlides = Array.from({ length: 12 }, (_, i) => ({
        id: `slide-${i + 1}`,
        title: `Slide ${i + 1}`,
        thumbnailUrl: `https://images.pexels.com/photos/${3756679 + i}/pexels-photo-${3756679 + i}.jpeg?auto=compress&cs=tinysrgb&w=150`,
        content: `Content for slide ${i + 1}`
      }));
      setSlides(mockSlides);
    }
  }, [uploadedPpt]);

  // Search for stock videos based on keyword
  const searchStockVideos = (keyword) => {
    // Mock stock video search
    const mockStockVideos = Array.from({ length: 9 }, (_, i) => ({
      id: `stock-${i + 1}`,
      title: `${keyword} video ${i + 1}`,
      thumbnailUrl: `https://images.pexels.com/photos/${4348404 + i}/pexels-photo-${4348404 + i}.jpeg?auto=compress&cs=tinysrgb&w=150`,
      previewUrl: `https://images.pexels.com/photos/${4348404 + i}/pexels-photo-${4348404 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`
    }));
    setStockVideos(mockStockVideos);
  };

  // Handle text selection
  const handleTextSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText && editorRef.current.contains(selection.anchorNode)) {
        // Get selection range
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        // Calculate position for media options popup
        const top = rect.bottom - editorRect.top;
        const left = rect.left + (rect.width / 2) - editorRect.left;
        
        // Check for overlapping annotations
        const start = range.startOffset;
        const end = range.endOffset;
        
        const hasOverlap = annotations.some(annotation => {
          return (
            (start >= annotation.range.start && start < annotation.range.end) ||
            (end > annotation.range.start && end <= annotation.range.end) ||
            (start <= annotation.range.start && end >= annotation.range.end)
          );
        });
        
        if (hasOverlap) {
          setError("Selected text overlaps with existing annotations. Please select a different text segment.");
          setTimeout(() => setError(null), 3000);
          return;
        }
        
        setSelectedText(selectedText);
        setSelectionRange({ start, end });
        setMediaOptionsPosition({ top, left });
        setShowMediaOptions(true);
      } else {
        setShowMediaOptions(false);
      }
    }
  };

  // Handle media assignment
  const handleMediaAssign = (mediaType) => {
    if (mediaType === 'slide') {
      setShowSlidePanel(true);
      setShowStockPanel(false);
    } else if (mediaType === 'stock') {
      setShowSlidePanel(false);
      setShowStockPanel(true);
    } else if (mediaType === 'upload') {
      // Trigger file upload
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          addAnnotation({
            type: 'upload',
            content: file.name,
            metadata: {
              fileType: file.type,
              fileSize: file.size,
              fileName: file.name
            }
          });
        }
      };
      fileInput.click();
    }
  };

  // Add annotation to the script
  const addAnnotation = (media) => {
    if (!selectionRange) return;
    
    const newAnnotation = {
      id: Date.now().toString(),
      text: selectedText,
      type: media.type,
      content: media.content,
      metadata: media.metadata || {},
      range: selectionRange
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    
    // Call parent callback
    if (onMediaAssign) {
      onMediaAssign(updatedAnnotations);
    }
    
    // Reset selection state
    setShowMediaOptions(false);
    setShowSlidePanel(false);
    setShowStockPanel(false);
    setSelectedText('');
    setSelectionRange(null);
  };

  // Remove annotation
  const removeAnnotation = (annotationId) => {
    const updatedAnnotations = annotations.filter(a => a.id !== annotationId);
    setAnnotations(updatedAnnotations);
    
    // Call parent callback
    if (onMediaAssign) {
      onMediaAssign(updatedAnnotations);
    }
    
    setShowAnnotationPreview(false);
  };

  // Handle PPT upload
  const handlePptUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedPpt({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  // Handle stock video search
  const handleStockSearch = (e) => {
    e.preventDefault();
    if (stockKeyword.trim()) {
      searchStockVideos(stockKeyword);
    }
  };

  // Show annotation preview when clicking on highlighted text
  const handleAnnotationClick = (annotation, e) => {
    const rect = e.target.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    setPreviewAnnotation(annotation);
    setPreviewPosition({
      top: rect.bottom - editorRect.top,
      left: rect.left + (rect.width / 2) - editorRect.left
    });
    setShowAnnotationPreview(true);
  };

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (previewRef.current && !previewRef.current.contains(e.target)) {
        setShowAnnotationPreview(false);
      }
      
      if (mediaOptionsRef.current && !mediaOptionsRef.current.contains(e.target) && !editorRef.current.contains(e.target)) {
        setShowMediaOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get color for annotation type
  const getAnnotationColor = (type) => {
    switch (type) {
      case 'slide': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stock': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'upload': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Render the script with annotations
  const renderAnnotatedScript = () => {
    if (!text) return null;
    
    // Sort annotations by start position
    const sortedAnnotations = [...annotations].sort((a, b) => a.range.start - b.range.start);
    
    const result = [];
    let lastEnd = 0;
    
    sortedAnnotations.forEach((annotation, index) => {
      // Add text before this annotation
      if (annotation.range.start > lastEnd) {
        result.push(
          <span key={`text-${index}`} className="text-gray-900">
            {text.substring(lastEnd, annotation.range.start)}
          </span>
        );
      }
      
      // Add the highlighted annotation
      result.push(
        <span 
          key={`highlight-${annotation.id}`}
          className={`cursor-pointer border-b-2 ${getAnnotationColor(annotation.type)}`}
          onClick={(e) => handleAnnotationClick(annotation, e)}
          onMouseEnter={() => setHoveredAnnotation(annotation.id)}
          onMouseLeave={() => setHoveredAnnotation(null)}
        >
          {text.substring(annotation.range.start, annotation.range.end)}
        </span>
      );
      
      lastEnd = annotation.range.end;
    });
    
    // Add any remaining text
    if (lastEnd < text.length) {
      result.push(
        <span key="text-end" className="text-gray-900">
          {text.substring(lastEnd)}
        </span>
      );
    }
    
    return result;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Script Editor</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {annotations.length} annotations
            </span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {annotations.filter(a => a.type === 'slide').length} slides
            </span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              {annotations.filter(a => a.type === 'stock').length} stock videos
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {annotations.filter(a => a.type === 'upload').length} uploads
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="file"
              id="ppt-upload"
              className="hidden"
              accept=".ppt,.pptx"
              onChange={handlePptUpload}
            />
            <label 
              htmlFor="ppt-upload"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Image className="w-4 h-4 mr-2 text-gray-500" />
              {uploadedPpt ? 'Change PPT' : 'Upload PowerPoint'}
            </label>
          </div>
          
          <button
            onClick={() => setShowSlidePanel(!showSlidePanel)}
            disabled={!uploadedPpt}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showSlidePanel 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${!uploadedPpt ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {showSlidePanel ? 'Hide Slides' : 'Show Slides'}
          </button>
        </div>
      </div>

      {/* PPT Info Banner */}
      {uploadedPpt && (
        <div className="p-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              PowerPoint: <span className="font-medium">{uploadedPpt.name}</span> • {slides.length} slides available
            </span>
          </div>
          <button 
            onClick={() => setUploadedPpt(null)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200 flex items-center">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}

      <div className="flex">
        {/* Main Editor */}
        <div className={`flex-1 ${showSlidePanel ? 'border-r border-gray-200' : ''}`}>
          <div className="relative">
            {/* Actual textarea for editing */}
            <textarea
              ref={editorRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (onScriptChange) {
                  onScriptChange(e.target.value);
                }
              }}
              onMouseUp={handleTextSelection}
              className="w-full h-[500px] p-6 font-mono text-base resize-none border-0 focus:ring-0 focus:outline-none"
              placeholder="Type or paste your script here. Highlight text to assign media elements..."
            />
            
            {/* Overlay for highlighted text */}
            <div className="absolute inset-0 pointer-events-none p-6 font-mono text-base">
              {renderAnnotatedScript()}
            </div>
          </div>
        </div>

        {/* Slides Panel */}
        {showSlidePanel && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto h-[500px]">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h4 className="font-medium text-gray-900">PowerPoint Slides</h4>
              <p className="text-sm text-gray-600 mt-1">
                Select a slide to assign to highlighted text
              </p>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-3">
              {slides.map((slide) => (
                <div 
                  key={slide.id}
                  onClick={() => {
                    if (selectedText && selectionRange) {
                      addAnnotation({
                        type: 'slide',
                        content: slide.title,
                        metadata: {
                          slideId: slide.id,
                          thumbnailUrl: slide.thumbnailUrl
                        }
                      });
                    } else {
                      setError("Please highlight text first to assign a slide");
                      setTimeout(() => setError(null), 3000);
                    }
                  }}
                  className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <img 
                    src={slide.thumbnailUrl} 
                    alt={slide.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 text-xs text-center text-gray-700 truncate">
                    {slide.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Media Options Popup */}
      {showMediaOptions && (
        <div 
          ref={mediaOptionsRef}
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-2"
          style={{ 
            top: `${mediaOptionsPosition.top}px`, 
            left: `${mediaOptionsPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex space-x-1">
            <button
              onClick={() => handleMediaAssign('slide')}
              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              disabled={!uploadedPpt}
              title={!uploadedPpt ? "Upload a PowerPoint first" : "Assign slide"}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMediaAssign('stock')}
              className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMediaAssign('upload')}
              className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMediaOptions(false)}
              className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Stock Video Panel */}
      {showStockPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Stock Video</h3>
              <button
                onClick={() => setShowStockPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleStockSearch} className="mb-4">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={stockKeyword}
                      onChange={(e) => setStockKeyword(e.target.value)}
                      placeholder="Search for stock videos..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              {stockVideos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {stockVideos.map((video) => (
                    <div 
                      key={video.id}
                      onClick={() => {
                        addAnnotation({
                          type: 'stock',
                          content: video.title,
                          metadata: {
                            videoId: video.id,
                            thumbnailUrl: video.thumbnailUrl,
                            previewUrl: video.previewUrl,
                            keyword: stockKeyword
                          }
                        });
                      }}
                      className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 hover:shadow-sm transition-all"
                    >
                      <div className="relative">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                        <p className="text-xs text-gray-500">Keyword: {stockKeyword}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {stockKeyword ? 'No videos found. Try a different keyword.' : 'Enter a keyword to search for stock videos'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Annotation Preview */}
      {showAnnotationPreview && previewAnnotation && (
        <div 
          ref={previewRef}
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-3 w-64"
          style={{ 
            top: `${previewPosition.top}px`, 
            left: `${previewPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              previewAnnotation.type === 'slide' ? 'bg-blue-100 text-blue-800' :
              previewAnnotation.type === 'stock' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {previewAnnotation.type === 'slide' ? 'PowerPoint Slide' :
               previewAnnotation.type === 'stock' ? 'Stock Video' :
               'Uploaded Video'}
            </div>
            <button
              onClick={() => removeAnnotation(previewAnnotation.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {previewAnnotation.metadata.thumbnailUrl && (
            <img 
              src={previewAnnotation.metadata.thumbnailUrl}
              alt={previewAnnotation.content}
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          
          <p className="text-sm font-medium text-gray-900">{previewAnnotation.content}</p>
          
          {previewAnnotation.type === 'stock' && previewAnnotation.metadata.keyword && (
            <p className="text-xs text-gray-500 mt-1">Keyword: {previewAnnotation.metadata.keyword}</p>
          )}
          
          {previewAnnotation.type === 'upload' && previewAnnotation.metadata.fileName && (
            <p className="text-xs text-gray-500 mt-1">File: {previewAnnotation.metadata.fileName}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2 italic">"{previewAnnotation.text}"</p>
        </div>
      )}
    </div>
  );
}