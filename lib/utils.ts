import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date for display
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Converts an error object to a user-friendly format
 */
export function formatErrors(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.response?.data?.message) {
    return Array.isArray(error.response.data.message)
      ? error.response.data.message.join('. ')
      : error.response.data.message;
  }
  
  return 'An unexpected error occurred';
}
