import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Video, 
  Image, 
  Upload, 
  Search, 
  X, 
  Play, 
  Info,
  AlertTriangle
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
  const [uploadedPpt, setUploadedPpt] = useState(null);
  const [slides, setSlides] = useState([]);
  const [showSlidePanel, setShowSlidePanel] = useState(false);
  const [stockKeyword, setStockKeyword] = useState('');
  const [stockVideos, setStockVideos] = useState([]);
  const [showStockPanel, setShowStockPanel] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [highlightedAnnotation, setHighlightedAnnotation] = useState(null);
  const [error, setError] = useState(null);
  
  const editorRef = useRef(null);

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

  // Update selection when text is selected
  const handleTextSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText) {
        // Get selection range relative to the textarea
        const textareaValue = editorRef.current.value;
        const selectionStart = editorRef.current.selectionStart;
        const selectionEnd = editorRef.current.selectionEnd;
        
        if (selectionStart !== selectionEnd) {
          // Check for overlapping annotations
          const hasOverlap = annotations.some(annotation => {
            return (
              (selectionStart >= annotation.range.start && selectionStart < annotation.range.end) ||
              (selectionEnd > annotation.range.start && selectionEnd <= annotation.range.end) ||
              (selectionStart <= annotation.range.start && selectionEnd >= annotation.range.end)
            );
          });
          
          if (hasOverlap) {
            setError("Selected text overlaps with existing annotations. Please select a different text segment.");
            setTimeout(() => setError(null), 3000);
            return;
          }
          
          setSelectedText(selectedText);
          setSelectionRange({ start: selectionStart, end: selectionEnd });
        }
      }
    }
  };

  // Handle slide assignment
  const handleAssignSlide = () => {
    if (!selectedText || !selectionRange) {
      setError("Please select text first to assign a slide");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!uploadedPpt) {
      setError("Please upload a PowerPoint presentation first");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setShowSlidePanel(true);
    setShowStockPanel(false);
    setShowUploadPanel(false);
  };

  // Handle stock video assignment
  const handleAssignStock = () => {
    if (!selectedText || !selectionRange) {
      setError("Please select text first to assign a stock video");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setShowStockPanel(true);
    setShowSlidePanel(false);
    setShowUploadPanel(false);
  };

  // Handle video upload assignment
  const handleAssignUpload = () => {
    if (!selectedText || !selectionRange) {
      setError("Please select text first to assign an uploaded video");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setShowUploadPanel(true);
    setShowSlidePanel(false);
    setShowStockPanel(false);
  };

  // Handle stock video search
  const handleStockSearch = (e) => {
    e.preventDefault();
    if (stockKeyword.trim()) {
      searchStockVideos(stockKeyword);
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
    setShowSlidePanel(false);
    setShowStockPanel(false);
    setShowUploadPanel(false);
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
    
    setHighlightedAnnotation(null);
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

  // Handle file upload
  const handleFileUpload = (e) => {
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

  // Get color for annotation type
  const getAnnotationColor = (type) => {
    switch (type) {
      case 'slide': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stock': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'upload': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Highlight a specific annotation in the script
  const highlightAnnotation = (annotationId) => {
    setHighlightedAnnotation(annotationId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Script Editor</h3>
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
            {/* Simple text editor */}
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
              className="w-full h-[400px] p-6 font-mono text-base resize-none border-0 focus:ring-0 focus:outline-none"
              placeholder="Type or paste your script here..."
            />
          </div>
        </div>

        {/* Slides Panel */}
        {showSlidePanel && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto h-[400px]">
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

      {/* Selected Text Info */}
      {selectedText && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Selected text:</span> "{selectedText}"
          </p>
        </div>
      )}

      {/* Media Assignment Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-4">
        <button
          onClick={handleAssignSlide}
          disabled={!uploadedPpt || !selectedText}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !uploadedPpt || !selectedText
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Image className="w-4 h-4 mr-2 inline" />
          Assign Slide
        </button>
        
        <button
          onClick={handleAssignStock}
          disabled={!selectedText}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedText
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          <Video className="w-4 h-4 mr-2 inline" />
          Assign Stock Video
        </button>
        
        <button
          onClick={handleAssignUpload}
          disabled={!selectedText}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedText
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Upload className="w-4 h-4 mr-2 inline" />
          Assign Uploaded Video
        </button>
      </div>

      {/* Annotations List */}
      <div className="border-t border-gray-200">
        <div className="p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900">Media Annotations</h4>
          <p className="text-sm text-gray-600 mt-1">
            {annotations.length > 0 
              ? 'Click on an annotation to highlight it in the script'
              : 'No annotations yet. Select text and assign media.'}
          </p>
        </div>
        
        {annotations.length > 0 ? (
          <div className="max-h-[200px] overflow-y-auto">
            {annotations.map((annotation) => (
              <div 
                key={annotation.id}
                onClick={() => highlightAnnotation(annotation.id)}
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  highlightedAnnotation === annotation.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      annotation.type === 'slide' ? 'bg-blue-100 text-blue-800' :
                      annotation.type === 'stock' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {annotation.type === 'slide' ? 'Slide' :
                       annotation.type === 'stock' ? 'Stock' :
                       'Upload'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{annotation.content}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">"{annotation.text}"</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAnnotation(annotation.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {annotation.metadata.thumbnailUrl && (
                  <div className="mt-2">
                    <img 
                      src={annotation.metadata.thumbnailUrl}
                      alt={annotation.content}
                      className="h-16 w-auto object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No media annotations yet</p>
          </div>
        )}
      </div>

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

      {/* Upload Video Panel */}
      {showUploadPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upload Video</h3>
              <button
                onClick={() => setShowUploadPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">Upload a video file to include in your presentation.</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="video-upload"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="video-upload"
                  className="cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">Click to upload video</p>
                  <p className="text-xs text-gray-500">MP4, MOV, or WebM (max 100MB)</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}