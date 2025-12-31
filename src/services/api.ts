import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export interface SavedLead {
  id: string;
  user_id: string;
  company_name: string;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  sector: string | null;
  company_size: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const searchCompanies = async (sector: string, location?: string): Promise<Company[]> => {
  const { data, error } = await supabase.functions.invoke('search-companies', {
    body: { sector, location },
  });

  if (error) {
    console.error('Error searching companies:', error);
    throw new Error(error.message || 'Erro ao buscar empresas');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.companies || [];
};

export const saveSearchHistory = async (query: string, resultsCount: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('search_history')
    .insert([{
      user_id: user.id,
      query,
      results_count: resultsCount,
    }]);

  if (error) {
    console.error('Error saving search history:', error);
  }
};

export const getSearchHistory = async () => {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching search history:', error);
    return [];
  }

  return data;
};

export const saveLead = async (company: Company): Promise<SavedLead | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('saved_leads')
    .insert([{
      user_id: user.id,
      company_name: company.name,
      cnpj: company.cnpj,
      address: company.address,
      city: company.city,
      state: company.state,
      phone: company.phone,
      email: company.email,
      website: company.website,
      sector: company.sector,
      company_size: company.size,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving lead:', error);
    throw new Error(error.message);
  }

  return data as SavedLead;
};

export const getSavedLeads = async (): Promise<SavedLead[]> => {
  const { data, error } = await supabase
    .from('saved_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved leads:', error);
    return [];
  }

  return data as SavedLead[];
};

export const updateLeadStatus = async (leadId: string, status: SavedLead['status']) => {
  const { error } = await supabase
    .from('saved_leads')
    .update({ status })
    .eq('id', leadId);

  if (error) {
    console.error('Error updating lead status:', error);
    throw new Error(error.message);
  }
};

export const updateLeadNotes = async (leadId: string, notes: string) => {
  const { error } = await supabase
    .from('saved_leads')
    .update({ notes })
    .eq('id', leadId);

  if (error) {
    console.error('Error updating lead notes:', error);
    throw new Error(error.message);
  }
};

export const deleteLead = async (leadId: string) => {
  const { error } = await supabase
    .from('saved_leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    console.error('Error deleting lead:', error);
    throw new Error(error.message);
  }
};