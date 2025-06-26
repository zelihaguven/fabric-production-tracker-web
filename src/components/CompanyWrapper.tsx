
import React from 'react';
import { useCompany } from '@/hooks/useCompany';
import CompanySetup from './CompanySetup';

interface CompanyWrapperProps {
  children: React.ReactNode;
}

const CompanyWrapper = ({ children }: CompanyWrapperProps) => {
  const { profile, company, loading, createCompany, joinCompany } = useCompany();

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

  // If user has no company, show company setup
  if (!company || !profile?.company_id) {
    return (
      <CompanySetup
        onCreateCompany={createCompany}
        onJoinCompany={joinCompany}
        loading={loading}
      />
    );
  }

  // User has a company, show the main app
  return <>{children}</>;
};

export default CompanyWrapper;
