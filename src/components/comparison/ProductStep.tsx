import { useState, useEffect } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchProducts, Product } from "@/services/api";

interface ProductStepProps {
  categoryId: string;
  currentProductId: string | null;
  newProductId: string | null;
  onSelectCurrent: (productId: string) => void;
  onSelectNew: (productId: string) => void;
  onNext: () => void;
}

const ProductStep = ({
  categoryId,
  currentProductId,
  newProductId,
  onSelectCurrent,
  onSelectNew,
  onNext,
}: ProductStepProps) => {
  const [currentQuery, setCurrentQuery] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [currentResults, setCurrentResults] = useState<Product[]>([]);
  const [newResults, setNewResults] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);

  useEffect(() => {
    if (currentQuery.length >= 2) {
      searchProducts(categoryId, currentQuery).then(setCurrentResults);
    } else {
      setCurrentResults([]);
    }
  }, [currentQuery, categoryId]);

  useEffect(() => {
    if (newQuery.length >= 2) {
      searchProducts(categoryId, newQuery).then(setNewResults);
    } else {
      setNewResults([]);
    }
  }, [newQuery, categoryId]);

  const handleSelectCurrent = (product: Product) => {
    setCurrentProduct(product);
    setCurrentQuery(product.name);
    onSelectCurrent(product.id);
    setCurrentFocused(false);
  };

  const handleSelectNew = (product: Product) => {
    setNewProduct(product);
    setNewQuery(product.name);
    onSelectNew(product.id);
    setNewFocused(false);
  };

  const canProceed = currentProductId && newProductId;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          Selecione os produtos
        </h2>
        <p className="text-muted-foreground">
          Informe qual você tem hoje e qual pretende comprar.
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Product */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-2">Produto Atual</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Qual produto você usa hoje?
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: iPhone 13, Galaxy S21, Redmi Note 12"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onFocus={() => setCurrentFocused(true)}
              onBlur={() => setTimeout(() => setCurrentFocused(false), 200)}
              className="pl-10"
            />
            {currentFocused && currentResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-border max-h-48 overflow-y-auto z-10">
                {currentResults.map((product) => (
                  <button
                    key={product.id}
                    className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex justify-between items-center"
                    onClick={() => handleSelectCurrent(product)}
                  >
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.brand}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {currentProduct && (
            <div className="mt-3 px-3 py-2 bg-primary/10 rounded-lg text-sm">
              ✓ {currentProduct.name} ({currentProduct.brand})
            </div>
          )}
        </div>

        {/* New Product */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-2">Novo Produto</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Qual produto você quer comprar?
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: Galaxy S25 FE, S25, S25 Edge"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onFocus={() => setNewFocused(true)}
              onBlur={() => setTimeout(() => setNewFocused(false), 200)}
              className="pl-10"
            />
            {newFocused && newResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-border max-h-48 overflow-y-auto z-10">
                {newResults.map((product) => (
                  <button
                    key={product.id}
                    className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex justify-between items-center"
                    onClick={() => handleSelectNew(product)}
                  >
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.brand}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {newProduct && (
            <div className="mt-3 px-3 py-2 bg-accent/10 rounded-lg text-sm">
              ✓ {newProduct.name} ({newProduct.brand})
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className="gradient-primary px-8 rounded-full"
        >
          Próximo: seu perfil
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductStep;
