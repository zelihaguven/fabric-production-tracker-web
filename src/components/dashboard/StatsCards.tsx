
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

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Toplam sipariş sayısı
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Aktif üretim (devam eden siparişler)
      const { count: activeCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .neq('status', 'completed');

      // Stok uyarıları (minimum stok seviyesinin altındaki ürünler)
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('stock_quantity, min_stock_level')
        .eq('user_id', user?.id)
        .not('stock_quantity', 'is', null)
        .not('min_stock_level', 'is', null);

      const stockAlerts = lowStockProducts?.filter(product => 
        product.stock_quantity && product.min_stock_level && 
        product.stock_quantity <= product.min_stock_level
      ).length || 0;

      // Tamamlanan siparişler
      const { count: completedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      setStats({
        totalOrders: ordersCount || 0,
        activeProduction: activeCount || 0,
        stockAlerts: stockAlerts,
        completedOrders: completedCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
