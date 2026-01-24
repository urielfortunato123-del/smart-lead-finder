import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  price_min: number | null;
  price_max: number | null;
  price_typical: number | null;
  performance_score: number;
  camera_score: number;
  battery_score: number;
  build_quality_score: number;
  specs: unknown;
}

export interface UserProfile {
  usageLevel: 'basic' | 'intermediate' | 'intense';
  cameraImportance: 'low' | 'medium' | 'high';
  batteryNeeds: 'few_hours' | 'all_day' | 'more_than_day';
  budgetRange: 'economic' | 'intermediate' | 'premium';
}

export interface ComparisonResult {
  score: number;
  recommendation: 'not_worth' | 'depends' | 'worth_it';
  priceRange: { min: number; max: number; typical: number };
  analysis: {
    performanceGain: 'low' | 'medium' | 'high';
    purchaseTiming: 'urgent' | 'no_rush' | 'wait';
    costBenefit: 'poor' | 'good' | 'excellent';
  };
  conclusion: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
};

export const searchProducts = async (categoryId: string, query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const calculateComparison = (
  currentProduct: Product,
  newProduct: Product,
  profile: UserProfile
): ComparisonResult => {
  // Weight based on user profile
  const weights = {
    performance: profile.usageLevel === 'intense' ? 0.4 : profile.usageLevel === 'intermediate' ? 0.3 : 0.2,
    camera: profile.cameraImportance === 'high' ? 0.35 : profile.cameraImportance === 'medium' ? 0.25 : 0.1,
    battery: profile.batteryNeeds === 'more_than_day' ? 0.35 : profile.batteryNeeds === 'all_day' ? 0.25 : 0.15,
    buildQuality: 0.1,
  };

  // Normalize weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(key => {
    weights[key as keyof typeof weights] /= totalWeight;
  });

  // Calculate gains
  const performanceGainRaw = newProduct.performance_score - currentProduct.performance_score;
  const cameraGainRaw = newProduct.camera_score - currentProduct.camera_score;
  const batteryGainRaw = newProduct.battery_score - currentProduct.battery_score;
  const buildGainRaw = newProduct.build_quality_score - currentProduct.build_quality_score;

  // Weighted score (0-100 scale)
  const weightedScore = Math.max(0, Math.min(100,
    50 + (
      performanceGainRaw * weights.performance * 2 +
      cameraGainRaw * weights.camera * 2 +
      batteryGainRaw * weights.battery * 2 +
      buildGainRaw * weights.buildQuality * 2
    )
  ));

  // Budget alignment bonus/penalty
  let budgetModifier = 0;
  const typicalPrice = newProduct.price_typical || newProduct.price_max || 3000;
  
  if (profile.budgetRange === 'economic' && typicalPrice <= 1500) budgetModifier = 10;
  else if (profile.budgetRange === 'economic' && typicalPrice > 4000) budgetModifier = -15;
  else if (profile.budgetRange === 'intermediate' && typicalPrice >= 1500 && typicalPrice <= 4000) budgetModifier = 10;
  else if (profile.budgetRange === 'premium' && typicalPrice >= 4000) budgetModifier = 10;

  const finalScore = Math.round(Math.max(0, Math.min(100, weightedScore + budgetModifier)));

  // Determine recommendation
  let recommendation: 'not_worth' | 'depends' | 'worth_it';
  if (finalScore >= 71) recommendation = 'worth_it';
  else if (finalScore >= 41) recommendation = 'depends';
  else recommendation = 'not_worth';

  // Analysis breakdown
  const performanceGain: 'low' | 'medium' | 'high' = 
    performanceGainRaw < 5 ? 'low' : performanceGainRaw < 15 ? 'medium' : 'high';

  const purchaseTiming: 'urgent' | 'no_rush' | 'wait' =
    currentProduct.performance_score < 60 ? 'urgent' : 
    newProduct.year === new Date().getFullYear() ? 'no_rush' : 'wait';

  const costBenefit: 'poor' | 'good' | 'excellent' =
    finalScore < 40 ? 'poor' : finalScore < 70 ? 'good' : 'excellent';

  // Generate conclusion
  const conclusions: Record<string, string> = {
    worth_it_intense: 'Para o seu perfil de uso intenso, trocar faz sentido. Os ganhos de desempenho serão perceptíveis no dia a dia.',
    worth_it_intermediate: 'Para o seu perfil, trocar faz sentido, mas não vale pagar caro por recursos que você não vai usar. Priorize equilíbrio e bateria.',
    worth_it_basic: 'A troca vale a pena, mas lembre-se: você não precisa do modelo mais caro para suas necessidades.',
    depends: 'A troca pode valer a pena dependendo do preço. Aguarde promoções para uma decisão mais vantajosa.',
    not_worth: 'Com base no seu uso, não faz sentido trocar agora. Seu aparelho atual ainda atende bem suas necessidades.',
  };

  let conclusion = conclusions.not_worth;
  if (recommendation === 'worth_it') {
    conclusion = conclusions[`worth_it_${profile.usageLevel}`] || conclusions.worth_it_intermediate;
  } else if (recommendation === 'depends') {
    conclusion = conclusions.depends;
  }

  return {
    score: finalScore,
    recommendation,
    priceRange: {
      min: newProduct.price_min || typicalPrice * 0.8,
      max: newProduct.price_max || typicalPrice * 1.2,
      typical: typicalPrice,
    },
    analysis: {
      performanceGain,
      purchaseTiming,
      costBenefit,
    },
    conclusion,
  };
};

export const saveComparisonStats = async (
  categoryId: string,
  currentProductId: string,
  newProductId: string,
  profile: UserProfile,
  result: ComparisonResult
) => {
  const { error } = await supabase
    .from('comparison_stats')
    .insert([{
      category_id: categoryId,
      current_product_id: currentProductId,
      new_product_id: newProductId,
      usage_profile: profile.usageLevel,
      camera_importance: profile.cameraImportance,
      battery_importance: profile.batteryNeeds,
      budget_range: profile.budgetRange,
      result_score: result.score,
      recommendation: result.recommendation,
    }]);

  if (error) {
    console.error('Error saving comparison stats:', error);
  }
};
