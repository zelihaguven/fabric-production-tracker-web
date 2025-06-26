
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Shirt,
  Scissors,
  Tag,
  TrendingUp,
  LogOut,
  User,
  Building2,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { company } = useCompany();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // URL'e göre aktif tab'i belirle
    const path = location.pathname;
    if (path === '/') setActiveTab('dashboard');
    else if (path === '/products') setActiveTab('products');
    else if (path === '/orders') setActiveTab('orders');
    else if (path === '/production') setActiveTab('production');
    else if (path === '/inventory') setActiveTab('inventory');
    else if (path === '/labels') setActiveTab('labels');
    else if (path === '/reports') setActiveTab('reports');
    else if (path === '/analytics') setActiveTab('analytics');
    else if (path === '/settings') setActiveTab('settings');
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', label: 'Ana Panel', icon: Home, path: '/' },
    { id: 'products', label: 'Ürün & Model', icon: Shirt, path: '/products' },
    { id: 'orders', label: 'Sipariş Yönetimi', icon: ShoppingCart, path: '/orders' },
    { id: 'production', label: 'Üretim Takibi', icon: Scissors, path: '/production' },
    { id: 'inventory', label: 'Stok Yönetimi', icon: Package, path: '/inventory' },
    { id: 'labels', label: 'Etiket Takibi', icon: Tag, path: '/labels' },
    { id: 'reports', label: 'Raporlar', icon: BarChart3, path: '/reports' },
    { id: 'analytics', label: 'Analiz', icon: TrendingUp, path: '/analytics' },
    { id: 'settings', label: 'Ayarlar', icon: Settings, path: '/settings' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const copyCompanyCode = () => {
    if (company?.company_code) {
      navigator.clipboard.writeText(company.company_code);
      toast({
        title: "Kopyalandı!",
        description: "Şirket kodu panoya kopyalandı.",
      });
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">StokPro</h2>
            <p className="text-sm text-gray-500">Stok Takip Sistemi</p>
          </div>
        </div>
      </div>
      
      {/* Şirket Bilgisi */}
      {company && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {company.name}
              </p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-600">Kod: {company.company_code}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={copyCompanyCode}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Kullanıcı Bilgisi */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">Aktif kullanıcı</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-3 right-3 space-y-3">
        {/* Çıkış Butonu */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Çıkış Yap
        </Button>
        
        {/* Sistem Durumu */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-1">Sistem Durumu</h3>
          <p className="text-sm opacity-90">Tüm modüller aktif</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
