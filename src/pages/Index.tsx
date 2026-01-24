import { useState, useEffect } from "react";
import Header from "@/components/comparison/Header";
import HeroSection from "@/components/comparison/HeroSection";
import CategoryStep from "@/components/comparison/CategoryStep";
import ProductStep from "@/components/comparison/ProductStep";
import ProfileStep from "@/components/comparison/ProfileStep";
import ResultStep from "@/components/comparison/ResultStep";
import { ComparisonState, initialComparisonState } from "@/types/comparison";
import { 
  getProductById, 
  calculateComparison, 
  saveComparisonStats,
  Product,
  ComparisonResult,
  UserProfile 
} from "@/services/api";

const Index = () => {
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<ComparisonState>(initialComparisonState);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setState({ ...initialComparisonState, step: 1 });
  };

  const handleBack = () => {
    if (state.step === 1) {
      setStarted(false);
      setState(initialComparisonState);
    } else {
      setState({ ...state, step: (state.step - 1) as 1 | 2 | 3 | 4 });
    }
    setResult(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setState({ ...state, categoryId, step: 2 });
  };

  const handleSelectCurrentProduct = (productId: string) => {
    setState({ ...state, currentProductId: productId });
  };

  const handleSelectNewProduct = (productId: string) => {
    setState({ ...state, newProductId: productId });
  };

  const handleProductNext = () => {
    setState({ ...state, step: 3 });
  };

  const handleProfileUpdate = (key: keyof ComparisonState['profile'], value: string) => {
    setState({
      ...state,
      profile: { ...state.profile, [key]: value },
    });
  };

  const handleProfileNext = async () => {
    if (!state.currentProductId || !state.newProductId || !state.categoryId) return;

    setLoading(true);

    try {
      const [current, newProd] = await Promise.all([
        getProductById(state.currentProductId),
        getProductById(state.newProductId),
      ]);

      if (!current || !newProd) {
        throw new Error('Produto não encontrado');
      }

      setCurrentProduct(current);
      setNewProduct(newProd);

      const profile: UserProfile = {
        usageLevel: state.profile.usageLevel!,
        cameraImportance: state.profile.cameraImportance!,
        batteryNeeds: state.profile.batteryNeeds!,
        budgetRange: state.profile.budgetRange!,
      };

      const comparisonResult = calculateComparison(current, newProd, profile);
      setResult(comparisonResult);

      // Save stats (fire and forget)
      saveComparisonStats(
        state.categoryId,
        state.currentProductId,
        state.newProductId,
        profile,
        comparisonResult
      );

      setState({ ...state, step: 4 });
    } catch (error) {
      console.error('Error calculating comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewComparison = () => {
    setStarted(false);
    setState(initialComparisonState);
    setCurrentProduct(null);
    setNewProduct(null);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Calculando análise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onBack={handleBack} showBack={started} />
      <main className="pt-20">
        {!started && <HeroSection onStart={handleStart} />}
        
        {started && state.step === 1 && (
          <CategoryStep onSelect={handleCategorySelect} />
        )}
        
        {started && state.step === 2 && state.categoryId && (
          <ProductStep
            categoryId={state.categoryId}
            currentProductId={state.currentProductId}
            newProductId={state.newProductId}
            onSelectCurrent={handleSelectCurrentProduct}
            onSelectNew={handleSelectNewProduct}
            onNext={handleProductNext}
          />
        )}
        
        {started && state.step === 3 && (
          <ProfileStep
            profile={state.profile}
            onUpdate={handleProfileUpdate}
            onNext={handleProfileNext}
          />
        )}
        
        {started && state.step === 4 && result && currentProduct && newProduct && (
          <ResultStep
            result={result}
            currentProduct={currentProduct}
            newProduct={newProduct}
            onNewComparison={handleNewComparison}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
