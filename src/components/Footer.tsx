const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          Desenvolvido por{" "}
          <span className="font-semibold text-foreground">
            Uriel da Fonseca Fortunato
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} LeadFinder. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;