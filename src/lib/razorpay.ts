// lib/razorpay.ts
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  order_id: number;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order?: any;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
      on(event: string, callback: () => void): void;
    };
  }
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createPaymentOrder = async (shippingAddress: string): Promise<CreatePaymentOrderResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
  const response = await fetch(`${baseUrl}/api/orders/create-payment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      shipping_address: shippingAddress,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create payment order');
  }

  return response.json();
};

export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<VerifyPaymentResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
  const response = await fetch(`${baseUrl}/api/orders/verify-payment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Payment verification failed');
  }

  return response.json();
};

export const openRazorpayCheckout = async (options: RazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpay();
  
  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// High-level function to initiate Razorpay payment
export const initiateRazorpayPayment = async (
  paymentOrder: CreatePaymentOrderResponse,
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  onSuccess: (orderId: number) => void,
  onFailure: (error: string) => void
): Promise<void> => {
  try {
    const options: RazorpayOptions = {
      key: paymentOrder.key_id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'AndrAmrut Naturals',
      description: 'Every Taste Has A Story',
      order_id: paymentOrder.razorpay_order_id,
      handler: async (response: RazorpayResponse) => {
        try {
          // Verify payment with backend
          const verificationResult = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verificationResult.success) {
            onSuccess(paymentOrder.order_id);
          } else {
            onFailure(verificationResult.message || 'Payment verification failed');
          }
        } catch (error: any) {
          onFailure(handlePaymentError(error));
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: RAZORPAY_CONFIG.theme,
      modal: {
        ondismiss: () => {
          onFailure('Payment was cancelled by user');
        }
      }
    };

    await openRazorpayCheckout(options);
  } catch (error: any) {
    onFailure(handlePaymentError(error));
  }
};

// Utility function to format amount for Razorpay (in paisa)
export const formatAmountForRazorpay = (amount: number): number => {
  return Math.round(amount * 100);
};

// Utility function to format amount for display (in rupees)
export const formatAmountForDisplay = (amount: number): string => {
  return `₹${(amount / 100).toFixed(2)}`;
};

// Helper function to get access token
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Error handling utility
export const handlePaymentError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred during payment processing';
};

// Payment status checker
export const checkPaymentStatus = async (orderId: string): Promise<any> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
  const response = await fetch(`${baseUrl}/api/orders/${orderId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to check payment status');
  }

  return response.json();
};

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  theme: {
    color: '#10B981', // Green theme color for AndrAmrut Naturals
  },
  modal: {
    escape: false,
    backdropclose: false,
  },
};

// Payment methods supported
export const SUPPORTED_PAYMENT_METHODS = {
  card: true,
  netbanking: true,
  wallet: true,
  upi: true,
  emi: false, // Can be enabled based on business requirements
};

// Currency configuration
export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  decimals: 2,
};

// Test mode configuration (should be moved to environment variables in production)
export const isTestMode = process.env.NODE_ENV !== 'production';

// Razorpay key configuration
export const getRazorpayKey = (): string => {
  return isTestMode 
    ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY || ''
    : process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY || '';
};
