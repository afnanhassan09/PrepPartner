import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle, Star, Users, Award } from 'lucide-react';

const Index = () => {
  const features = [
    { icon: <CheckCircle className="w-8 h-8 text-primary" />, title: "Expert Guidance", description: "Get personalized feedback from industry professionals" },
    { icon: <Users className="w-8 h-8 text-primary" />, title: "Mock Interviews", description: "Practice with our AI-powered interview simulator" },
    { icon: <Star className="w-8 h-8 text-primary" />, title: "Real Questions", description: "Access our database of real interview questions" }
  ];

  const successStories = [
    { name: "Sarah Johnson", role: "Software Engineer at Google", story: "PrepPartner helped me land my dream job!", rating: 5 },
    { name: "Michael Chen", role: "Product Manager at Meta", story: "The mock interviews were incredibly realistic.", rating: 5 },
    { name: "Emily Davis", role: "Data Scientist at Amazon", story: "Best interview preparation platform!", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <h1 className="text-5xl sm:text-6xl font-bold text-teal leading-tight">
                PrepPartner: Your Path to Interview Success
              </h1>
              <p className="text-lg text-muted max-w-xl">
                Master your interview skills with real-time feedback, AI-powered practice sessions, and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:translate-y-[-2px] hover:shadow-lg">
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground transition-all duration-300 hover:bg-secondary/90 hover:translate-y-[-2px] hover:shadow-lg">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative animate-fade-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 transform rotate-3 transition-transform hover:rotate-0 duration-500"></div>
              <img
                src="/lovable-uploads/2a22cf78-3848-4d17-bf50-eba2cdadd105.png"
                alt="Interview preparation illustration"
                className="relative z-10 shadow-xl transition-transform hover:scale-105 duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-teal mb-4">Why Choose PrepPartner?</h2>
            <p className="text-muted max-w-2xl mx-auto">We provide the tools and resources you need to succeed in your interviews</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 bg-background-secondary hover:bg-white transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 animate-fade-up group" 
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-4 transform transition-transform group-hover:scale-110 duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted group-hover:text-black transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-teal mb-4">Success Stories</h2>
            <p className="text-muted max-w-2xl mx-auto">See how PrepPartner has helped others achieve their career goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 hover:bg-gradient-to-br hover:from-primary/10 hover:to-secondary/10 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <Award className="w-12 h-12 text-primary mr-4 transform transition-transform group-hover:rotate-12 duration-300" />
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{story.name}</h3>
                    <p className="text-sm text-muted group-hover:text-black transition-colors duration-300">{story.role}</p>
                  </div>
                </div>
                <p className="text-muted mb-6 group-hover:text-black transition-colors duration-300 text-lg italic">"{story.story}"</p>
                <div className="flex space-x-1">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-6 h-6 text-primary transform transition-all duration-300 group-hover:scale-110 hover:rotate-12" 
                      fill="#F3C178"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal text-teal-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 hover:text-primary transition-colors duration-300">PrepPartner</h3>
            <p className="max-w-md hover:text-white transition-colors duration-300">Your trusted partner in interview preparation. Join thousands of successful candidates who have achieved their career goals with PrepPartner.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Pricing', 'Resources', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block transform"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              {[
                'support@preppartner.com',
                '1-800-PREP-NOW',
                '123 Interview Street',
                'Success City, SC 12345'
              ].map((item) => (
                <li 
                  key={item}
                  className="hover:text-white transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-teal-foreground/20">
          <p className="text-center hover:text-white transition-colors duration-300">&copy; 2024 PrepPartner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;