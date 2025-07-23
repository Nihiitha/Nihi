import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import UserInfo from './UserInfo';
import UserActivity from './UserActivity';

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
  skills: Array<{
    id: number;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
  }>;
  contactInfo: {
    email: string;
    phone?: string;
    location: string;
    website?: string;
  };
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Mock profile data - in real app, this would come from API
  const mockProfile: UserProfile = {
    id: 1,
    name: "John Doe",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    avatar: "/default-avatar.png",
    bio: "Passionate software engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and contribute to innovative projects.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
      website: "https://johndoe.dev"
    },
    connectionCount: 342,
    mutualConnections: 28,
    skills: [
      { id: 1, name: "React", level: "expert" },
      { id: 2, name: "Node.js", level: "advanced" },
      { id: 3, name: "TypeScript", level: "advanced" },
      { id: 4, name: "Python", level: "intermediate" },
      { id: 5, name: "AWS", level: "intermediate" },
      { id: 6, name: "Docker", level: "beginner" }
    ],
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01-01",
        current: true,
        description: "Leading development of scalable web applications using React and Node.js. Mentoring junior developers and implementing best practices."
      },
      {
        id: 2,
        title: "Software Engineer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        startDate: "2020-03-01",
        endDate: "2021-12-31",
        current: false,
        description: "Developed and maintained multiple web applications. Collaborated with cross-functional teams to deliver high-quality software."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science",
        institution: "Stanford University",
        field: "Computer Science",
        startDate: "2016-09-01",
        endDate: "2020-06-01",
        current: false,
        gpa: "3.8"
      }
    ],
    contactInfo: {
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      website: "https://johndoe.dev"
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          setProfile(mockProfile);
        }
        const currentUserId = localStorage.getItem('userId');
        setIsOwnProfile(currentUserId === userId);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchProfile();
    }
  }, [userId, location]);

  const handleEdit = (section: string = 'profile') => {
    console.log('Edit profile section:', section);
    // Navigate to edit page
    if (userId) {
      navigate(`/profile/${userId}/edit`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Header and User Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              isOwnProfile={isOwnProfile}
              onEdit={handleEdit}
            />

            {/* User Information */}
            <UserInfo
              bio={profile.bio}
              skills={profile.skills}
              experience={profile.experience}
              education={profile.education}
              contactInfo={profile.contactInfo}
              isOwnProfile={isOwnProfile}
              onEdit={handleEdit}
            />
          </div>

          {/* Right Column - User Activity */}
          <div className="lg:col-span-1">
            <UserActivity
              userId={profile.id}
              connectionCount={profile.connectionCount}
              mutualConnections={profile.mutualConnections}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 