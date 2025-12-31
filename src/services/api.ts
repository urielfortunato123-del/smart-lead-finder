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

export interface UserSubscription {
  plan_id: string;
  plan_name: string;
  searches_per_day: number;
  is_active: boolean;
  ends_at: string | null;
}

export const searchCompanies = async (sector: string, location?: string): Promise<Company[]> => {
  // Check user's search limit first
  const canSearch = await checkSearchLimit();
  if (!canSearch.allowed) {
    throw new Error(canSearch.message);
  }

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

  // Increment search count
  await incrementSearchCount();

  return data.companies || [];
};

export const checkSearchLimit = async (): Promise<{ allowed: boolean; message: string; remaining?: number }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { allowed: false, message: 'Você precisa estar logado para fazer buscas' };
  }

  // Get user's subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_id, is_active, ends_at')
    .eq('user_id', user.id)
    .single();

  if (!subscription) {
    return { allowed: false, message: 'Assinatura não encontrada' };
  }

  // Get plan details
  const { data: plan } = await supabase
    .from('plans')
    .select('searches_per_day')
    .eq('id', subscription.plan_id)
    .single();

  if (!plan) {
    return { allowed: false, message: 'Plano não encontrado' };
  }

  // Check if subscription is still active (for paid plans)
  if (subscription.ends_at && new Date(subscription.ends_at) < new Date()) {
    return { allowed: false, message: 'Sua assinatura expirou. Renove para continuar.' };
  }

  // For unlimited plans (999 searches)
  if (plan.searches_per_day >= 999) {
    return { allowed: true, message: 'OK', remaining: 999 };
  }

  // Check today's search count
  const today = new Date().toISOString().split('T')[0];
  const { data: dailySearch } = await supabase
    .from('daily_searches')
    .select('search_count')
    .eq('user_id', user.id)
    .eq('search_date', today)
    .single();

  const currentCount = dailySearch?.search_count || 0;
  const remaining = plan.searches_per_day - currentCount;

  if (remaining <= 0) {
    return { 
      allowed: false, 
      message: 'Você atingiu o limite de buscas diárias do plano gratuito. Faça upgrade para continuar.',
      remaining: 0
    };
  }

  return { allowed: true, message: 'OK', remaining };
};

export const incrementSearchCount = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];

  // Try to update existing record
  const { data: existing } = await supabase
    .from('daily_searches')
    .select('id, search_count')
    .eq('user_id', user.id)
    .eq('search_date', today)
    .single();

  if (existing) {
    await supabase
      .from('daily_searches')
      .update({ search_count: existing.search_count + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('daily_searches')
      .insert([{
        user_id: user.id,
        search_date: today,
        search_count: 1,
      }]);
  }
};

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_id, is_active, ends_at')
    .eq('user_id', user.id)
    .single();

  if (!subscription) return null;

  const { data: plan } = await supabase
    .from('plans')
    .select('name, searches_per_day')
    .eq('id', subscription.plan_id)
    .single();

  if (!plan) return null;

  return {
    plan_id: subscription.plan_id,
    plan_name: plan.name,
    searches_per_day: plan.searches_per_day,
    is_active: subscription.is_active,
    ends_at: subscription.ends_at,
  };
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