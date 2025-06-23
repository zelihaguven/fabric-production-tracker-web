
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
  stock_quantity: number | null;
  min_stock_level: number | null;
  color: string | null;
  order_number: string | null;
  ordering_brand: string | null;
  fabric_number: string | null;
  fabric_status: string | null;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    stock_quantity: '',
    min_stock_level: '',
    color: '',
    order_number: '',
    ordering_brand: '',
    fabric_number: '',
    fabric_status: 'kumaş sipariş edildi',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        model: product.model || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        min_stock_level: product.min_stock_level?.toString() || '',
        color: product.color || '',
        order_number: product.order_number || '',
        ordering_brand: product.ordering_brand || '',
        fabric_number: product.fabric_number || '',
        fabric_status: product.fabric_status || 'kumaş sipariş edildi',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const productData = {
        user_id: user.id,
        name: formData.name,
        model: formData.model || null,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        min_stock_level: formData.min_stock_level ? parseInt(formData.min_stock_level) : null,
        color: formData.color || null,
        order_number: formData.order_number || null,
        ordering_brand: formData.ordering_brand || null,
        fabric_number: formData.fabric_number || null,
        fabric_status: formData.fabric_status || null,
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Ürün başarıyla güncellendi.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Ürün başarıyla eklendi.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Hata",
        description: "Ürün kaydedilirken bir hata oluştu.",
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ürün Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Renk</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="order_number">Sipariş No</Label>
                <Input
                  id="order_number"
                  value={formData.order_number}
                  onChange={(e) => handleChange('order_number', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ordering_brand">Sipariş Veren Marka</Label>
                <Input
                  id="ordering_brand"
                  value={formData.ordering_brand}
                  onChange={(e) => handleChange('ordering_brand', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fabric_number">Kumaş No</Label>
                <Input
                  id="fabric_number"
                  value={formData.fabric_number}
                  onChange={(e) => handleChange('fabric_number', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fabric_status">Kumaş Durumu</Label>
              <Select value={formData.fabric_status} onValueChange={(value) => handleChange('fabric_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kumaş durumu seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kumaş sipariş edildi">Kumaş Sipariş Edildi</SelectItem>
                  <SelectItem value="kumaş geldi">Kumaş Geldi</SelectItem>
                  <SelectItem value="kumaş kesime girdi">Kumaş Kesime Girdi</SelectItem>
                  <SelectItem value="kumaş hazır">Kumaş Hazır</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock_quantity">Sipariş Adedi *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="min_stock_level">Üretim Adedi</Label>
                <Input
                  id="min_stock_level"
                  type="number"
                  value={formData.min_stock_level}
                  onChange={(e) => handleChange('min_stock_level', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Kaydediliyor...' : (product ? 'Güncelle' : 'Ekle')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
