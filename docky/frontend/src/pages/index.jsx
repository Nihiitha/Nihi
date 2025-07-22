import React, { useState } from 'react';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const Index = () => {
  const [role, setRole] = useState('user');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center gap-4 py-6">
        <button onClick={() => setRole('user')} className={`px-4 py-2 rounded ${role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>User Dashboard</button>
        <button onClick={() => setRole('admin')} className={`px-4 py-2 rounded ${role === 'admin' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>Admin Dashboard</button>
      </div>
      {role === 'user' ? <UserDashboard /> : <AdminDashboard />}
    </div>
  );
};

export default Index; 