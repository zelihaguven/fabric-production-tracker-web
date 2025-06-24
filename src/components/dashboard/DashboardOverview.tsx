import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Package2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [fabricStatuses, setFabricStatuses] = useState<any[]>([]);
  const [criticalStocks, setCriticalStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

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
        
        // Eğer minimum stok seviyesi belirtilmişse
        if (minLevel !== null && minLevel > 0) {
          return currentStock <= minLevel;
        }
        
        // Eğer minimum stok seviyesi belirtilmemişse, stok 0 ise kritik sayalım
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
        };
      }) || [];

      setCriticalStocks(critical);
      console.log('Critical stocks updated:', critical);
    } catch (error) {
      console.error('Error fetching critical stocks:', error);
      throw error;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Package2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'good':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
      
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Kumaş Durumları
        </h4>
        <div className="space-y-3">
          {fabricStatuses.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">{item.step}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                {item.count} ürün
              </span>
            </div>
          ))}
        </div>
      </div>

      {criticalStocks.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Kritik Stok Durumu
          </h4>
          <div className="space-y-3">
            {criticalStocks.map((stock, index) => {
              const progressPercentage = stock.minimum > 0 ? (stock.level / stock.minimum) * 100 : 0;

              return (
                <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(stock.status)}
                      <span className="text-sm font-medium text-gray-700">{stock.item}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {stock.level}/{stock.minimum || 'Min. belirsiz'} adet
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stock.status)}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {criticalStocks.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-gray-600">Tüm stoklar yeterli seviyede</p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
