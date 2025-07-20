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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/create-payment/`, {
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
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; order_id?: number; message?: string }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/verify-payment/`, {
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

export const handlePaymentFailure = async (razorpay_order_id: string, error: string): Promise<void> => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/payment-failure/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        razorpay_order_id,
        error,
      }),
    });
  } catch (error) {
    console.error('Failed to report payment failure:', error);
  }
};

export const initiateRazorpayPayment = async (
  paymentOrder: CreatePaymentOrderResponse,
  shippingAddress: any,
  onSuccess: (orderId: number) => void,
  onFailure: (error: string) => void
): Promise<void> => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    onFailure('Failed to load Razorpay SDK');
    return;
  }

  const options: RazorpayOptions = {
    key: paymentOrder.key_id,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
    name: 'AndrAmrut Naturals',
    description: 'Payment for your order',
    order_id: paymentOrder.razorpay_order_id,
    handler: async (response: RazorpayResponse) => {
      try {
        const verification = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verification.success && verification.order_id) {
          onSuccess(verification.order_id);
        } else {
          onFailure('Payment verification failed');
        }
      } catch (error: any) {
        onFailure(error.message || 'Payment verification failed');
      }
    },
    prefill: {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      email: shippingAddress.email,
      contact: shippingAddress.phone || '',
    },
    theme: {
      color: '#8B4513', // Brown color matching your theme
    },
    modal: {
      ondismiss: () => {
        handlePaymentFailure(paymentOrder.razorpay_order_id, 'Payment cancelled by user');
        onFailure('Payment was cancelled');
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
