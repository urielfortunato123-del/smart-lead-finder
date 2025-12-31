import { Building2, MapPin, Phone, Mail, Globe, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CompanyCardProps {
  company: Company;
  index: number;
}

const CompanyCard = ({ company, index }: CompanyCardProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copiado!",
      description: `${field} copiado para a área de transferência`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className="gradient-card rounded-xl border border-border p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/50 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {company.name}
            </h3>
            <span className="text-sm text-accent font-medium">
              {company.sector}
            </span>
          </div>
        </div>
        {company.size && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
            {company.size}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              CNPJ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-foreground">
              {company.cnpj}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(company.cnpj, "CNPJ")}
            >
              {copiedField === "CNPJ" ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">
            {company.address}, {company.city} - {company.state}
          </span>
        </div>

        {company.phone && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{company.phone}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(company.phone!, "Telefone")}
            >
              {copiedField === "Telefone" ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        )}

        {company.email && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{company.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(company.email!, "Email")}
            >
              {copiedField === "Email" ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        )}

        {company.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
