import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Building2, Mail, Globe, Phone, MapPin, FileText, AlertCircle, 
  Upload, Image, Mic, UserCheck, Palette, Eye, Info, Trash2, CheckCircle, Loader 
} from 'lucide-react';
import { createOrganization, uploadOrganizationLogo, checkDomainAvailability } from '../../api/organizationService';
import { useApp } from '../../contexts/AppContext';

// Default avatar and voice options (these would typically come from an API)
const HEYGEN_AVATARS = [
  { id: 'heygen-sarah', name: 'Sarah - Professional', style: 'Business Professional', gender: 'Female', preview: '/avatars/sarah-preview.jpg' },
  { id: 'heygen-mike', name: 'Mike - Casual', style: 'Casual Presenter', gender: 'Male', preview: '/avatars/mike-preview.jpg' },
  { id: 'heygen-emma', name: 'Emma - Educational', style: 'Educational Expert', gender: 'Female', preview: '/avatars/emma-preview.jpg' },
  { id: 'heygen-david', name: 'David - Executive', style: 'Executive Leader', gender: 'Male', preview: '/avatars/david-preview.jpg' },
  { id: 'heygen-alex', name: 'Alex - Creative', style: 'Creative Director', gender: 'Non-binary', preview: '/avatars/alex-preview.jpg' },
];

const ELEVENLABS_VOICES = [
  { id: 'elevenlabs-voice-1', name: 'Professional Female', gender: 'Female', accent: 'American', tone: 'Professional', sample: '/voices/prof-female.mp3' },
  { id: 'elevenlabs-voice-2', name: 'Confident Male', gender: 'Male', accent: 'American', tone: 'Confident', sample: '/voices/conf-male.mp3' },
  { id: 'elevenlabs-voice-3', name: 'Warm Female', gender: 'Female', accent: 'British', tone: 'Warm', sample: '/voices/warm-female.mp3' },
  { id: 'elevenlabs-voice-4', name: 'Authoritative Male', gender: 'Male', accent: 'Australian', tone: 'Authoritative', sample: '/voices/auth-male.mp3' },
  { id: 'elevenlabs-voice-5', name: 'Friendly Female', gender: 'Female', accent: 'Canadian', tone: 'Friendly', sample: '/voices/friendly-female.mp3' },
];

const ORGANIZATION_THEMES = [
  { id: 'default', name: 'Default', primaryColor: '#3B82F6', secondaryColor: '#8B5CF6', description: 'Clean and professional' },
  { id: 'corporate', name: 'Corporate', primaryColor: '#1F2937', secondaryColor: '#6B7280', description: 'Professional and trustworthy' },
  { id: 'creative', name: 'Creative', primaryColor: '#F59E0B', secondaryColor: '#EF4444', description: 'Vibrant and innovative' },
  { id: 'education', name: 'Education', primaryColor: '#10B981', secondaryColor: '#3B82F6', description: 'Learning-focused' },
  { id: 'healthcare', name: 'Healthcare', primaryColor: '#06B6D4', secondaryColor: '#8B5CF6', description: 'Clean and calming' },
];

