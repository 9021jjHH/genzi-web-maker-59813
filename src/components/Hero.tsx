import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ai.jpg";
import { Sparkles, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero opacity-90 z-10" />
        <img 
          src={heroImage} 
          alt="AI Technology" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Przyszłość AI
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              Zaczyna Się Tutaj
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Odkryj moc sztucznej inteligencji następnej generacji. 
            Automatyzuj, analizuj i twórz z niezrównaną precyzją.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="group">
              Rozpocznij Za Darmo
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="lg">
              Zobacz Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Dokładność</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-muted-foreground">Operacji</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">&lt;100ms</div>
              <div className="text-sm text-muted-foreground">Czas Odpowiedzi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
