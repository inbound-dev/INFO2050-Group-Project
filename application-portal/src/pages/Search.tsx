import { useState, useEffect } from 'react';

export default function SearchForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('You must be an admin to access this page.');
      window.location.href = '/login';
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('You must be an admin to access this page.');
        window.location.href = '/login';
      }
    } catch {
      alert('You must be an admin to access this page.');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/search');
        const data = await res.json();
        if (res.ok && data.success) {
          setResults(data.results);
          setError('');
        } else {
          setError(data.message || 'Failed to load applications.');
        }
      } catch (err) {
        console.error(err);
        setError('Request failed.');
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="page" style={{ padding: '1rem' }}>
      <h1>Application Search</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '0.5rem' }}>Full Name</th>
            <th style={{ border: '1px solid black', padding: '0.5rem' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '0.5rem' }}>Phone</th>
            <th style={{ border: '1px solid black', padding: '0.5rem' }}>Bio</th>
          </tr>
        </thead>
        <tbody>
          {results
            .filter(
              (r) =>
                (!fullName || r.full_name.toLowerCase().includes(fullName.toLowerCase())) &&
                (!email || r.email.toLowerCase().includes(email.toLowerCase()))
            )
            .map((r) => (
              <tr key={r.application_id}>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}>{r.full_name}</td>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}>{r.email}</td>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}>{r.phone}</td>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}>{r.bio}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}