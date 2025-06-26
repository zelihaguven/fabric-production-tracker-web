import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Plus } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  company_code: string;
  created_at: string;
  created_by: string;
}

interface CompanySetupProps {
  onCreateCompany: (companyName: string) => Promise<Company>;
  onJoinCompany: (companyCode: string) => Promise<Company>;
  loading?: boolean;
}

const CompanySetup = ({ onCreateCompany, onJoinCompany, loading = false }: CompanySetupProps) => {
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setCreateLoading(true);
    try {
      await onCreateCompany(companyName.trim());
      setCompanyName('');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyCode.trim()) return;

    setJoinLoading(true);
    try {
      await onJoinCompany(companyCode.trim());
      setCompanyCode('');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Şirket Kurulumu</CardTitle>
          <p className="text-gray-600">
            Sistemi kullanmaya başlamak için bir şirket oluşturun veya mevcut bir şirkete katılın.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Şirket Oluştur
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Şirkete Katıl
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Şirket Adı</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Şirket adını girin"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                  disabled={createLoading || loading}
                >
                  {createLoading ? 'Oluşturuluyor...' : 'Şirket Oluştur'}
                </Button>
              </form>
              <p className="text-sm text-gray-500 text-center">
                Şirket oluşturduktan sonra diğer kullanıcılarla paylaşabileceğiniz 
                benzersiz bir şirket kodu alacaksınız.
              </p>
            </TabsContent>

            <TabsContent value="join" className="space-y-4">
              <form onSubmit={handleJoinCompany} className="space-y-4">
                <div>
                  <Label htmlFor="companyCode">Şirket Kodu</Label>
                  <Input
                    id="companyCode"
                    type="text"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                    placeholder="6 haneli şirket kodunu girin"
                    maxLength={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={joinLoading || loading}
                >
                  {joinLoading ? 'Katılıyor...' : 'Şirkete Katıl'}
                </Button>
              </form>
              <p className="text-sm text-gray-500 text-center">
                Mevcut bir şirkete katılmak için şirket yöneticisinden 
                şirket kodunu alın.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySetup;
