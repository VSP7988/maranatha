import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 LOGIN: Attempting login with:', {
        email: formData.username,
        hasPassword: !!formData.password
      });

      // Use Supabase authentication with proper email format
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.username.trim().toLowerCase(),
        password: formData.password
      });

      console.log('🔐 LOGIN: Supabase response:', { data, error });

      if (error) {
        console.error('🔐 LOGIN: Authentication error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.');
        } else if (error.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          setError(`Login failed: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login failed: No user data received');
        setIsLoading(false);
        return;
      }

      console.log('✅ LOGIN: Login successful for user:', data.user.email);

      // Store auth token and user info in localStorage
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        username: data.user.email,
        lastLogin: new Date().toISOString()
      }));
      
      console.log('✅ LOGIN: Redirecting to dashboard...');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error occurred during login. Please check your connection and try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-white/70">Access the administrative dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-400 disabled:to-amber-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white/80 transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;