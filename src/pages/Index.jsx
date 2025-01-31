import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <h1 className="text-5xl sm:text-6xl font-bold text-teal leading-tight">
                PrepPartner: The advantage to edge the competition in your big interview!
              </h1>
              <p className="text-lg text-muted max-w-xl">
                Why practice with us? - don't need partner, constant practice, get fluent quicker, 
                get constant feedback, track your progress
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 font-semibold">
                  Start your interview prep
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/90 transition-all duration-200 font-semibold">
                  Try Demo
                </button>
              </div>
            </div>
            
            <div className="relative animate-fade-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl transform rotate-3"></div>
              <img
                src="/lovable-uploads/2a22cf78-3848-4d17-bf50-eba2cdadd105.png"
                alt="Interview preparation illustration"
                className="relative z-10 rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;