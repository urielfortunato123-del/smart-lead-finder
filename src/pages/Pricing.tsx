import { Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  searches_per_day: number;
  duration_months: number;
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    description: "Para começar a prospectar",
    price: 0,
    searches_per_day: 1,
    duration_months: 0,
    features: [
      "1 consulta por dia",
      "Salvar até 10 leads",
      "Exportar para CSV",
      "Acesso ao WhatsApp",
    ],
  },
  {
    id: "monthly",
    name: "Mensal",
    description: "Ideal para SDRs ativos",
    price: 49.90,
    searches_per_day: 200,
    duration_months: 1,
    features: [
      "200 consultas por dia",
      "Leads ilimitados",
      "Exportar para CSV",
      "Acesso ao WhatsApp",
      "Histórico completo",
      "Suporte prioritário",
    ],
  },
  {
    id: "quarterly",
    name: "Trimestral",
    description: "Economize 10%",
    price: 134.73,
    originalPrice: 149.70,
    searches_per_day: 250,
    duration_months: 3,
    popular: true,
    features: [
      "250 consultas por dia",
      "Leads ilimitados",
      "Exportar para CSV",
      "Acesso ao WhatsApp",
      "Histórico completo",
      "Suporte prioritário",
      "10% de desconto",
    ],
  },
  {
    id: "semiannual",
    name: "Semestral",
    description: "Economize 15%",
    price: 254.49,
    originalPrice: 299.40,
    searches_per_day: 300,
    duration_months: 6,
    features: [
      "300 consultas por dia",
      "Leads ilimitados",
      "Exportar para CSV",
      "Acesso ao WhatsApp",
      "Histórico completo",
      "Suporte prioritário",
      "15% de desconto",
    ],
  },
  {
    id: "annual",
    name: "Anual",
    description: "Maior economia",
    price: 449.10,
    originalPrice: 598.80,
    searches_per_day: 400,
    duration_months: 12,
    features: [
      "400 consultas por dia",
      "Leads ilimitados",
      "Exportar para CSV",
      "Acesso ao WhatsApp",
      "Histórico completo",
      "Suporte prioritário",
      "25% de desconto",
      "Acesso antecipado a novidades",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // TODO: Implementar pagamento
    console.log("Selected plan:", planId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              Escolha o plano ideal para você
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente e faça upgrade quando precisar de mais consultas
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative gradient-card rounded-2xl border p-5 md:p-6 shadow-card transition-all duration-300 hover:shadow-elevated ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="mb-4 md:mb-6">
                  <h3 className="font-heading font-bold text-lg md:text-xl mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4 md:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-heading font-bold">
                      {plan.price === 0 ? "Grátis" : formatPrice(plan.price)}
                    </span>
                    {plan.duration_months > 0 && (
                      <span className="text-xs md:text-sm text-muted-foreground">
                        /{plan.duration_months === 1 ? "mês" : `${plan.duration_months} meses`}
                      </span>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through mt-1">
                      De {formatPrice(plan.originalPrice)}
                    </p>
                  )}
                  {plan.duration_months > 1 && (
                    <p className="text-xs text-accent mt-1">
                      {formatPrice(plan.price / plan.duration_months)}/mês
                    </p>
                  )}
                </div>

                <Button
                  variant={plan.popular ? "hero" : plan.id === "free" ? "outline" : "default"}
                  className="w-full mb-4 md:mb-6"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.id === "free" ? "Começar Grátis" : "Assinar"}
                </Button>

                <ul className="space-y-2 md:space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs md:text-sm">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-12 md:mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                Cancele a qualquer momento. Sem taxas ocultas.
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;