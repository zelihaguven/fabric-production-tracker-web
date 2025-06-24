
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface FabricStatus {
  step: string;
  count: number;
  color: string;
}

export interface CriticalStock {
  item: string;
  level: number;
  minimum: number;
  status: 'critical' | 'warning' | 'good';
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [fabricStatuses, setFabricStatuses] = useState<FabricStatus[]>([]);
  const [criticalStocks, setCriticalStocks] = useState<CriticalStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductionData = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('fabric_status')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Production data error:', error);
        throw error;
      }

      const statusCounts = {
        'kumaş sipariş edildi': 0,
        'kumaş geldi': 0,
        'kumaş kesime girdi': 0,
        'kumaş hazır': 0
      };

      products?.forEach(product => {
        if (product.fabric_status && statusCounts.hasOwnProperty(product.fabric_status)) {
          statusCounts[product.fabric_status as keyof typeof statusCounts]++;
        }
      });

      const statusArray = [
        { step: 'Kumaş Sipariş Edildi', count: statusCounts['kumaş sipariş edildi'], color: 'text-blue-600 bg-blue-100' },
        { step: 'Kumaş Geldi', count: statusCounts['kumaş geldi'], color: 'text-green-600 bg-green-100' },
        { step: 'Kumaş Kesime Girdi', count: statusCounts['kumaş kesime girdi'], color: 'text-purple-600 bg-purple-100' },
        { step: 'Kumaş Hazır', count: statusCounts['kumaş hazır'], color: 'text-orange-600 bg-orange-100' }
      ];

      setFabricStatuses(statusArray);
      console.log('Production data updated:', statusArray);
    } catch (error) {
      console.error('Error fetching production data:', error);
      throw error;
    }
  };

  const fetchCriticalStocks = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('name, model, stock_quantity, min_stock_level')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Critical stocks error:', error);
        throw error;
      }

      console.log('All products for critical stock check:', products);

      const critical = products?.filter(product => {
        const currentStock = product.stock_quantity || 0;
        const minLevel = product.min_stock_level;
        
        if (minLevel !== null && minLevel > 0) {
          return currentStock <= minLevel;
        }
        
        return currentStock === 0;
      }).slice(0, 5).map(product => {
        const currentStock = product.stock_quantity || 0;
        const minLevel = product.min_stock_level || 0;
        
        return {
          item: `${product.name}${product.model ? ` - ${product.model}` : ''}`,
          level: currentStock,
          minimum: minLevel,
          status: currentStock === 0 ? 'critical' : 
                  currentStock <= minLevel * 0.5 ? 'critical' : 'warning'
        } as CriticalStock;
      }) || [];

      setCriticalStocks(critical);
      console.log('Critical stocks updated:', critical);
    } catch (error) {
      console.error('Error fetching critical stocks:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard data for user:', user?.id);

      await Promise.all([
        fetchProductionData(),
        fetchCriticalStocks()
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    fabricStatuses,
    criticalStocks,
    loading,
    error,
    refetch: fetchData
  };
};
