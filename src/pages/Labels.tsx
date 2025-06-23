
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LabelForm from '@/components/LabelForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LabelData {
  id: string;
  product_id: string;
  order_status: string | null;
  received_quantity: number | null;
  brand: string | null;
  count_quantity: number | null;
  attached_model: string | null;
  model_owner: string | null;
  order_date: string | null;
  delivery_date: string | null;
  products?: {
    name: string;
    model: string |null;
  };
}

const Labels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelData | null>(null);

  useEffect(() => {
    if (user) {
      fetchLabels();
    }
  }, [user]);

  const fetchLabels = async () => {
    try {
      const { data, error } = await supabase
        .from('labels')
        .select(`
          id,
          product_id,
          order_status,
          received_quantity,
          brand,
          count_quantity,
          attached_model,
          model_owner,
          order_date,
          delivery_date,
          products (
            name,
            model
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLabels(data || []);
    } catch (error) {
      console.error('Error fetching labels:', error);
      toast({
        title: "Hata",
        description: "Etiketler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etiketi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLabels(labels.filter(l => l.id !== id));
      toast({
        title: "Başarılı",
        description: "Etiket başarıyla silindi.",
      });
    } catch (error) {
      console.error('Error deleting label:', error);
      toast({
        title: "Hata",
        description: "Etiket silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLabel(null);
    fetchLabels();
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'arrived') {
      return <Badge className="bg-green-100 text-green-800">Teslim Alındı</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Sipariş Verildi</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const filteredLabels = labels.filter(label =>
    label.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.products?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.attached_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.model_owner?.toLowerCase().includes(searchTerm.toLowerCase())
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
                  Etiket Takibi
                </h1>
                <p className="text-gray-600">
                  Etiket durumlarını takip edin ve yönetin
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Etiket
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Etiket Listesi</span>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Etiket ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLabels.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Henüz etiket eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ürün</TableHead>
                          <TableHead>Etiket Üreticisi</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Takılacak Model</TableHead>
                          <TableHead>Model Sahibi</TableHead>
                          <TableHead>Sipariş Tarihi</TableHead>
                          <TableHead>Teslim Tarihi</TableHead>
                          <TableHead>Teslim Alınan</TableHead>
                          <TableHead>Sayım Miktarı</TableHead>
                          <TableHead>İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLabels.map((label) => (
                          <TableRow key={label.id}>
                            <TableCell className="font-medium">
                              {label.products?.name} {label.products?.model ? `- ${label.products.model}` : ''}
                            </TableCell>
                            <TableCell>{label.brand || '-'}</TableCell>
                            <TableCell>{getStatusBadge(label.order_status)}</TableCell>
                            <TableCell>{label.attached_model || '-'}</TableCell>
                            <TableCell>{label.model_owner || '-'}</TableCell>
                            <TableCell>{formatDate(label.order_date)}</TableCell>
                            <TableCell>{formatDate(label.delivery_date)}</TableCell>
                            <TableCell>{label.received_quantity || 0}</TableCell>
                            <TableCell>{label.count_quantity || 0}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingLabel(label);
                                    setShowForm(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(label.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {showForm && (
        <LabelForm
          label={editingLabel}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingLabel(null);
          }}
        />
      )}
    </div>
  );
};

export default Labels;
