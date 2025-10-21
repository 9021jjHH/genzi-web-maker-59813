import { Brain, Zap, Shield, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Zaawansowane Uczenie",
    description: "Modele AI trenowane na milionach przykładów, zapewniające najwyższą jakość wyników.",
  },
  {
    icon: Zap,
    title: "Błyskawiczna Wydajność",
    description: "Przetwarzanie w czasie rzeczywistym z opóźnieniem poniżej 100ms.",
  },
  {
    icon: Shield,
    title: "Bezpieczeństwo Danych",
    description: "Szyfrowanie end-to-end i pełna zgodność z RODO.",
  },
  {
    icon: Cpu,
    title: "Skalowalna Infrastruktura",
    description: "Automatyczne skalowanie dopasowane do Twoich potrzeb.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Dlaczego Nasza{" "}
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              Technologia AI
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Łączymy najnowsze osiągnięcia w dziedzinie sztucznej inteligencji
            z praktycznymi rozwiązaniami dla Twojego biznesu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative p-6 bg-gradient-card backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-glow-primary"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
