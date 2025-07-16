import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FaLinkedin, FaGithub, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhone, FaChevronDown, FaChevronUp, FaUserFriends, FaRegClock } from 'react-icons/fa';

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        className="flex items-center w-full justify-between text-lg font-semibold py-2 px-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
};

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityCount, setActivityCount] = useState(2);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.getProfile(1),
      api.getActivity(1)
    ])
      .then(([profileData, activityData]) => {
        if ('error' in profileData) throw new Error(profileData.error);
        setProfile(profileData);
        setActivity(activityData);
      })
      .catch((err) => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const loadMoreActivity = () => setActivityCount((c) => c + 2);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading profile...</span>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <img
          src={profile.avatar || '/default-avatar.png'}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md mb-4 md:mb-0"
        />
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.title}</p>
              <div className="flex items-center text-gray-500 mt-1">
                <FaMapMarkerAlt className="mr-1" />
                <span>{profile.location}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-2 md:mt-0">
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900"><FaLinkedin size={22} /></a>
              )}
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black"><FaGithub size={22} /></a>
              )}
              {profile.socialLinks?.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600"><FaTwitter size={22} /></a>
              )}
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1 text-gray-700"><FaUserFriends /> <span>{profile.connectionCount} Connections</span></div>
            <div className="flex items-center gap-1 text-gray-700"><FaUserFriends className="text-green-600" /> <span>{profile.mutualConnections} Mutual</span></div>
          </div>
        </div>
      </div>

      {/* User Info Sections */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <CollapsibleSection title="Bio">
          <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
        </CollapsibleSection>
        <CollapsibleSection title="Skills">
          <div className="flex flex-wrap gap-2">
            {(profile.skills || []).map((skill: any, idx: number) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{skill.name || skill}</span>
            ))}
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Work Experience">
          <ul className="space-y-3">
            {(profile.experience || []).map((exp: any, idx: number) => (
              <li key={idx} className="border-l-4 border-blue-300 pl-4">
                <div className="font-semibold">{exp.title || exp.role} @ {exp.company}</div>
                <div className="text-gray-500 text-sm">{exp.startDate || exp.start} - {exp.endDate || exp.end || (exp.current ? 'Present' : '')}</div>
                <div className="text-gray-700 text-sm">{exp.description}</div>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
        <CollapsibleSection title="Education">
          <ul className="space-y-3">
            {(profile.education || []).map((edu: any, idx: number) => (
              <li key={idx} className="border-l-4 border-green-300 pl-4">
                <div className="font-semibold">{edu.degree} @ {edu.institution || edu.school}</div>
                <div className="text-gray-500 text-sm">{edu.startDate || edu.start} - {edu.endDate || edu.end || (edu.current ? 'Present' : '')}</div>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
        <CollapsibleSection title="Contact Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><FaEnvelope /> <span>{profile.contactInfo?.email}</span></div>
            {profile.contactInfo?.phone && <div className="flex items-center gap-2"><FaPhone /> <span>{profile.contactInfo.phone}</span></div>}
            {profile.socialLinks?.linkedin && <div className="flex items-center gap-2"><FaLinkedin /> <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a></div>}
            {profile.socialLinks?.github && <div className="flex items-center gap-2"><FaGithub /> <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a></div>}
          </div>
        </CollapsibleSection>
      </div>

      {/* User Activity Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold"><FaRegClock /> Recent Activity</div>
        <ul className="space-y-3">
          {activity.slice(0, activityCount).map((activityItem: any) => (
            <li key={activityItem.id} className="flex items-center gap-3 border-l-4 border-purple-300 pl-4">
              <span className="text-2xl">{activityItem.icon || (activityItem.type === 'post' ? '📝' : activityItem.type === 'connection' ? '👥' : activityItem.type === 'comment' ? '💬' : '⭐')}</span>
              <div>
                <div className="font-medium">{activityItem.title || activityItem.content}</div>
                <div className="text-gray-500 text-xs">{activityItem.timestamp || activityItem.date}</div>
              </div>
            </li>
          ))}
        </ul>
        {activityCount < activity.length && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={loadMoreActivity}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 