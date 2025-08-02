'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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
    onGoogleSignIn: (response: any) => void;
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  className = '',
  buttonText = 'Continue with Google'
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google OAuth Client ID
  const GOOGLE_CLIENT_ID = '556195792175-ndbbiqa22pseuff14o5mji06jngln86s.apps.googleusercontent.com';

  const handleGoogleResponse = async (response: any) => {
    console.log('Google response received:', response);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending to backend:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/google/`);
      // Send the Google token to your backend
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
        }),
      });

      const data = await backendResponse.json();
      console.log('Backend response:', data);

      if (data.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (onSuccess) {
          onSuccess();
        }
        
        // Reload page to update auth state
        window.location.reload();
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Full error object:', err);
      const errorMessage = err.message || 'Google authentication failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      console.error('Google Auth Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGoogleAuth = () => {
    console.log('Initializing Google Auth...');
    if (typeof window !== 'undefined' && window.google) {
      console.log('Google available, initializing with client ID:', GOOGLE_CLIENT_ID);
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Disable FedCM for now
        });
        console.log('Google Auth initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
      }
    } else {
      console.log('Google not available yet');
    }
  };

  const renderGoogleButton = (element: HTMLElement) => {
    console.log('Rendering Google button...');
    if (typeof window !== 'undefined' && window.google && element) {
      try {
        window.google.accounts.id.renderButton(element, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '100%',
        });
        console.log('Google button rendered successfully');
      } catch (error) {
        console.error('Error rendering Google button:', error);
      }
    } else {
      console.log('Cannot render Google button - Google not available or no element');
    }
  };

  const signInWithGoogle = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available');
      if (onError) {
        onError('Google Sign-In is not available');
      }
    }
  };

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      if (document.getElementById('google-signin-script')) {
        // Script already loaded, check if Google is available
        if (window.google?.accounts?.id) {
          initializeGoogleAuth();
          // Small delay to ensure Google is fully loaded
          setTimeout(() => {
            if (buttonRef.current) {
              renderGoogleButton(buttonRef.current);
            }
          }, 100);
        } else {
          // Wait for Google to be available
          setTimeout(loadGoogleScript, 100);
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait for window.google to be fully available
        const checkGoogle = () => {
          if (window.google?.accounts?.id) {
            initializeGoogleAuth();
            // Small delay to ensure Google is fully loaded
            setTimeout(() => {
              if (buttonRef.current) {
                renderGoogleButton(buttonRef.current);
              }
            }, 100);
          } else {
            setTimeout(checkGoogle, 50);
          }
        };
        checkGoogle();
      };
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();

    // Handle success/error callbacks
    if (error && onError) {
      onError(error);
    }
  }, []);

  // Fallback button for when Google SDK is not loaded
  const handleFallbackClick = () => {
    signInWithGoogle();
  };

  if (isLoading) {
    return (
      <Button disabled className={`w-full ${className}`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Signing in...
      </Button>
    );
  }

  return (
    <div className="w-full">
      {/* Google rendered button container */}
      <div ref={buttonRef} className="w-full" />
      
      {/* Fallback button if Google button doesn't render */}
      <Button
        type="button"
        variant="outline"
        className={`w-full mt-2 ${className}`}
        onClick={handleFallbackClick}
        disabled={isLoading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {buttonText}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 mt-2 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
