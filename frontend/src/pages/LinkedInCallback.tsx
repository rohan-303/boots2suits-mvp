import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function LinkedInCallback() {
  useEffect(() => {
    // Get the authorization code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (window.opener) {
      if (code) {
        // Send the code back to the main window
        window.opener.postMessage(
          { type: 'LINKEDIN_CODE', code },
          window.location.origin
        );
      } else if (error) {
        window.opener.postMessage(
          { type: 'LINKEDIN_ERROR', error },
          window.location.origin
        );
      }
      // Close this popup
      window.close();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="h-8 w-8 text-[#0077B5] animate-spin mb-4" />
      <p className="text-gray-600">Authenticating with LinkedIn...</p>
    </div>
  );
}
