import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { googleLogin, linkedinLogin } from '../../services/authService';
import { useEffect } from 'react';

interface SocialAuthButtonsProps {
  mode?: 'login' | 'signup';
  role?: string | null;
  formData?: any;
  onError?: (msg: string) => void;
}

export function SocialAuthButtons({ mode = 'login', role, formData, onError }: SocialAuthButtonsProps) {
  const { login } = useAuth();
  const actionText = mode === 'signup' ? 'Sign up' : 'Continue';

  // LinkedIn Configuration
  const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
  const LINKEDIN_REDIRECT_URI = `${window.location.origin}/auth/linkedin/callback`;
  const LINKEDIN_SCOPE = 'openid profile email';

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const payload = {
          token: tokenResponse.access_token,
          role: role || undefined,
          militaryBranch: formData?.militaryBranch,
          companyName: formData?.companyName
        };
        const user = await googleLogin(payload);
        login(user);
      } catch (err: any) {
        console.error('Google Auth Failed:', err);
        const msg = err.response?.data?.message || 'Google Login Failed';
        if (onError) onError(msg);
        else alert(msg);
      }
    },
    onError: () => {
      if (onError) onError('Google Login Failed');
      else alert('Google Login Failed');
    }
  });

  // Handle LinkedIn PostMessage Response
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'LINKEDIN_CODE') {
        try {
          const payload = {
            code: event.data.code,
            redirectUri: LINKEDIN_REDIRECT_URI,
            role: role || undefined,
            militaryBranch: formData?.militaryBranch,
            companyName: formData?.companyName
          };
          const user = await linkedinLogin(payload);
          login(user);
        } catch (err: any) {
          console.error('LinkedIn Auth Failed:', err);
          const msg = err.response?.data?.message || 'LinkedIn Login Failed';
          if (onError) onError(msg);
          else alert(msg);
        }
      } else if (event.data.type === 'LINKEDIN_ERROR') {
        if (onError) onError('LinkedIn Login Cancelled or Failed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [role, formData, login, onError, LINKEDIN_REDIRECT_URI]);

  const handleLinkedInClick = () => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CLIENT_ID,
      redirect_uri: LINKEDIN_REDIRECT_URI,
      scope: LINKEDIN_SCOPE,
    });

    const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    
    // Open popup
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      url, 
      'LinkedIn', 
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => loginGoogle()}
        className="w-full flex items-center justify-center px-4 py-3 border border-neutral-light rounded-lg shadow-sm bg-white text-sm font-medium text-neutral-dark hover:bg-neutral-light/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {actionText} with Google
      </button>

      <button
        type="button"
        onClick={handleLinkedInClick}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0077B5] hover:bg-[#006097] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5] transition-colors"
      >
        <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        {actionText} with LinkedIn
      </button>
    </div>
  );
}
