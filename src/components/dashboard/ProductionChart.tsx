
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProductionData {
  name: string;
  beklenen: number;
  uretilen: number;
  defo: number;
}

const ProductionChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProductionData();
    }
  }, [user]);

  const fetchProductionData = async () => {
    try {
      // Son 7 günün üretim verilerini al
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);

      const { data: productionRecords, error } = await supabase
        .from('production_records')
        .select('*')
        .eq('user_id', user?.id)
        .gte('production_date', startDate.toISOString())
        .lte('production_date', endDate.toISOString())
        .order('production_date', { ascending: true });

      if (error) {
        console.error('Error fetching production data:', error);
        return;
      }

      // Günlere göre verileri grupla
      const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      const weekData: ProductionData[] = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayName = weekDays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1];

        const dayRecords = productionRecords?.filter(record => {
          const recordDate = new Date(record.production_date);
          return recordDate.toDateString() === currentDate.toDateString();
        }) || [];

        const uretilen = dayRecords.reduce((sum, record) => sum + (record.quantity_produced || 0), 0);
        const defo = dayRecords.reduce((sum, record) => sum + (record.defective_quantity || 0), 0);
        
        // Beklenen üretimi basit bir hesaplama ile belirleyelim (günlük ortalama hedef)
        const beklenen = Math.max(uretilen + defo, uretilen * 1.1); // %10 buffer veya gerçek üretim

        weekData.push({
          name: dayName,
          beklenen: Math.round(beklenen),
          uretilen,
          defo
        });
      }

      setData(weekData);
    } catch (error) {
      console.error('Error processing production data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center h-80">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Haftalık Üretim Performansı</h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Beklenen</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Üretilen</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span>Defolu</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="beklenen" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="uretilen" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="defo" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;
