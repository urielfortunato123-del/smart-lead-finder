import { Building2, Database, Zap, TrendingUp } from "lucide-react";

const StatsBar = () => {
  const stats = [
    { icon: Building2, value: "50M+", label: "Empresas" },
    { icon: Database, value: "100%", label: "Atualizados" },
    { icon: Zap, value: "<3s", label: "Busca" },
    { icon: TrendingUp, value: "98%", label: "Precisão" },
  ];

  return (
    <section className="py-8 md:py-12 px-4 border-y border-border bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary flex items-center justify-center mb-2 md:mb-3">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;