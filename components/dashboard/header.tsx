import { useState } from 'react';
import { useAuthContext } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DashboardHeader() {
  const { user, logout } = useAuthContext();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    // No need to set loggingOut to false as we will be redirected
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          Click Statistics
        </Link>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm">
              Hello, <span className="font-semibold">{user.name}</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </header>
  );
} 