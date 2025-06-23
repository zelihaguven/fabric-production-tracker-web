
import React from 'react';
import { TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Toplam Sipariş',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: CheckCircle,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Aktif Üretim',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Stok Uyarıları',
      value: '23',
      change: '-8%',
      changeType: 'decrease',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Tamamlanan',
      value: '1,158',
      change: '+18%',
      changeType: 'increase',
      icon: Package,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
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
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                stat.changeType === 'increase' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {stat.change}
              </span>
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
