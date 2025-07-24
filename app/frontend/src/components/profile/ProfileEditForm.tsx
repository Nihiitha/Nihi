import React, { useState } from 'react';
import { FaSave, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import FormField from '../common/FormField';
import ImageUpload from '../common/ImageUpload';
import SkillsManager from './SkillsManager';
import type { MockUserProfile } from '../../data/mockData';

interface ProfileEditFormProps {
  profile: MockUserProfile;
  onSave: (updatedProfile: MockUserProfile) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormState {
  name: string;
  title: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<FormState>({
    name: profile.name,
    title: profile.title,
    location: profile.location,
    bio: profile.bio,
    email: profile.contactInfo.email,
    phone: profile.contactInfo.phone || '',
    website: profile.contactInfo.website || '',
    linkedin: profile.socialLinks.linkedin || '',
    twitter: profile.socialLinks.twitter || '',
    github: profile.socialLinks.github || ''
  });

  const [touched, setTouched] = useState<TouchedFields>({});
  const [skills, setSkills] = useState(profile.skills);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (fieldName: string, value: string): string | null => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        break;
      
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title must be less than 100 characters';
        break;
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.length > 100) return 'Location must be less than 100 characters';
        break;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email format is invalid';
        break;
      
      case 'phone':
        if (value.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
          return 'Phone number format is invalid';
        }
        break;
      
      case 'website':
        if (value.trim() && !/^https?:\/\/.+\..+/.test(value)) {
          return 'Website URL format is invalid';
        }
        break;
      
      case 'bio':
        if (value.length > 500) return 'Bio must be less than 500 characters';
        break;
    }
    
    return null;
  };

  const getFieldError = (fieldName: string): string | null => {
    const value = formData[fieldName as keyof FormState];
    const isTouched = touched[fieldName];
    
    if (!isTouched) return null;
    return validateField(fieldName, value);
  };

  const isFormValid = (): boolean => {
    const requiredFields = ['name', 'title', 'location', 'email'];
    return requiredFields.every(field => {
      const error = validateField(field, formData[field as keyof FormState]);
      return !error;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      // Mark all fields as touched to show errors
      const allTouched: TouchedFields = {};
      Object.keys(formData).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      return;
    }

    setSubmitStatus('submitting');
    setErrorMessage(null);

    try {
      const updatedProfile: MockUserProfile = {
        ...profile,
        name: formData.name,
        title: formData.title,
        location: formData.location,
        bio: formData.bio,
        avatar: avatarPreview || profile.avatar,
        skills,
        contactInfo: {
          ...profile.contactInfo,
          email: formData.email,
          phone: formData.phone || undefined,
          website: formData.website || undefined
        },
        socialLinks: {
          linkedin: formData.linkedin || undefined,
          twitter: formData.twitter || undefined,
          github: formData.github || undefined,
          website: formData.website || undefined
        }
      };

      await onSave(updatedProfile);
      setSubmitStatus('success');
      
      // Reset success status after 2 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    if (submitStatus === 'submitting') return;
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <div className="flex items-center gap-2">
            {submitStatus === 'success' && (
              <div className="flex items-center gap-1 text-green-600">
                <FaCheck className="w-4 h-4" />
                <span className="text-sm">Saved successfully!</span>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="flex items-center gap-1 text-red-600">
                <FaExclamationTriangle className="w-4 h-4" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Profile Image Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
          <ImageUpload
            label="Upload a new profile photo"
            currentImage={avatarPreview || undefined}
            onImageChange={handleImageChange}
            maxSize={5}
          />
        </div>

        {/* Basic Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('name') || undefined}
              touched={touched.name}
              required
              maxLength={50}
            />
            
            <FormField
              label="Professional Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('title') || undefined}
              touched={touched.title}
              required
              maxLength={100}
              placeholder="e.g., Senior Software Engineer"
            />
            
            <FormField
              label="Location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('location') || undefined}
              touched={touched.location}
              required
              maxLength={100}
              placeholder="e.g., San Francisco, CA"
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('email') || undefined}
              touched={touched.email}
              required
            />
          </div>
          
          <FormField
            label="Bio"
            name="bio"
            type="textarea"
            value={formData.bio}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={getFieldError('bio') || undefined}
            touched={touched.bio}
            maxLength={500}
            rows={4}
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          />
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('phone') || undefined}
              touched={touched.phone}
              placeholder="+1 (555) 123-4567"
            />
            
            <FormField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={getFieldError('website') || undefined}
              touched={touched.website}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="LinkedIn"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            
            <FormField
              label="Twitter"
              name="twitter"
              type="url"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/yourhandle"
            />
            
            <FormField
              label="GitHub"
              name="github"
              type="url"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
          <SkillsManager
            skills={skills}
            onSkillsChange={setSkills}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitStatus === 'submitting'}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitStatus === 'submitting' || !isFormValid()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitStatus === 'submitting' ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 