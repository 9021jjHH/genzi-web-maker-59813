const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-primary mb-2">
              AI Platform
            </h3>
            <p className="text-sm text-muted-foreground">
              Przyszłość technologii sztucznej inteligencji
            </p>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              O Nas
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Produkty
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Dokumentacja
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Kontakt
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 AI Platform. Wszystkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
