'use client';

import { Toaster, ToastOptions } from 'react-hot-toast';

export const notificationStyles: ToastOptions = {
  duration: 3000,
  position: 'bottom-right',
  style: {
    background: '#F9F9F9',
    color: 'black',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '350px',
    padding: '12px 16px',
  },
  iconTheme: {
    primary: '#4CAF50',
    secondary: 'white',
  },
};

export function NotificationProvider() {
  return <Toaster toastOptions={notificationStyles} />;
}

export function successNotification(message: string) {
  return {
    ...notificationStyles,
    message,
    type: 'success',
  };
}

export function errorNotification(message: string) {
  return {
    ...notificationStyles,
    message,
    type: 'error',
  };
}
