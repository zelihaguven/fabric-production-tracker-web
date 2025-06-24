
import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const StatsCards = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeProduction: 0,
    stockAlerts: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

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

      // Stok uyarıları (minimum stok seviyesinin altındaki ürünler)
      const { data: lowStockProducts, error: stockError } = await supabase
        .from('products')
        .select('stock_quantity, min_stock_level')
        .eq('user_id', user?.id)
        .not('stock_quantity', 'is', null)
        .not('min_stock_level', 'is', null);

      if (stockError) {
        console.error('Stock check error:', stockError);
        throw stockError;
      }

      const stockAlerts = lowStockProducts?.filter(product => 
        product.stock_quantity && product.min_stock_level && 
        product.stock_quantity <= product.min_stock_level
      ).length || 0;

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

      setStats({
        totalOrders: ordersCount || 0,
        activeProduction: activeCount || 0,
        stockAlerts: stockAlerts,
        completedOrders: completedCount || 0
      });

      console.log('Stats updated successfully:', {
        totalOrders: ordersCount || 0,
        activeProduction: activeCount || 0,
        stockAlerts: stockAlerts,
        completedOrders: completedCount || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('İstatistikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders.toString(),
      change: '',
      changeType: 'neutral',
      icon: CheckCircle,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Aktif Üretim',
      value: stats.activeProduction.toString(),
      change: '',
      changeType: 'neutral',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Stok Uyarıları',
      value: stats.stockAlerts.toString(),
      change: '',
      changeType: 'warning',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Tamamlanan',
      value: stats.completedOrders.toString(),
      change: '',
      changeType: 'neutral',
      icon: Package,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {stat.changeType === 'warning' && stat.value !== '0' && (
                <span className="text-sm font-semibold px-2 py-1 rounded-full text-orange-700 bg-orange-100">
                  Dikkat!
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
