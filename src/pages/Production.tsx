
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProductionForm from '@/components/ProductionForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductionRecord {
  id: string;
  product_id: string;
  quantity_produced: number;
  defective_quantity: number | null;
  production_date: string;
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  products: {
    name: string;
    model: string | null;
  };
}

interface ProductSummary {
  product_id: string;
  product_name: string;
  product_model: string | null;
  total_produced: number;
  total_defective: number;
  record_count: number;
  records: ProductionRecord[];
}

const Production = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [productSummaries, setProductSummaries] = useState<ProductSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionRecord | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  useEffect(() => {
    if (user) {
      fetchProductions();
    }
  }, [user]);

  const fetchProductions = async () => {
    try {
      const { data, error } = await supabase
        .from('production_records')
        .select(`
          id,
          product_id,
          quantity_produced,
          defective_quantity,
          production_date,
          notes,
          created_by,
          updated_by,
          products (
            name,
            model
          )
        `)
        .eq('user_id', user?.id)
        .order('production_date', { ascending: false });

      if (error) throw error;
      console.log('Fetched production records:', data);
      setProductions(data || []);
      processProductSummaries(data || []);
    } catch (error) {
      console.error('Error fetching productions:', error);
      toast({
        title: "Hata",
        description: "Üretim kayıtları yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processProductSummaries = (productions: ProductionRecord[]) => {
    console.log('Processing summaries for productions:', productions);
    const summaryMap = new Map<string, ProductSummary>();

    productions.forEach(record => {
      const key = record.product_id;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          product_id: record.product_id,
          product_name: record.products?.name || 'Ürün bulunamadı',
          product_model: record.products?.model || null,
          total_produced: 0,
          total_defective: 0,
          record_count: 0,
          records: []
        });
      }

      const summary = summaryMap.get(key)!;
      summary.total_produced += record.quantity_produced;
      summary.total_defective += record.defective_quantity || 0;
      summary.record_count += 1;
      summary.records.push(record);
    });

    // Sort records within each summary by date (newest first)
    summaryMap.forEach(summary => {
      summary.records.sort((a, b) => new Date(b.production_date).getTime() - new Date(a.production_date).getTime());
      console.log(`Product ${summary.product_name} has ${summary.records.length} records:`, summary.records);
    });

    const summariesArray = Array.from(summaryMap.values());
    console.log('Final summaries:', summariesArray);
    setProductSummaries(summariesArray);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu üretim kaydını silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('production_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductions(productions.filter(p => p.id !== id));
      toast({
        title: "Başarılı",
        description: "Üretim kaydı başarıyla silindi.",
      });
      // Refresh data to update summaries
      fetchProductions();
    } catch (error) {
      console.error('Error deleting production:', error);
      toast({
        title: "Hata",
        description: "Üretim kaydı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduction(null);
    fetchProductions();
  };

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const filteredProductions = productions.filter(production =>
    production.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.products?.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSummaries = productSummaries.filter(summary =>
    summary.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.product_model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductDisplayName = (product: { name: string; model: string | null }) => {
    return product.model ? `${product.name} - ${product.model}` : product.name;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
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
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Üretim Takibi
                </h1>
                <p className="text-gray-600">
                  Üretim süreçlerinizi takip edin
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Üretim Kaydı
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Üretim Kayıtları</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === 'summary' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('summary')}
                      >
                        Özet Görünüm
                      </Button>
                      <Button
                        variant={viewMode === 'detailed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('detailed')}
                      >
                        Detaylı Görünüm
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Ürün ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'summary' ? (
                  // Summary view
                  filteredSummaries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Henüz üretim kaydı eklenmemiş.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead>Ürün</TableHead>
                          <TableHead>Toplam Üretilen</TableHead>
                          <TableHead>Toplam Hatalı</TableHead>
                          <TableHead>Kayıt Sayısı</TableHead>
                          <TableHead>İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSummaries.map((summary) => (
                          <React.Fragment key={summary.product_id}>
                            <TableRow className="cursor-pointer hover:bg-gray-50">
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleProductExpansion(summary.product_id)}
                                >
                                  {expandedProducts.has(summary.product_id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell className="font-medium">
                                {getProductDisplayName({ name: summary.product_name, model: summary.product_model })}
                              </TableCell>
                              <TableCell className="text-green-600 font-semibold">
                                {summary.total_produced}
                              </TableCell>
                              <TableCell className="text-red-600">
                                {summary.total_defective}
                              </TableCell>
                              <TableCell>{summary.record_count}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingProduction(null);
                                    setShowForm(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedProducts.has(summary.product_id) && (
                              <TableRow>
                                <TableCell colSpan={6} className="bg-gray-50 p-0">
                                  <div className="p-4">
                                    <h4 className="font-semibold mb-3 text-gray-700">Geçmiş Üretim Kayıtları:</h4>
                                    {summary.records.length > 0 ? (
                                      <div className="space-y-2">
                                        {summary.records.map((record) => (
                                          <div key={record.id} className="flex items-center justify-between bg-white p-3 rounded border shadow-sm">
                                            <div className="flex items-center space-x-4">
                                              <span className="text-sm text-gray-600 font-medium">
                                                {formatDate(record.production_date)}
                                              </span>
                                              <span className="text-sm">
                                                Üretilen: <span className="font-semibold text-green-600">{record.quantity_produced}</span>
                                              </span>
                                              <span className="text-sm">
                                                Hatalı: <span className="font-semibold text-red-600">{record.defective_quantity || 0}</span>
                                              </span>
                                              {record.notes && (
                                                <span className="text-sm text-gray-500">
                                                  Not: {record.notes}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex space-x-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  setEditingProduction(record);
                                                  setShowForm(true);
                                                }}
                                              >
                                                <Edit className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(record.id)}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-gray-500 text-sm">Bu ürün için henüz üretim kaydı bulunmuyor.</p>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  )
                ) : (
                  // Detailed view (original)
                  filteredProductions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Henüz üretim kaydı eklenmemiş.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ürün</TableHead>
                          <TableHead>Üretilen Miktar</TableHead>
                          <TableHead>Hatalı Miktar</TableHead>
                          <TableHead>Üretim Tarihi</TableHead>
                          <TableHead>Notlar</TableHead>
                          <TableHead>İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProductions.map((production) => (
                          <TableRow key={production.id}>
                            <TableCell className="font-medium">
                              {production.products ? getProductDisplayName(production.products) : 'Ürün bulunamadı'}
                            </TableCell>
                            <TableCell>{production.quantity_produced}</TableCell>
                            <TableCell>{production.defective_quantity || 0}</TableCell>
                            <TableCell>
                              {formatDate(production.production_date)}
                            </TableCell>
                            <TableCell>{production.notes || '-'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingProduction(production);
                                    setShowForm(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(production.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {showForm && (
        <ProductionForm
          production={editingProduction}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProduction(null);
          }}
        />
      )}
    </div>
  );
};

export default Production;
