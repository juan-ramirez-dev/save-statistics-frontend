import { useState, useEffect } from 'react';
import { useAuthContext } from '@/lib/auth-provider';
import { statisticsAPI } from '@/lib/api/statistics';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClickStatistic } from '@/lib/api/statistics';

export function ClickStatistics() {
  const { user } = useAuthContext();
  const [clickStats, setClickStats] = useState<ClickStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar estadísticas detalladas de clics
        const clicksData = await statisticsAPI.getMyClicks();
        setClickStats(clicksData);
      } catch (err: any) {
        console.error('Error loading data', err);
        setError(err.response?.data?.message || 'Error loading statistics');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const hasData = clickStats.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">No click statistics available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">

      {clickStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Clicks</CardTitle>
            <CardDescription>
              Your latest click records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Text</th>
                    <th className="py-3 px-4 text-left">Created</th>
                    <th className="py-3 px-4 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {clickStats.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.text}</td>
                      <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                      <td className="py-3 px-4">{formatDate(item.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Unique ID (UUID)</CardTitle>
          <CardDescription>
            Use this ID to record clicks without authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="font-mono text-sm break-all">{user?.personalToken}</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            You can use this UUID to record clicks from any application without needing to sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 