import React from 'react';

const Home = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Welcome to Docky!</h1>
    <p style={{ fontSize: '1.25rem', color: '#334155', maxWidth: 600, textAlign: 'center', marginBottom: '2rem' }}>
      Docky is your all-in-one platform for collaboration, sharing, and productivity. Get started by exploring the features from the navigation bar.
    </p>
    <img src="/logo192.png" alt="Docky Logo" style={{ width: 120, marginBottom: '2rem' }} />
    <div style={{ display: 'flex', gap: '1rem' }}>
      <a href="/login" style={{ padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Login</a>
      <a href="/signup" style={{ padding: '0.75rem 2rem', background: '#64748b', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Sign Up</a>
      <a href="/dashboard" style={{ padding: '0.75rem 2rem', background: '#10b981', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Dashboard</a>
    </div>
  </div>
);

export default Home; 