export interface ComparisonState {
  step: 1 | 2 | 3 | 4;
  categoryId: string | null;
  currentProductId: string | null;
  newProductId: string | null;
  profile: {
    usageLevel: 'basic' | 'intermediate' | 'intense' | null;
    cameraImportance: 'low' | 'medium' | 'high' | null;
    batteryNeeds: 'few_hours' | 'all_day' | 'more_than_day' | null;
    budgetRange: 'economic' | 'intermediate' | 'premium' | null;
  };
}

export const initialComparisonState: ComparisonState = {
  step: 1,
  categoryId: null,
  currentProductId: null,
  newProductId: null,
  profile: {
    usageLevel: null,
    cameraImportance: null,
    batteryNeeds: null,
    budgetRange: null,
  },
};
