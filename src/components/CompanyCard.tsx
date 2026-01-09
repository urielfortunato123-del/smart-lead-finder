import { Building2, MapPin, Phone, Mail, Globe, Copy, Check, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveLead } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyCardProps {
  company: Company;
  index: number;
  onSaved?: () => void;
}

const CompanyCard = ({ company, index, onSaved }: CompanyCardProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copiado!",
      description: `${field} copiado para a área de transferência`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveLead = async () => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para salvar leads",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveLead(company);
      setIsSaved(true);
      toast({
        title: "Lead salvo!",
        description: `${company.name} foi adicionado aos seus leads`,
      });
      onSaved?.();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o lead",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsApp = () => {
    if (!company.phone) return;
    
    // Limpar telefone - remover tudo que não é número
    const cleanPhone = company.phone.replace(/\D/g, '');
    
    // Garantir que tenha o código do país
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    const message = encodeURIComponent(
      `Olá! Encontrei sua empresa através do LeadFinder e gostaria de conhecer mais sobre os serviços da ${company.name}.`
    );
    
    // Usar web.whatsapp.com para desktop - funciona melhor
    window.open(`https://web.whatsapp.com/send?phone=${phoneWithCountry}&text=${message}`, '_blank');
  };

  return (
    <div
      className="gradient-card rounded-xl border border-border p-4 md:p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/50 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-base md:text-lg text-foreground truncate" title={company.name}>
              {company.name}
            </h3>
            <span className="text-xs md:text-sm text-accent font-medium truncate block">
              {company.sector}
            </span>
          </div>
        </div>
        {company.size && (
          <span className="hidden md:inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground shrink-0 whitespace-nowrap">
            {company.size}
          </span>
        )}
      </div>

      <div className="space-y-2 md:space-y-3 text-sm">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              CNPJ
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="font-mono text-xs md:text-sm text-foreground">
              {company.cnpj}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-7 md:w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(company.cnpj, "CNPJ")}
            >
              {copiedField === "CNPJ" ? (
                <Check className="w-3 h-3 text-accent" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0" />
          <span className="text-xs md:text-sm line-clamp-2">
            {company.address}, {company.city} - {company.state}
          </span>
        </div>

        {company.phone && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{company.phone}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-7 md:w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(company.phone!, "Telefone")}
            >
              {copiedField === "Telefone" ? (
                <Check className="w-3 h-3 text-accent" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}

        {company.email && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
              <span className="text-xs md:text-sm truncate">{company.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-7 md:w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
              onClick={() => copyToClipboard(company.email!, "Email")}
            >
              {copiedField === "Email" ? (
                <Check className="w-3 h-3 text-accent" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}

        {company.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-primary hover:underline truncate"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs md:text-sm"
          onClick={handleSaveLead}
          disabled={isSaving || isSaved}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 text-accent" />
              Salvo
            </>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
              Salvar
            </>
          )}
        </Button>
        {company.phone && (
          <Button
            variant="accent"
            size="sm"
            className="flex-1 h-9 text-xs md:text-sm"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
            WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;