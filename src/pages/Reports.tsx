
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Reports = () => {
  const { user } = useAuth();
  const [fabricStatusData, setFabricStatusData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [productionSummary, setProductionSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user]);

  const fetchReportData = async () => {
    try {
      // Kumaş durumu raporu
      const { data: products } = await supabase
        .from('products')
        .select('fabric_status, stock_quantity')
        .eq('user_id', user?.id);

      const fabricStatusCounts = {
        'kumaş sipariş edildi': 0,
        'kumaş geldi': 0,
        'kumaş kesime girdi': 0,
        'kumaş hazır': 0
      };

      products?.forEach(product => {
        if (product.fabric_status && fabricStatusCounts.hasOwnProperty(product.fabric_status)) {
          fabricStatusCounts[product.fabric_status as keyof typeof fabricStatusCounts]++;
        }
      });

      const fabricData = Object.entries(fabricStatusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
      }));

      setFabricStatusData(fabricData);

      // Sipariş durumu raporu
      const { data: orders } = await supabase
        .from('orders')
        .select('status')
        .eq('user_id', user?.id);

      const orderStatusCounts: Record<string, number> = {};
      orders?.forEach(order => {
        const status = order.status || 'pending';
        orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
      });

      const orderData = Object.entries(orderStatusCounts).map(([status, count]) => ({
        name: status === 'pending' ? 'Beklemede' : 
              status === 'completed' ? 'Tamamlandı' : 
              status === 'in_progress' ? 'Devam Ediyor' : status,
        value: count
      }));

      setOrderStatusData(orderData);

      // Üretim özeti
      const { data: productionData } = await supabase
        .from('products')
        .select('name, model, stock_quantity, min_stock_level, fabric_status')
        .eq('user_id', user?.id)
        .limit(10);

      const productionSummaryData = productionData?.map(product => ({
        name: `${product.name} ${product.model ? `- ${product.model}` : ''}`,
        siparis: product.stock_quantity || 0,
        uretim: product.min_stock_level || 0,
        durum: product.fabric_status || 'Belirtilmemiş'
      })) || [];

      setProductionSummary(productionSummaryData);

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Raporlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Raporlar
              </h1>
              <p className="text-gray-600">
                Üretim ve sipariş durumlarınızın detaylı analizini görüntüleyin
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Kumaş Durumu Raporu */}
              <Card>
                <CardHeader>
                  <CardTitle>Kumaş Durumu Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={fabricStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {fabricStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sipariş Durumu Raporu */}
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Durumu Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Üretim Özeti */}
            <Card>
              <CardHeader>
                <CardTitle>Üretim Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={productionSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="siparis" fill="#8884d8" name="Sipariş Adedi" />
                    <Bar dataKey="uretim" fill="#82ca9d" name="Üretim Adedi" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
