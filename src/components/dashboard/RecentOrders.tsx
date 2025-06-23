
import React from 'react';
import { Eye, Edit2, Calendar, User, Package } from 'lucide-react';

const RecentOrders = () => {
  const recentOrders = [
    {
      id: 'SIP-2024-001',
      model: 'Klasik T-Shirt',
      brand: 'X Markası',
      quantity: 500,
      status: 'Dikime Başlandı',
      progress: 65,
      dueDate: '2024-01-15',
      customer: 'ABC Tekstil'
    },
    {
      id: 'SIP-2024-002',
      model: 'Polo Yaka',
      brand: 'Y Markası',
      quantity: 300,
      status: 'Kumaş Kesildi',
      progress: 40,
      dueDate: '2024-01-20',
      customer: 'DEF Mağazacılık'
    },
    {
      id: 'SIP-2024-003',
      model: 'Kapüşonlu Sweatshirt',
      brand: 'Z Markası',
      quantity: 200,
      status: 'Paketlendi',
      progress: 100,
      dueDate: '2024-01-12',
      customer: 'GHI İthalat'
    },
    {
      id: 'SIP-2024-004',
      model: 'Crop Top',
      brand: 'W Markası',
      quantity: 750,
      status: 'Kumaş İstendi',
      progress: 10,
      dueDate: '2024-01-25',
      customer: 'JKL Fashion'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Kumaş İstendi':
        return 'text-blue-700 bg-blue-100';
      case 'Kumaş Kesildi':
        return 'text-purple-700 bg-purple-100';
      case 'Dikime Başlandı':
        return 'text-orange-700 bg-orange-100';
      case 'Paketlendi':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Son Siparişler</h3>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium">
          Tüm Siparişler
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Sipariş</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Model & Marka</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Müşteri</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Miktar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durum</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">İlerleme</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Termin</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-semibold text-gray-900">{order.id}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{order.model}</div>
                  <div className="text-sm text-gray-500">{order.brand}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{order.customer}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">{order.quantity} adet</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(order.progress)}`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{order.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{order.dueDate}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
