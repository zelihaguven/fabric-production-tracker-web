
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductionChart = () => {
  const data = [
    { name: 'Pzt', beklenen: 120, uretilen: 115, defo: 5 },
    { name: 'Sal', beklenen: 140, uretilen: 135, defo: 8 },
    { name: 'Çar', beklenen: 160, uretilen: 158, defo: 3 },
    { name: 'Per', beklenen: 180, uretilen: 175, defo: 7 },
    { name: 'Cum', beklenen: 200, uretilen: 195, defo: 6 },
    { name: 'Cmt', beklenen: 150, uretilen: 148, defo: 4 },
    { name: 'Paz', beklenen: 100, uretilen: 98, defo: 2 }
  ];

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
