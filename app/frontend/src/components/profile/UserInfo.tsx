import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaPlus, FaGlobe } from 'react-icons/fa';

interface Skill {
  id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  website?: string;
}

interface UserInfoProps {
  bio: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  contactInfo: ContactInfo;
  isOwnProfile?: boolean;
  onEdit?: (section: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  bio,
  skills,
  experience,
  education,
  contactInfo,
  isOwnProfile = false,
  onEdit
}) => {
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    experience: true,
    education: true,
    contact: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSkillLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Bio Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">About</h2>
          {isOwnProfile && (
            <button
              onClick={() => onEdit?.('bio')}
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">{bio}</p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <button
                  onClick={() => onEdit?.('skills')}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => toggleSection('skills')}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {expandedSections.skills ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {expandedSections.skills && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <button
                  onClick={() => onEdit?.('experience')}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => toggleSection('experience')}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {expandedSections.experience ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {expandedSections.experience && (
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600 text-sm">{exp.location}</p>
                      <p className="text-gray-500 text-sm">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => onEdit?.('experience')}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <button
                  onClick={() => onEdit?.('education')}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => toggleSection('education')}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {expandedSections.education ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {expandedSections.education && (
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      <p className="text-gray-600">{edu.field}</p>
                      <p className="text-gray-500 text-sm">
                        {formatDate(edu.startDate)} - {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate) : ''}
                      </p>
                      {edu.gpa && (
                        <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => onEdit?.('education')}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <button
                  onClick={() => onEdit?.('contact')}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => toggleSection('contact')}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {expandedSections.contact ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {expandedSections.contact && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">{contactInfo.email}</span>
              </div>
              {contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{contactInfo.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">{contactInfo.location}</span>
              </div>
              {contactInfo.website && (
                <div className="flex items-center gap-3">
                  <FaGlobe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 