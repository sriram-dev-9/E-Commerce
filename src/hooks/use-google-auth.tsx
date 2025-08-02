import { useState, useCallback } from 'react';

// Declare global types for Google OAuth
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export interface GoogleUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  tokens: {
    access: string;
    refresh: string;
  };
  user: GoogleUser;
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google OAuth Client ID
  const GOOGLE_CLIENT_ID = '556195792175-ndbbiqa22pseuff14o5mji06jngln86s.apps.googleusercontent.com';

  const initializeGoogleAuth = useCallback(() => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        console.log('Google Auth initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        setError('Failed to initialize Google Sign-In');
      }
    } else {
      console.warn('Google Sign-In not available');
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send the Google token to your backend
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
        }),
      });

      const data = await backendResponse.json();

      if (data.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Reload page to update auth state
        window.location.reload();
        
        return data as GoogleAuthResponse;
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Google authentication failed';
      setError(errorMessage);
      console.error('Google Auth Error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available');
    }
  }, []);

  const renderGoogleButton = useCallback((element: HTMLElement, options = {}) => {
    if (typeof window !== 'undefined' && window.google && element) {
      window.google.accounts.id.renderButton(element, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: '100%',
        ...options,
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    window.location.href = '/';
  }, []);

  return {
    isLoading,
    error,
    initializeGoogleAuth,
    signInWithGoogle,
    renderGoogleButton,
    logout,
    GOOGLE_CLIENT_ID,
  };
};
