import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';

/**
 * Login component handles user authentication.
 * - Sends credentials to backend
 * - Stores JWT on success
 * - Displays error and loading feedback
 */
const Login: React.FC = () => {
  // Form state
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  // Error state for validation
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  // Track touched fields for error display
  const [touched, setTouched] = useState<{ usernameOrEmail: boolean; password: boolean }>({ usernameOrEmail: false, password: false });
  // Loading state for async login
  const [loading, setLoading] = useState(false);
  // Message for user feedback (success/error)
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Clear message on navigation (unmount)
  useEffect(() => {
    return () => setMessage(null);
  }, []);

  // Handle redirect after login success
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        setMessage(null);
        navigate('/profile/1'); // Redirect to profile page after login
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Mark field as touched on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Validate form fields
  const validate = () => {
    const newErrors: { usernameOrEmail?: string; password?: string } = {};
    if (!form.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ usernameOrEmail: true, password: true });
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        // Prepare payload for backend: use email or username
        const payload: any = { password: form.password };
        if (form.usernameOrEmail.includes('@')) {
          payload.email = form.usernameOrEmail;
        } else {
          payload.username = form.usernameOrEmail;
        }
        // Use authApi.login
        const data = await authApi.login(payload);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', '1');
          setMessage('Login successful! Redirecting...');
          setLoginSuccess(true);
        } else {
          setMessage(data.error || 'Login failed.');
        }
      } catch (err) {
        setMessage('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">Username or Email</label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                autoComplete="username"
                value={form.usernameOrEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.usernameOrEmail && touched.usernameOrEmail ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {/* Show validation error if field is touched */}
              {errors.usernameOrEmail && touched.usernameOrEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.usernameOrEmail}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.password && touched.password ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {/* Show validation error if field is touched */}
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading || loginSuccess}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        {/* Show feedback message (success or error) */}
        {message && (
          <div className={`mt-4 text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <div className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 