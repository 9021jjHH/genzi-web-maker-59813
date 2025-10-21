import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIChat from "@/components/AIChat";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      
      {/* AI Chat Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Porozmawiaj z{" "}
              <span className="bg-clip-text text-transparent bg-gradient-primary">
                Naszym AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Przetestuj naszą zaawansowaną technologię sztucznej inteligencji
            </p>
          </div>
          <AIChat />
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
