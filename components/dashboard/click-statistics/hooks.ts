import { useState, useEffect, useCallback } from 'react';
import { statisticsAPI } from '@/lib/api/statistics';
import { ClickStatistic, UniqueClickStatistic } from '@/lib/api/statistics';

// Hook para obtener estadísticas de clicks únicos
export function useUniqueClickStats() {
  const [data, setData] = useState<UniqueClickStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const uniqueClicksData = await statisticsAPI.getMyUniqueClicks();
        setData(uniqueClicksData);
      } catch (err: any) {
        console.error('Error fetching unique click stats', err);
        setError(err.response?.data?.message || 'Error loading unique click statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Hook para obtener clicks por texto
export function useClicksByText() {
  const [data, setData] = useState<ClickStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (text: string, personalToken: string) => {
    if (!text || !personalToken) return;
    
    try {
      setLoading(true);
      const clicksData = await statisticsAPI.getClicksByText(text, personalToken);
      setData(clicksData);
    } catch (err: any) {
      console.error('Error fetching clicks by text', err);
      setError(err.response?.data?.message || 'Error loading clicks by text');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
} 