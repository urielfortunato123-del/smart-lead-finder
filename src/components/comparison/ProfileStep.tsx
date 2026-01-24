import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonState } from "@/types/comparison";

interface ProfileStepProps {
  profile: ComparisonState['profile'];
  onUpdate: (key: keyof ComparisonState['profile'], value: string) => void;
  onNext: () => void;
}

const ProfileStep = ({ profile, onUpdate, onNext }: ProfileStepProps) => {
  const isComplete = 
    profile.usageLevel && 
    profile.cameraImportance && 
    profile.batteryNeeds && 
    profile.budgetRange;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          Sobre o seu uso
        </h2>
        <p className="text-muted-foreground">
          Suas respostas ajustam a análise para a sua realidade.
        </p>
      </div>

      <div className="space-y-8">
        {/* Usage Level */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">
            1. Como você usa seu celular no dia a dia?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'basic', label: 'Básico', desc: 'Ligações, mensagens e redes sociais.' },
              { value: 'intermediate', label: 'Intermediário', desc: 'Fotos, vídeos, apps variados e multitarefa.' },
              { value: 'intense', label: 'Intenso', desc: 'Jogos, trabalho, edição de fotos e vídeos.' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate('usageLevel', option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  profile.usageLevel === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium block mb-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Camera Importance */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">
            2. Qual a importância da câmera para você?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'low', label: 'Baixa', desc: 'Fotos ocasionais são suficientes.' },
              { value: 'medium', label: 'Média', desc: 'Gosto de boas fotos no dia a dia.' },
              { value: 'high', label: 'Alta', desc: 'Fotografia é prioridade para mim.' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate('cameraImportance', option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  profile.cameraImportance === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium block mb-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Battery Needs */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">
            3. Quanto tempo você fica longe do carregador?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'few_hours', label: 'Poucas horas', desc: 'Sempre tenho tomada por perto.' },
              { value: 'all_day', label: 'O dia todo', desc: 'Carrego geralmente à noite.' },
              { value: 'more_than_day', label: 'Mais de um dia', desc: 'Preciso de bateria duradoura.' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate('batteryNeeds', option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  profile.batteryNeeds === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium block mb-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">
            4. Qual sua faixa de orçamento?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'economic', label: 'Econômico', desc: 'Até R$ 1.500' },
              { value: 'intermediate', label: 'Intermediário', desc: 'R$ 1.500 a R$ 4.000' },
              { value: 'premium', label: 'Premium', desc: 'Acima de R$ 4.000' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onUpdate('budgetRange', option.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  profile.budgetRange === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium block mb-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!isComplete}
          className="gradient-primary px-8 rounded-full"
        >
          Ver resultado
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileStep;
