
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
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
  quantity_produced: number;
  production_date: string;
  notes: string | null;
  products: {
    name: string;
  };
}

const Production = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionRecord | null>(null);

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
          quantity_produced,
          production_date,
          notes,
          products (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('production_date', { ascending: false });

      if (error) throw error;
      setProductions(data || []);
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

  const filteredProductions = productions.filter(production =>
    production.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredProductions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Henüz üretim kaydı eklenmemiş.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead>Üretilen Miktar</TableHead>
                        <TableHead>Üretim Tarihi</TableHead>
                        <TableHead>Notlar</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProductions.map((production) => (
                        <TableRow key={production.id}>
                          <TableCell className="font-medium">
                            {production.products?.name || 'Ürün bulunamadı'}
                          </TableCell>
                          <TableCell>{production.quantity_produced}</TableCell>
                          <TableCell>
                            {new Date(production.production_date).toLocaleDateString('tr-TR')}
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
