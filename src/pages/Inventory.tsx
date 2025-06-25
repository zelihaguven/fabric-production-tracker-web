
import React, { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  model: string | null;
  stock_quantity: number | null;
  min_stock_level: number | null;
  color: string | null;
  ordering_brand: string | null;
  fabric_status: string | null;
}

interface StockSummary {
  totalProducts: number;
  criticalStock: number;
  lowStock: number;
  goodStock: number;
}

const Inventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stockSummary, setStockSummary] = useState<StockSummary>({
    totalProducts: 0,
    criticalStock: 0,
    lowStock: 0,
    goodStock: 0
  });

  useEffect(() => {
    if (user) {
      fetchInventoryData();
    }
  }, [user]);

  const fetchInventoryData = async () => {
    try {
      console.log('Fetching inventory data for user:', user?.id);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          model,
          stock_quantity,
          min_stock_level,
          color,
          ordering_brand,
          fabric_status
        `)
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;

      console.log('Inventory data fetched:', data);
      setProducts(data || []);
      calculateStockSummary(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Hata",
        description: "Stok verileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStockSummary = (products: Product[]) => {
    let criticalStock = 0;
    let lowStock = 0;
    let goodStock = 0;

    products.forEach(product => {
      const currentStock = product.stock_quantity || 0;
      const minLevel = product.min_stock_level;

      if (currentStock === 0) {
        criticalStock++;
      } else if (minLevel !== null && minLevel > 0) {
        if (currentStock <= minLevel) {
          if (currentStock <= minLevel * 0.5) {
            criticalStock++;
          } else {
            lowStock++;
          }
        } else {
          goodStock++;
        }
      } else {
        goodStock++;
      }
    });

    console.log('Stock summary calculated:', { criticalStock, lowStock, goodStock });

    setStockSummary({
      totalProducts: products.length,
      criticalStock,
      lowStock,
      goodStock
    });
  };

  const getStockStatus = (product: Product) => {
    const currentStock = product.stock_quantity || 0;
    const minLevel = product.min_stock_level;

    if (currentStock === 0) {
      return { status: 'critical', label: 'Stok Yok', color: 'bg-red-100 text-red-800' };
    } else if (minLevel !== null && minLevel > 0) {
      if (currentStock <= minLevel * 0.5) {
        return { status: 'critical', label: 'Kritik Seviye', color: 'bg-red-100 text-red-800' };
      } else if (currentStock <= minLevel) {
        return { status: 'low', label: 'Düşük Stok', color: 'bg-orange-100 text-orange-800' };
      }
    }
    return { status: 'good', label: 'Yeterli', color: 'bg-green-100 text-green-800' };
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ordering_brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Stok verileri yükleniyor...</p>
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
                Stok Yönetimi
              </h1>
              <p className="text-gray-600">
                Stok durumunuzu kontrol edin ve yönetin
              </p>
            </div>

            {/* Stock Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
                      <p className="text-2xl font-bold text-gray-900">{stockSummary.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Kritik Stok</p>
                      <p className="text-2xl font-bold text-red-600">{stockSummary.criticalStock}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Düşük Stok</p>
                      <p className="text-2xl font-bold text-orange-600">{stockSummary.lowStock}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Yeterli Stok</p>
                      <p className="text-2xl font-bold text-green-600">{stockSummary.goodStock}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Stok Detayları</span>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Ürün ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'Arama kriterlerine uygun ürün bulunamadı.' : 'Henüz ürün eklenmemiş.'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Renk</TableHead>
                        <TableHead>Marka</TableHead>
                        <TableHead>Mevcut Stok</TableHead>
                        <TableHead>Min. Seviye</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Kumaş Durumu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product);
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.model || '-'}</TableCell>
                            <TableCell>{product.color || '-'}</TableCell>
                            <TableCell>{product.ordering_brand || '-'}</TableCell>
                            <TableCell className="text-center">
                              <span className={`font-semibold ${
                                (product.stock_quantity || 0) === 0 ? 'text-red-600' : 
                                (product.min_stock_level && (product.stock_quantity || 0) <= product.min_stock_level) ? 'text-orange-600' : 
                                'text-green-600'
                              }`}>
                                {product.stock_quantity || 0}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">{product.min_stock_level || '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStockIcon(stockStatus.status)}
                                <Badge className={stockStatus.color}>
                                  {stockStatus.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.fabric_status ? (
                                <Badge variant="outline">
                                  {product.fabric_status.charAt(0).toUpperCase() + product.fabric_status.slice(1)}
                                </Badge>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
