
import { ImageConverter } from "@/components/ImageConverter";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Converti e Ottimizza</span>
            <br />
            <span className="text-foreground">le Tue Immagini</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Ridimensiona, comprimi e converte le tue immagini con la massima qualità. 
            Veloce, sicuro e completamente privato.
          </p>
        </div>
      </section>

      {/* Main Converter */}
      <ImageConverter />

      {/* Features */}
      <Features />
    </div>
  );
};

export default Index;
