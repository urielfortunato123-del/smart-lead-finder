import { RefreshCw, DollarSign, CheckCircle2, XCircle, HelpCircle, Zap, Clock, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonResult, Product } from "@/services/api";

interface ResultStepProps {
  result: ComparisonResult;
  currentProduct: Product;
  newProduct: Product;
  onNewComparison: () => void;
}

const ResultStep = ({ result, currentProduct, newProduct, onNewComparison }: ResultStepProps) => {
  const getRecommendationIcon = () => {
    switch (result.recommendation) {
      case 'worth_it': return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'depends': return <HelpCircle className="h-8 w-8 text-yellow-500" />;
      case 'not_worth': return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getRecommendationText = () => {
    switch (result.recommendation) {
      case 'worth_it': return 'Vale a pena trocar!';
      case 'depends': return 'Depende do preço';
      case 'not_worth': return 'Não vale a pena';
    }
  };

  const getRecommendationDescription = () => {
    switch (result.recommendation) {
      case 'worth_it': return 'Com base no seu perfil, a troca traz benefícios reais no uso diário.';
      case 'depends': return 'A troca pode valer a pena dependendo do preço e promoções disponíveis.';
      case 'not_worth': return 'Seu aparelho atual ainda atende bem às suas necessidades.';
    }
  };

  const getScoreColor = () => {
    if (result.score >= 71) return 'text-green-500';
    if (result.score >= 41) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      {/* Main Result */}
      <div className="glass rounded-2xl p-8 text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {getRecommendationIcon()}
          <h2 className="text-3xl font-heading font-bold">
            {getRecommendationText()}
          </h2>
        </div>
        <p className="text-muted-foreground mb-6">
          {getRecommendationDescription()}
        </p>

        {/* Score */}
        <div className="mb-6">
          <div className={`text-6xl font-heading font-bold ${getScoreColor()}`}>
            {result.score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Quanto maior a pontuação, mais vantajosa é a troca.
          </p>
        </div>

        {/* Score Scale */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <span className="text-red-500">0-40 ❌ Não vale</span>
          <span className="text-yellow-500">41-70 🤔 Depende</span>
          <span className="text-green-500">71-100 ✅ Vale</span>
        </div>
      </div>

      {/* Products compared */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="text-center flex-1">
            <span className="text-muted-foreground block mb-1">Produto atual</span>
            <span className="font-medium">{currentProduct.name}</span>
          </div>
          <div className="text-2xl px-4">→</div>
          <div className="text-center flex-1">
            <span className="text-muted-foreground block mb-1">Novo produto</span>
            <span className="font-medium">{newProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-accent" />
          <h3 className="font-heading font-semibold">Faixa de preço sugerida</h3>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Faixa ideal para o seu perfil</p>
          <p className="text-2xl font-heading font-bold text-accent">
            {formatPrice(result.priceRange.min)} a {formatPrice(result.priceRange.max)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (Preço típico recomendado: {formatPrice(result.priceRange.typical)})
          </p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="glass rounded-xl p-6 mb-6">
        <h3 className="font-heading font-semibold text-lg mb-6">📊 Análise detalhada</h3>
        
        <div className="space-y-6">
          {/* Performance Gain */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Ganho de desempenho</h4>
              <p className="text-sm text-muted-foreground">
                {result.analysis.performanceGain === 'low' && 'Baixo impacto no dia a dia. No seu uso, você não sentirá grande diferença de velocidade entre os modelos comparados.'}
                {result.analysis.performanceGain === 'medium' && 'Ganho moderado. Você notará melhoria em tarefas mais pesadas e multitarefa.'}
                {result.analysis.performanceGain === 'high' && 'Grande evolução de desempenho. Diferença perceptível em todas as tarefas.'}
              </p>
            </div>
          </div>

          {/* Purchase Timing */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Momento da compra</h4>
              <p className="text-sm text-muted-foreground">
                {result.analysis.purchaseTiming === 'urgent' && 'Vale trocar logo. Seu aparelho atual pode estar limitando sua experiência.'}
                {result.analysis.purchaseTiming === 'no_rush' && 'Sem pressa. Se não for urgente, aguardar promoções pode tornar a troca ainda mais vantajosa.'}
                {result.analysis.purchaseTiming === 'wait' && 'Pode esperar. Considere aguardar o próximo lançamento para melhor custo-benefício.'}
              </p>
            </div>
          </div>

          {/* Cost-Benefit */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Custo-benefício</h4>
              <p className="text-sm text-muted-foreground">
                {result.analysis.costBenefit === 'poor' && 'Investimento questionável para o seu perfil de uso.'}
                {result.analysis.costBenefit === 'good' && 'Bom equilíbrio. O investimento faz sentido desde que fique dentro da faixa sugerida.'}
                {result.analysis.costBenefit === 'excellent' && 'Excelente relação custo-benefício para suas necessidades.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="glass rounded-xl p-6 mb-6 border-l-4 border-primary">
        <h3 className="font-heading font-semibold mb-3">🧠 Conclusão final</h3>
        <p className="text-muted-foreground">
          {result.conclusion}
        </p>
      </div>

      {/* Tips */}
      <div className="glass rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-heading font-semibold">Nossas dicas</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Compare preços em mais de uma loja</li>
          <li>• Considere vender seu produto atual</li>
          <li>• Evite trocar apenas por lançamento</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onNewComparison}
          className="gradient-primary px-8 rounded-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Nova comparação
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-8 rounded-full"
          onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(newProduct.name + ' preço'), '_blank')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Pesquisar preços
        </Button>
      </div>
    </div>
  );
};

export default ResultStep;
