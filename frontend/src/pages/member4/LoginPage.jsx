import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { loginWithMockGoogle } = useAuth();
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    profileImageUrl: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.email || !form.fullName) {
      setError('Full name and email are required.');
      return;
    }

    try {
      setSubmitting(true);
      await loginWithMockGoogle(form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Smart Campus Login</h2>
      <p className="muted">Use mock Google sign-in for assignment demo, or real OAuth when configured.</p>

      <form className="grid" onSubmit={handleSubmit}>
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Profile Image URL (optional)</label>
          <input
            className="input"
            value={form.profileImageUrl}
            onChange={(e) => updateField('profileImageUrl', e.target.value)}
          />
        </div>

        {error && <div style={{ color: '#c44536', fontWeight: 600 }}>{error}</div>}

        <button className="btn primary" disabled={submitting}>
          {submitting ? 'Signing In...' : 'Mock Google Sign-In'}
        </button>

        <a className="btn secondary" href="http://localhost:8000/oauth2/authorization/google">
          Real Google OAuth (optional)
        </a>
      </form>
    </>
  );
}

export default LoginPage;
