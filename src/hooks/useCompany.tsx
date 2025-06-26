
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  company_code: string;
  created_at: string;
  created_by: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useCompany = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (profileData?.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyName: string) => {
    try {
      // Generate unique company code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_unique_company_code');

      if (codeError) throw codeError;

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          company_code: codeData,
          created_by: user?.id
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Update user profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: companyData.id })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setCompany(companyData);
      setProfile(prev => prev ? { ...prev, company_id: companyData.id } : null);

      toast({
        title: "Başarılı!",
        description: `Şirket oluşturuldu. Şirket kodu: ${companyData.company_code}`,
      });

      return companyData;
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Hata",
        description: "Şirket oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinCompany = async (companyCode: string) => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .single();

      if (companyError) {
        toast({
          title: "Hata",
          description: "Geçersiz şirket kodu.",
          variant: "destructive",
        });
        return;
      }

      // Update user profile with company_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_id: companyData.id })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setCompany(companyData);
      setProfile(prev => prev ? { ...prev, company_id: companyData.id } : null);

      toast({
        title: "Başarılı!",
        description: `${companyData.name} şirketine katıldınız.`,
      });

      return companyData;
    } catch (error) {
      console.error('Error joining company:', error);
      toast({
        title: "Hata",
        description: "Şirkete katılırken bir hata oluştu.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    profile,
    company,
    loading,
    createCompany,
    joinCompany,
    refetch: fetchUserProfile
  };
};
