import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ usernameOrEmail: boolean; password: boolean }>({ usernameOrEmail: false, password: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validate = () => {
    const newErrors: { usernameOrEmail?: string; password?: string } = {};
    if (!form.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ usernameOrEmail: true, password: true });
    if (Object.keys(validationErrors).length === 0) {
      // Submit logic here
      alert('Login submitted!');
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
              />
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
              />
              {errors.password && touched.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 