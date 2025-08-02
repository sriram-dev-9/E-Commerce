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
      
      {error && (
        <p className="text-sm text-red-600 mt-2 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
