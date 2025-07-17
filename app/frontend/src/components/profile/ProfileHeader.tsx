import React, { useState } from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';

interface UserProfile {
  id: number;
  name: string;
  title: string;
  location: string;
  avatar: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  connectionCount: number;
  mutualConnections: number;
}

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: (section?: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwnProfile = false, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false); // For future edit functionality

  const handleEdit = () => {
    if (onEdit) {
      onEdit('profile');
    }
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Photo Area */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {isOwnProfile && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-4">
          <div className="relative">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200">
                <FaEdit className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 mb-2">{profile.title}</p>
                <div className="flex items-center text-gray-500 mb-3">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{profile.location}</span>
                </div>
                
                {/* Connection Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">{profile.connectionCount}</span> connections
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{profile.mutualConnections}</span> mutual
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {!isOwnProfile && (
                  <>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                      Connect
                    </button>
                    <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {Object.keys(profile.socialLinks).length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Follow:</span>
            <div className="flex items-center gap-3">
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-900 transition-colors duration-200"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaGlobe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader; 