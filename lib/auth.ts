import { NextRequest, NextResponse } from 'next/server';

// Simple interface for JWT payload (client-side only)
interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Save token after login
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

// Get current token
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Remove token (logout)
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Also remove cookie
    document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
  }
}

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
}

// Parse JWT token (client-side only, for UI purposes)
export function parseJwt(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token', error);
    return null;
  }
}

// Check if token is expired (client-side only)
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Check token expiration and clear if expired
export function checkAndClearExpiredToken(): boolean {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    removeToken();
    return true; // token was expired and removed
  }
  return false; // token is valid or doesn't exist
}

// Middleware to protect routes
export async function authMiddleware(req: NextRequest) {
  // Get token from local storage (this runs in the client)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      const payload = await parseJwt(token);
      if (!payload) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
} 