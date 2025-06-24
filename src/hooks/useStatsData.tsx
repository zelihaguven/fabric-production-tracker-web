
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface StatsData {
  totalOrders: number;
  activeProduction: number;
  stockAlerts: number;
  completedOrders: number;
}

export const useStatsData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalOrders: 0,
    activeProduction: 0,
    stockAlerts: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching stats for user:', user?.id);

      // Toplam sipariş sayısı
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      if (ordersError) {
        console.error('Orders count error:', ordersError);
        throw ordersError;
      }

      // Aktif üretim (devam eden siparişler)
      const { count: activeCount, error: activeError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .neq('status', 'completed');

      if (activeError) {
        console.error('Active orders error:', activeError);
        throw activeError;
      }

      // Stok uyarıları - düzeltilmiş hesaplama
      const { data: allProducts, error: stockError } = await supabase
        .from('products')
        .select('name, stock_quantity, min_stock_level')
        .eq('user_id', user?.id);

      if (stockError) {
        console.error('Stock check error:', stockError);
        throw stockError;
      }

      console.log('All products for stock check:', allProducts);

      // Stok uyarısı hesaplama mantığını düzelt
      let stockAlerts = 0;
      if (allProducts) {
        stockAlerts = allProducts.filter(product => {
          // Eğer minimum stok seviyesi belirtilmişse
          if (product.min_stock_level !== null && product.min_stock_level > 0) {
            const currentStock = product.stock_quantity || 0;
            const minLevel = product.min_stock_level;
            const isLowStock = currentStock <= minLevel;
            
            if (isLowStock) {
              console.log(`Low stock alert for ${product.name}: ${currentStock} <= ${minLevel}`);
            }
            
            return isLowStock;
          }
          
          // Eğer minimum stok seviyesi belirtilmemişse, stok 0 ise uyar
          if (product.min_stock_level === null || product.min_stock_level === 0) {
            const currentStock = product.stock_quantity || 0;
            const isOutOfStock = currentStock === 0;
            
            if (isOutOfStock) {
              console.log(`Out of stock alert for ${product.name}: ${currentStock}`);
            }
            
            return isOutOfStock;
          }
          
          return false;
        }).length;
      }

      console.log('Total stock alerts calculated:', stockAlerts);

      // Tamamlanan siparişler
      const { count: completedCount, error: completedError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      if (completedError) {
        console.error('Completed orders error:', completedError);
        throw completedError;
      }

      const newStats = {
        totalOrders: ordersCount || 0,
        activeProduction: activeCount || 0,
        stockAlerts: stockAlerts,
        completedOrders: completedCount || 0
      };

      setStats(newStats);

      console.log('Stats updated successfully:', newStats);

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('İstatistikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
