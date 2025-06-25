import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  model: string | null;
}

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
}

interface LabelFormProps {
  label?: LabelData | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LabelForm = ({ label, onSuccess, onCancel }: LabelFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    order_status: 'ordered',
    received_quantity: '0',
    brand: '',
    count_quantity: '0',
    attached_model: '',
    model_owner: '',
    order_date: '',
    delivery_date: '',
  });

  useEffect(() => {
    fetchProducts();
    if (label) {
      setFormData({
        product_id: label.product_id || '',
        order_status: label.order_status || 'ordered',
        received_quantity: label.received_quantity?.toString() || '0',
        brand: label.brand || '',
        count_quantity: label.count_quantity?.toString() || '0',
        attached_model: label.attached_model || '',
        model_owner: label.model_owner || '',
        order_date: label.order_date || '',
        delivery_date: label.delivery_date || '',
      });
    }
  }, [label]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, model')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const labelData = {
        user_id: user.id,
        product_id: formData.product_id,
        order_status: formData.order_status,
        received_quantity: formData.received_quantity ? parseInt(formData.received_quantity) : 0,
        brand: formData.brand || null,
        count_quantity: formData.count_quantity ? parseInt(formData.count_quantity) : 0,
        attached_model: formData.attached_model || null,
        model_owner: formData.model_owner || null,
        order_date: formData.order_date || null,
        delivery_date: formData.delivery_date || null,
        updated_by: user.id,
        ...(label ? {} : { created_by: user.id }), // Only set created_by for new labels
      };

      if (label) {
        const { error } = await supabase
          .from('labels')
          .update(labelData)
          .eq('id', label.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Etiket başarıyla güncellendi.",
        });
      } else {
        const { error } = await supabase
          .from('labels')
          .insert([labelData]);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Etiket başarıyla eklendi.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving label:', error);
      toast({
        title: "Hata",
        description: "Etiket kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {label ? 'Etiket Düzenle' : 'Yeni Etiket Ekle'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product">Ürün *</Label>
              <Select value={formData.product_id} onValueChange={(value) => handleChange('product_id', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Ürün seçin" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} {product.model ? `- ${product.model}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_status">Sipariş Durumu</Label>
                <Select value={formData.order_status} onValueChange={(value) => handleChange('order_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordered">Sipariş Verildi</SelectItem>
                    <SelectItem value="arrived">Teslim Alındı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Etiket Üreticisi</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attached_model">Takılacak Model</Label>
                <Input
                  id="attached_model"
                  value={formData.attached_model}
                  onChange={(e) => handleChange('attached_model', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="model_owner">Model Sahibi</Label>
                <Input
                  id="model_owner"
                  value={formData.model_owner}
                  onChange={(e) => handleChange('model_owner', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_date">Sipariş Tarihi</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={(e) => handleChange('order_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="delivery_date">Teslim Tarihi</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => handleChange('delivery_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="received_quantity">Teslim Alınan Miktar</Label>
                <Input
                  id="received_quantity"
                  type="number"
                  value={formData.received_quantity}
                  onChange={(e) => handleChange('received_quantity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="count_quantity">Sayım Miktarı</Label>
                <Input
                  id="count_quantity"
                  type="number"
                  value={formData.count_quantity}
                  onChange={(e) => handleChange('count_quantity', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Kaydediliyor...' : (label ? 'Güncelle' : 'Ekle')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabelForm;
