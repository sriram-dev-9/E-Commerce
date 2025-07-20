import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to get the full image URL from backend
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder-image.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.andramrut.in';
  
  // If it starts with /media/, construct the full URL
  if (imagePath.startsWith('/media/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // If it starts with media/ (without leading slash), add the slash
  if (imagePath.startsWith('media/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // If it's just a relative path, assume it's in media/products/
  return `${baseUrl}/media/products/${imagePath}`;
}
