import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [name, setName] = useState('');
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !document) {
      setMessage('Name and document required');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('document', document);
    try {
      await axios.post('http://localhost:5000/api/submit', formData);
      setMessage('Submitted successfully!');
    } catch (err) {
      setMessage('Submission failed');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name}
          onChange={e => setName(e.target.value)} />
        <input type="file" accept=".pdf,.doc,.docx"
          onChange={e => setDocument(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
      <div>{message}</div>
    </div>
  );
}

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/submissions')
      .then(res => setSubmissions(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Document</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>
                <a href={`http://localhost:5000/api/download/${s.filename}`} target="_blank" rel="noopener noreferrer">
                  {s.filename}
                </a>
              </td>
              <td>{new Date(s.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [role, setRole] = useState('user');
  return (
    <div>
      <button onClick={() => setRole('user')}>User Dashboard</button>
      <button onClick={() => setRole('admin')}>Admin Dashboard</button>
      {role === 'user' ? <UserDashboard /> : <AdminDashboard />}
    </div>
  );
}

export default App; 