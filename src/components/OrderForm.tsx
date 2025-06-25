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

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: string | null;
  total_delivery_quantity: number | null;
  order_date: string;
  delivery_date: string | null;
  notes: string | null;
}

interface OrderFormProps {
  order?: Order | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrderForm = ({ order, onSuccess, onCancel }: OrderFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    order_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    status: 'pending',
    total_delivery_quantity: '',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    notes: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        order_number: order.order_number || '',
        customer_name: order.customer_name || '',
        customer_email: order.customer_email || '',
        customer_phone: order.customer_phone || '',
        status: order.status || 'pending',
        total_delivery_quantity: order.total_delivery_quantity?.toString() || '',
        order_date: order.order_date ? order.order_date.split('T')[0] : '',
        delivery_date: order.delivery_date ? order.delivery_date.split('T')[0] : '',
        notes: order.notes || '',
      });
    } else {
      // Generate order number for new orders
      const orderNumber = `SIP-${Date.now()}`;
      setFormData(prev => ({ ...prev, order_number: orderNumber }));
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        order_number: formData.order_number,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || null,
        customer_phone: formData.customer_phone || null,
        status: formData.status,
        total_delivery_quantity: formData.total_delivery_quantity ? parseInt(formData.total_delivery_quantity) : null,
        order_date: formData.order_date,
        delivery_date: formData.delivery_date || null,
        notes: formData.notes || null,
        updated_by: user.id,
        ...(order ? {} : { created_by: user.id }), // Only set created_by for new orders
      };

      if (order) {
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Sipariş başarıyla güncellendi.",
        });
      } else {
        const { error } = await supabase
          .from('orders')
          .insert([orderData]);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Sipariş başarıyla eklendi.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Hata",
        description: "Sipariş kaydedilirken bir hata oluştu.",
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
            {order ? 'Sipariş Düzenle' : 'Yeni Sipariş Ekle'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_number">Sipariş No *</Label>
                <Input
                  id="order_number"
                  value={formData.order_number}
                  onChange={(e) => handleChange('order_number', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Bekliyor</SelectItem>
                    <SelectItem value="processing">İşleniyor</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="cancelled">İptal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="customer_name">Müşteri Adı *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_email">Müşteri E-posta</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleChange('customer_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Müşteri Telefon</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => handleChange('customer_phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_date">Sipariş Tarihi *</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={(e) => handleChange('order_date', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="delivery_date">Teslimat Tarihi</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => handleChange('delivery_date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="total_delivery_quantity">Toplam Teslim Adedi</Label>
              <Input
                id="total_delivery_quantity"
                type="number"
                value={formData.total_delivery_quantity}
                onChange={(e) => handleChange('total_delivery_quantity', e.target.value)}
              />
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
                {loading ? 'Kaydediliyor...' : (order ? 'Güncelle' : 'Ekle')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
