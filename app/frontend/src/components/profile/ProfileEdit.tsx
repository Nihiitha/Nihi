import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileEditForm from './ProfileEditForm';
import { mockProfiles, type MockUserProfile } from '../../data/mockData';

const ProfileEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MockUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        let foundProfile = mockProfiles.find(p => p.id === Number(userId));
        if (!foundProfile) {
          foundProfile = mockProfiles[0]; // fallback to first profile
        }
        setProfile(foundProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (userId) loadProfile();
  }, [userId]);

  const handleSave = async (updatedProfile: MockUserProfile) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      navigate(`/profile/${userId}`);
    } catch (err) {
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }
  if (error || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Profile not found'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <ProfileEditForm
          profile={profile}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProfileEdit; 