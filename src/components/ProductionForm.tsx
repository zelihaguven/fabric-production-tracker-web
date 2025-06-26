
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface ProductionRecord {
  id: string;
  quantity_produced: number;
  defective_quantity: number | null;
  production_date: string;
  notes: string | null;
  product_id: string;
  products?: {
    name: string;
    model: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  model: string | null;
}

interface ProductionFormProps {
  production?: ProductionRecord | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductionForm = ({ production, onSuccess, onCancel }: ProductionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_produced: '',
    defective_quantity: '',
    production_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchProducts();
    if (production) {
      setFormData({
        product_id: production.product_id || '',
        quantity_produced: production.quantity_produced?.toString() || '',
        defective_quantity: production.defective_quantity?.toString() || '',
        production_date: production.production_date ? production.production_date.split('T')[0] : '',
        notes: production.notes || '',
      });
    }
  }, [production]);

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

    // Validation checks
    if (!formData.product_id) {
      toast({
        title: "Hata",
        description: "Lütfen bir ürün seçin.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.quantity_produced || parseInt(formData.quantity_produced) <= 0) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir üretilen miktar girin.",
        variant: "destructive",
      });
      return;
    }

    const defectiveQty = formData.defective_quantity ? parseInt(formData.defective_quantity) : null;
    if (defectiveQty !== null && defectiveQty < 0) {
      toast({
        title: "Hata",
        description: "Hatalı miktar negatif olamaz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting production data:', {
        user_id: user.id,
        product_id: formData.product_id,
        quantity_produced: parseInt(formData.quantity_produced),
        defective_quantity: defectiveQty,
        production_date: formData.production_date,
        notes: formData.notes || null,
      });

      const productionData = {
        user_id: user.id,
        product_id: formData.product_id,
        quantity_produced: parseInt(formData.quantity_produced),
        defective_quantity: defectiveQty,
        production_date: formData.production_date,
        notes: formData.notes || null,
        updated_by: user.id,
        ...(production ? {} : { created_by: user.id }),
      };

      if (production) {
        const { error } = await supabase
          .from('production_records')
          .update(productionData)
          .eq('id', production.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Üretim kaydı başarıyla güncellendi.",
        });
      } else {
        const { error } = await supabase
          .from('production_records')
          .insert([productionData]);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Üretim kaydı başarıyla eklendi.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving production:', error);
      toast({
        title: "Hata",
        description: "Üretim kaydı kaydedilirken bir hata oluştu. Lütfen tüm alanları kontrol edin.",
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

  const getProductDisplayName = (product: Product) => {
    return product.model ? `${product.name} - ${product.model}` : product.name;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {production ? 'Üretim Kaydı Düzenle' : 'Yeni Üretim Kaydı Ekle'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product">Ürün *</Label>
              <Select value={formData.product_id} onValueChange={(value) => handleChange('product_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ürün seçin" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {getProductDisplayName(product)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity_produced">Üretilen Miktar *</Label>
                <Input
                  id="quantity_produced"
                  type="number"
                  min="1"
                  value={formData.quantity_produced}
                  onChange={(e) => handleChange('quantity_produced', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="defective_quantity">Hatalı Miktar</Label>
                <Input
                  id="defective_quantity"
                  type="number"
                  min="0"
                  value={formData.defective_quantity}
                  onChange={(e) => handleChange('defective_quantity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="production_date">Üretim Tarihi *</Label>
                <Input
                  id="production_date"
                  type="date"
                  value={formData.production_date}
                  onChange={(e) => handleChange('production_date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Kaydediliyor...' : (production ? 'Güncelle' : 'Ekle')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionForm;
