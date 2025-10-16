'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'sonner';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await api.post('/login', { email, password });
      
      if (res.data.success) {
        toast.success('Login successful');
        router.push('/projects');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 ">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className=" w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className=" w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 underline"
                >
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
}