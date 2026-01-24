import { useEffect, useState } from "react";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Headphones, 
  Tv, 
  Camera,
  LucideIcon 
} from "lucide-react";
import { getCategories, Category } from "@/services/api";

interface CategoryStepProps {
  onSelect: (categoryId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Tv,
  Camera,
};

const CategoryStep = ({ onSelect }: CategoryStepProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          O que você quer comparar?
        </h2>
        <p className="text-muted-foreground">
          Escolha a categoria do produto que você está pensando em trocar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Smartphone;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="glass rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-glow transition-all group"
            >
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:gradient-primary transition-colors">
                <Icon className="h-7 w-7 text-foreground" />
              </div>
              <span className="font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryStep;
