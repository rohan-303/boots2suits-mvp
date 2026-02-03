
interface SocialAuthButtonsProps {
  mode?: 'login' | 'signup';
}

export function SocialAuthButtons({ mode = 'login' }: SocialAuthButtonsProps) {
  const actionText = mode === 'signup' ? 'Sign up' : 'Continue';

  const handleGoogleClick = () => {
    // TODO: Implement Google Auth
    console.log('Google Auth Clicked');
  };

  const handleLinkedInClick = () => {
    // TODO: Implement LinkedIn Auth
    console.log('LinkedIn Auth Clicked');
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleClick}
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
