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
                <button className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-semibold">
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 font-semibold">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative animate-fade-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 transform rotate-3"></div>
              <img
                src="/lovable-uploads/2a22cf78-3848-4d17-bf50-eba2cdadd105.png"
                alt="Interview preparation illustration"
                className="relative z-10 shadow-xl"
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
              <div key={index} className="p-6 bg-background-secondary hover:shadow-lg transition-all duration-300 animate-fade-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-teal mb-4">Success Stories</h2>
            <p className="text-muted max-w-2xl mx-auto">See how PrepPartner has helped others achieve their career goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="p-6 bg-white hover:shadow-lg transition-all duration-300 animate-fade-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-center mb-4">
                  <Award className="w-8 h-8 text-primary mr-2" />
                  <div>
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-muted">{story.role}</p>
                  </div>
                </div>
                <p className="text-muted mb-4">{story.story}</p>
                <div className="flex">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary" fill="#F3C178" />
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
            <h3 className="text-2xl font-bold mb-4">PrepPartner</h3>
            <p className="max-w-md">Your trusted partner in interview preparation. Join thousands of successful candidates who have achieved their career goals with PrepPartner.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li>support@preppartner.com</li>
              <li>1-800-PREP-NOW</li>
              <li>123 Interview Street</li>
              <li>Success City, SC 12345</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-teal-foreground/20">
          <p className="text-center">&copy; 2024 PrepPartner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;