export function CreateOrganizationModal({ isOpen, onClose, onSuccess }) {
  const { dispatch } = useApp();
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainStatus, setDomainStatus] = useState(null); // 'available', 'unavailable', or null
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    adminEmail: '',
    adminDomain: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    
    // Advanced Settings
    logoUrl: '',
    elevenLabsVoiceId: '',
    heyGenAvatarId: '',
    heyGenInteractiveAvatarId: '',
    organizationThemeId: 'default',
    status: 'ACTIVE'
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: Building2, description: 'Organization details' },
    { id: 2, name: 'Contact & Address', icon: MapPin, description: 'Contact information' },
    { id: 3, name: 'Branding & AI', icon: Palette, description: 'Theme, avatars & voices' },
    { id: 4, name: 'Review', icon: Eye, description: 'Confirm settings' }
  ];

  // Debounced domain availability check
  const checkDomain = useCallback(async (domain) => {
    if (!domain || domain.length < 2) {
      setDomainStatus(null);
      return;
    }

    try {
      setDomainChecking(true);
      const result = await checkDomainAvailability(domain);
      console.log(result);
      
      if (result.success) {
        const isAvailable = result.available;
        setDomainStatus(isAvailable ? 'available' : 'unavailable');
        
        if (!isAvailable) {
          setErrors(prev => ({
            ...prev,
            adminDomain: 'This domain is already in use'
          }));
        } else {
          // Clear domain availability errors when domain is available
          setErrors(prev => ({
            ...prev,
            adminDomain: ''
          }));
        }
      }
    } catch (error) {
      console.error('Domain check error:', error);
      setDomainStatus(null);
    } finally {
      setDomainChecking(false);
    }
  }, []);

  // Debounce domain checking
  useEffect(() => {
    if (formData.adminDomain) {
      const timeoutId = setTimeout(() => {
        checkDomain(formData.adminDomain);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      setDomainStatus(null);
    }
  }, [formData.adminDomain, checkDomain]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing (except for domain availability which is managed separately)
    if (errors[name] && name !== 'adminDomain') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        logoUrl: 'Please select a valid image file'
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        logoUrl: 'Image must be smaller than 5MB'
      }));
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear logo error
    setErrors(prev => ({
      ...prev,
      logoUrl: ''
    }));
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    try {
      setUploadingLogo(true);
      const logoFormData = new FormData();
      logoFormData.append('logo', logoFile);
      
      const response = await uploadOrganizationLogo(logoFormData);
      
      if (response.success) {
        return response.data.image || response.data.logoUrl || response.data.url;
      } else {
        throw new Error(response.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      throw new Error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Basic Info validation - only name is required from model
      if (!formData.name.trim()) {
        newErrors.name = 'Organization name is required';
      }
      
      // Admin email is required for creation (application-level requirement)
      if (!formData.adminEmail.trim()) {
        newErrors.adminEmail = 'Admin email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
        newErrors.adminEmail = 'Please enter a valid email address';
      }
      
      // Admin domain is required
      if (!formData.adminDomain.trim()) {
        newErrors.adminDomain = 'Admin domain is required';
      } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*$/.test(formData.adminDomain)) {
        newErrors.adminDomain = 'Domain must contain only letters, numbers, and hyphens';
      }
      // Note: Domain availability is checked in real-time via checkDomain function
      
      // Organization email validation (optional but must be valid format if provided)
      if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 2) {
      // Contact validation (optional but format validation)
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'Website must be a valid URL (http:// or https://)';
      }
      
      if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    
    // Check for validation errors
    const hasValidationErrors = Object.keys(newErrors).length > 0;
    
    // For step 1, also check domain availability (but don't set error here as it's handled by checkDomain)
    if (step === 1 && !hasValidationErrors && formData.adminDomain && domainStatus === 'unavailable') {
      return false; // Block progression but don't set error
    }
    
    return !hasValidationErrors;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload logo first if there is one
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }
      
      const organizationData = {
        ...formData,
        logoUrl,
        adminDomain: formData.adminDomain.toLowerCase(),
        // Combine address fields into a single string for backend compatibility
        address: `${formData.address.street}${formData.address.street ? ', ' : ''}${formData.address.city}${formData.address.city ? ', ' : ''}${formData.address.state}${formData.address.state ? ' ' : ''}${formData.address.postalCode}${formData.address.postalCode ? ', ' : ''}${formData.address.country}`.trim().replace(/^,\s*|,\s*$/, '')
      };
      
      const response = await createOrganization(organizationData);
      
      if (response.success) {
        dispatch({
          type: 'ADD_SYSTEM_MESSAGE',
          payload: {
            id: Date.now(),
            type: 'success',
            title: 'Organization Created Successfully!',
            message: `Organization "${formData.name}" has been created with all settings configured.`,
            timestamp: new Date(),
            isRead: false
          }
        });
        
        onSuccess?.(response.data);
        onClose();
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Organization creation error:', error);
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now(),
          type: 'error',
          title: 'Creation Failed',
          message: error.message || 'Failed to create organization. Please try again.',
          timestamp: new Date(),
          isRead: false
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      adminEmail: '',
      adminDomain: '',
      description: '',
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      logoUrl: '',
      elevenLabsVoiceId: '',
      heyGenAvatarId: '',
      heyGenInteractiveAvatarId: '',
      organizationThemeId: 'default',
      status: 'ACTIVE'
    });
    setCurrentStep(1);
    setErrors({});
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Organization</h2>
                <p className="text-blue-100 text-sm">Complete setup with branding and AI configuration</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-sm">{step.name}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 h-px mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      Organization Details
                    </h3>
                    
                    {/* Organization Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter organization name"
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Admin Domain */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Domain <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="adminDomain"
                          value={formData.adminDomain}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-40 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.adminDomain ? 'border-red-300 bg-red-50' : 
                            domainStatus === 'available' ? 'border-green-300 bg-green-50' :
                            domainStatus === 'unavailable' ? 'border-red-300 bg-red-50' :
                            'border-gray-300'
                          }`}
                          placeholder="organization-name"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                          {domainChecking && formData.adminDomain && (
                            <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                          )}
                          {domainStatus === 'available' && !domainChecking && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {domainStatus === 'unavailable' && !domainChecking && (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-gray-500 text-sm font-medium">.leaproad.com</span>
                        </div>
                      </div>
                      {errors.adminDomain && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.adminDomain}
                        </p>
                      )}
                      {domainStatus === 'available' && formData.adminDomain && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Domain is available
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Required: Creates a subdomain for the organization admin panel
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Brief description of the organization and its purpose"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Logo
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          >
                            {logoPreview ? (
                              <div className="space-y-2">
                                <img 
                                  src={logoPreview} 
                                  alt="Logo preview" 
                                  className="w-16 h-16 object-contain mx-auto rounded-lg shadow-sm"
                                />
                                <p className="text-xs text-gray-600">Click to change</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                <p className="text-xs text-gray-600">Upload logo</p>
                              </div>
                            )}
                          </div>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          
                          {logoPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(null);
                                setFormData(prev => ({ ...prev, logoUrl: '' }));
                              }}
                              className="mt-1 w-full text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                          
                          {errors.logoUrl && (
                            <p className="mt-1 text-xs text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors.logoUrl}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>• PNG, JPG, GIF up to 5MB</p>
                          <p>• Square format preferred</p>
                          <p>• Transparent background ideal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-600" />
                      Administrator Setup
                    </h3>

                    {/* Admin Email */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.adminEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="admin@organization.com"
                        required
                      />
                      {errors.adminEmail && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.adminEmail}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        This person will receive admin access and onboarding instructions
                      </p>
                    </div>

                    {/* Organization Email */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="contact@organization.com"
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Organizations can be activated/deactivated later
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                          Next Steps
                        </h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Add contact information and address</li>
                          <li>• Configure branding and AI settings</li>
                          <li>• Review and confirm all settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Address */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
                      Contact Information
                    </h3>

                    {/* Phone */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.website ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="https://organization.com"
                      />
                      {errors.website && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.website}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Address Information
                    </h3>

                    {/* Street Address */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="123 Main Street"
                      />
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    {/* Postal Code and Country */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="12345"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Branding & AI */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-blue-600" />
                    Organization Theme
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ORGANIZATION_THEMES.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setFormData(prev => ({ ...prev, organizationThemeId: theme.id }))}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.organizationThemeId === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div 
                            className="w-8 h-8 rounded-full"
                            style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{theme.name}</h4>
                            <p className="text-xs text-gray-500">{theme.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: theme.secondaryColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* HeyGen Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                      HeyGen Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      {/* HeyGen Avatar ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          HeyGen Avatar ID
                        </label>
                        <input
                          type="text"
                          name="heyGenAvatarId"
                          value={formData.heyGenAvatarId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., heygen-avatar-123"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Optional: Default HeyGen avatar for video generation
                        </p>
                      </div>

                      {/* HeyGen Interactive Avatar ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          HeyGen Interactive Avatar ID
                        </label>
                        <input
                          type="text"
                          name="heyGenInteractiveAvatarId"
                          value={formData.heyGenInteractiveAvatarId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., heygen-interactive-456"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Optional: Interactive avatar for real-time conversations
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ElevenLabs Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Mic className="w-5 h-5 mr-2 text-blue-600" />
                      ElevenLabs Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      {/* ElevenLabs Voice ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ElevenLabs Voice ID
                        </label>
                        <input
                          type="text"
                          name="elevenLabsVoiceId"
                          value={formData.elevenLabsVoiceId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., elevenlabs-voice-789"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Optional: Default voice for text-to-speech generation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        AI Configuration Notes
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• These are default AI settings for the organization</li>
                        <li>• Individual projects can override these settings</li>
                        <li>• Leave empty to use system defaults</li>
                        <li>• IDs must match your HeyGen and ElevenLabs accounts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Organization Settings</h3>
                  <p className="text-gray-600">Please review all settings before creating the organization</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Organization Name:</span>
                        <p className="text-sm text-gray-900">{formData.name || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Admin Domain:</span>
                        <p className="text-sm text-gray-900">{formData.adminDomain || 'Not specified'}.leaproad.com</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Admin Email:</span>
                        <p className="text-sm text-gray-900">{formData.adminEmail}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Organization Email:</span>
                        <p className="text-sm text-gray-900">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <p className="text-sm text-gray-900">{formData.status}</p>
                      </div>
                      {formData.description && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Description:</span>
                          <p className="text-sm text-gray-900">{formData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Address Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Contact & Address
                    </h4>
                    <div className="space-y-3">
                      {formData.phone && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Phone:</span>
                          <p className="text-sm text-gray-900">{formData.phone}</p>
                        </div>
                      )}
                      {formData.website && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Website:</span>
                          <p className="text-sm text-gray-900">{formData.website}</p>
                        </div>
                      )}
                      {(formData.address.street || formData.address.city || formData.address.state || formData.address.postalCode || formData.address.country) && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Address:</span>
                          <p className="text-sm text-gray-900">
                            {[
                              formData.address.street,
                              formData.address.city,
                              formData.address.state,
                              formData.address.postalCode,
                              formData.address.country
                            ].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Branding Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-blue-600" />
                      Branding & Theme
                    </h4>
                    <div className="space-y-3">
                      {logoPreview && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Logo:</span>
                          <div className="mt-1">
                            <img src={logoPreview} alt="Logo" className="w-16 h-16 object-contain rounded-lg shadow-sm" />
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">Theme:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {(() => {
                            const theme = ORGANIZATION_THEMES.find(t => t.id === formData.organizationThemeId);
                            return (
                              <>
                                <div 
                                  className="w-4 h-4 rounded"
                                  style={{ background: `linear-gradient(135deg, ${theme?.primaryColor}, ${theme?.secondaryColor})` }}
                                />
                                <span className="text-sm text-gray-900">{theme?.name}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Configuration Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                      AI Configuration
                    </h4>
                    <div className="space-y-3">
                      {formData.heyGenAvatarId && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">HeyGen Avatar ID:</span>
                          <p className="text-sm text-gray-900">{formData.heyGenAvatarId}</p>
                        </div>
                      )}
                      {formData.heyGenInteractiveAvatarId && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">HeyGen Interactive Avatar ID:</span>
                          <p className="text-sm text-gray-900">{formData.heyGenInteractiveAvatarId}</p>
                        </div>
                      )}
                      {formData.elevenLabsVoiceId && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">ElevenLabs Voice ID:</span>
                          <p className="text-sm text-gray-900">{formData.elevenLabsVoiceId}</p>
                        </div>
                      )}
                      {!formData.heyGenAvatarId && !formData.heyGenInteractiveAvatarId && !formData.elevenLabsVoiceId && (
                        <p className="text-sm text-gray-500 italic">Using system defaults</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Ready to Create Organization
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Subdomain will be created: {formData.adminDomain}.leaproad.com</li>
                        <li>• Admin user will receive onboarding email</li>
                        <li>• Organization will be ready for user management</li>
                        <li>• Default AI settings will be applied</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                )}
                <p className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingLogo}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isSubmitting || uploadingLogo ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {uploadingLogo ? 'Uploading Logo...' : 'Creating Organization...'}
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        Create Organization
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}