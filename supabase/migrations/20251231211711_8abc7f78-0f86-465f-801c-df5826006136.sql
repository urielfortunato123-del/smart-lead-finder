-- Tabela de planos
CREATE TABLE public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  searches_per_day INTEGER NOT NULL DEFAULT 1,
  duration_months INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos
INSERT INTO public.plans (id, name, description, price, searches_per_day, duration_months) VALUES
  ('free', 'Gratuito', '1 consulta por dia', 0, 1, 0),
  ('monthly', 'Mensal', 'Consultas ilimitadas', 49.90, 999, 1),
  ('quarterly', 'Trimestral', 'Consultas ilimitadas + 10% desconto', 134.73, 999, 3),
  ('semiannual', 'Semestral', 'Consultas ilimitadas + 15% desconto', 254.49, 999, 6),
  ('annual', 'Anual', 'Consultas ilimitadas + 25% desconto', 449.10, 999, 12);

-- Planos são públicos para visualização
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone" ON public.plans
  FOR SELECT USING (true);

-- Tabela de assinaturas dos usuários
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan_id TEXT REFERENCES public.plans(id) NOT NULL DEFAULT 'free',
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Tabela de contagem de buscas diárias
CREATE TABLE public.daily_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_date DATE NOT NULL DEFAULT CURRENT_DATE,
  search_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, search_date)
);

ALTER TABLE public.daily_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily searches" ON public.daily_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily searches" ON public.daily_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily searches" ON public.daily_searches
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para criar assinatura free automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan_id)
  VALUES (new.id, 'free');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Trigger para atualizar updated_at em subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();