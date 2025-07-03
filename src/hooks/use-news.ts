import { useState, useEffect } from 'react';
import { TransformedNews } from '@/types/newsapi';

interface UseNewsOptions {
  category?: string;
  limit?: number;
  refreshInterval?: number; // in milliseconds
}

interface UseNewsReturn {
  news: TransformedNews[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const { category, limit = 20, refreshInterval } = options;
  
  const [news, setNews] = useState<TransformedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setError(null);
      
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/news/latest?${params.toString()}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setNews(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch news');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    await fetchNews();
  };

  useEffect(() => {
    fetchNews();
    
    // Set up refresh interval if specified
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(fetchNews, refreshInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [category, limit, refreshInterval]);

  return {
    news,
    loading,
    error,
    refresh
  };
} 