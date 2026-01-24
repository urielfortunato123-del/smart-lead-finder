import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MessageSquare, Zap } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center px-4 py-12">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main headline */}
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
          A troca realmente{" "}
          <span className="text-gradient">vale a pena?</span>
        </h2>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Compare seu produto atual com o que você quer comprar e receba uma análise clara, 
          baseada no seu uso real — sem marketing, sem impulso, sem arrependimentos.
        </p>
        
        {/* CTA Button */}
        <Button 
          size="lg" 
          onClick={onStart}
          className="gradient-primary text-lg px-8 py-6 rounded-full shadow-glow hover:opacity-90 transition-all animate-slide-up group"
          style={{ animationDelay: '0.2s' }}
        >
          Começar comparação
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {/* How it works */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass rounded-xl p-6 text-left">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">1. Informe os produtos</h3>
            <p className="text-muted-foreground text-sm">
              Diga qual você tem hoje e qual pretende comprar.
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 text-left">
            <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">2. Conte como você usa</h3>
            <p className="text-muted-foreground text-sm">
              Uso diário, bateria, câmera e orçamento.
            </p>
          </div>
          
          <div className="glass rounded-xl p-6 text-left">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">3. Receba a análise</h3>
            <p className="text-muted-foreground text-sm">
              Um veredito claro: vale a pena ou não trocar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
