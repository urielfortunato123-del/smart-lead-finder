import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Mail, Trash2, MessageCircle, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SavedLead, getSavedLeads, updateLeadStatus, updateLeadNotes, deleteLead } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const statusColors: Record<SavedLead['status'], string> = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-yellow-500/20 text-yellow-400',
  qualified: 'bg-green-500/20 text-green-400',
  proposal: 'bg-purple-500/20 text-purple-400',
  closed: 'bg-emerald-500/20 text-emerald-400',
  lost: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<SavedLead['status'], string> = {
  new: 'Novo',
  contacted: 'Contatado',
  qualified: 'Qualificado',
  proposal: 'Proposta',
  closed: 'Fechado',
  lost: 'Perdido',
};

const Leads = () => {
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  const loadLeads = async () => {
    setIsLoading(true);
    const data = await getSavedLeads();
    setLeads(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (leadId: string, status: SavedLead['status']) => {
    try {
      await updateLeadStatus(leadId, status);
      setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
      toast({
        title: 'Status atualizado',
        description: `Lead marcado como ${statusLabels[status]}`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = async (leadId: string) => {
    try {
      await updateLeadNotes(leadId, notesText);
      setLeads(leads.map(l => l.id === leadId ? { ...l, notes: notesText } : l));
      setEditingNotes(null);
      toast({
        title: 'Notas salvas',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as notas',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setLeads(leads.filter(l => l.id !== leadId));
      toast({
        title: 'Lead removido',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o lead',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsApp = (phone: string, companyName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá! Sou da equipe de vendas e gostaria de conversar sobre uma parceria com a ${companyName}.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Meus Leads</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {leads.length} lead{leads.length !== 1 ? 's' : ''} salvo{leads.length !== 1 ? 's' : ''}
            </p>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-2">
                Nenhum lead salvo
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 px-4">
                Faça uma busca e salve empresas para gerenciá-las aqui
              </p>
              <Button variant="hero" onClick={() => navigate('/')}>
                Buscar Leads
              </Button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="gradient-card rounded-xl border border-border p-4 md:p-6 shadow-card"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow shrink-0">
                        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-base md:text-lg truncate">
                          {lead.company_name}
                        </h3>
                        <p className="text-xs md:text-sm text-accent">{lead.sector}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2 mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground">
                          {lead.cnpj && (
                            <span className="font-mono truncate">{lead.cnpj}</span>
                          )}
                          {lead.city && lead.state && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                              <span className="truncate">{lead.city} - {lead.state}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes section */}
                    <div className="pt-3 md:pt-4 border-t border-border">
                      {editingNotes === lead.id ? (
                        <div className="flex gap-2">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Adicione notas sobre este lead..."
                            className="flex-1 bg-secondary/50 border border-border rounded-lg p-2 md:p-3 text-xs md:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={2}
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 md:h-8 md:w-8"
                              onClick={() => handleSaveNotes(lead.id)}
                            >
                              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 md:h-8 md:w-8"
                              onClick={() => setEditingNotes(null)}
                            >
                              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNotes(lead.id);
                            setNotesText(lead.notes || '');
                          }}
                          className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="line-clamp-1">{lead.notes || 'Adicionar notas...'}</span>
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as SavedLead['status'])}
                        className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border-0 cursor-pointer ${statusColors[lead.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value} className="bg-card text-foreground">
                            {label}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2 ml-auto">
                        {lead.phone && (
                          <Button
                            variant="accent"
                            size="sm"
                            className="h-8 text-xs md:text-sm"
                            onClick={() => handleWhatsApp(lead.phone!, lead.company_name)}
                          >
                            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(lead.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leads;