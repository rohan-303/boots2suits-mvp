import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Requirements Logic
  const hasMinLength = password.length >= 8 && password.length <= 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const specialCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const hasTwoSpecial = specialCount >= 2;

  const isValid = hasMinLength && hasTwoSpecial && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await resetPassword(password, token);
      // Automatically login the user with the returned token
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again or request a new link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary-dark text-center">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-gray">
            Create a new password for your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark">
                Create your password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={`appearance-none block w-full px-3 py-3 border ${!hasMinLength && password.length > 0 ? 'border-red-300 ring-red-200' : 'border-neutral-light'} placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-neutral-dark">Password must:</p>
            
            <div className="flex items-center text-sm">
              {hasMinLength ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
              ) : (
                <div className={`w-4 h-4 rounded-full border mr-2 shrink-0 ${password.length > 0 ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}>
                  {password.length > 0 && <X className="w-3 h-3 text-red-500 m-auto" />}
                </div>
              )}
              <span className={hasMinLength ? 'text-neutral-dark' : 'text-neutral-gray'}>
                Be between 8 and 16 characters
              </span>
            </div>

            <div className="flex items-start text-sm">
               {hasTwoSpecial ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
              ) : (
                <div className={`w-4 h-4 rounded-full border mr-2 shrink-0 mt-0.5 ${password.length > 0 ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}>
                   {password.length > 0 && <X className="w-3 h-3 text-red-500 m-auto" />}
                </div>
              )}
              <div className="flex-1">
                <span className={hasTwoSpecial ? 'text-neutral-dark' : 'text-neutral-gray'}>
                  Include at least two of the following:
                </span>
                <ul className="mt-1 ml-1 text-xs text-neutral-gray space-y-1 list-disc list-inside">
                  <li className={hasUpper ? 'text-green-600 font-medium' : ''}>An uppercase character</li>
                  <li className={hasLower ? 'text-green-600 font-medium' : ''}>A lowercase character</li>
                  <li className={hasNumber ? 'text-green-600 font-medium' : ''}>A number</li>
                  <li className={hasSpecial ? 'text-green-600 font-medium' : ''}>A special character</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-dark">
                Confirm your password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              className="appearance-none block w-full px-3 py-3 border border-neutral-light placeholder-neutral-gray text-neutral-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && password !== confirmPassword && (
               <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Activate Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
