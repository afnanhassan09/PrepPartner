import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations on component mount
    setIsVisible(true);
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "per month",
      description: "Perfect for getting started",
      features: [
        "5 Mock Interviews per month",
        "Basic AI feedback",
        "Interview question database",
        "Email support",
        "Practice assessments",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      description: "Most popular choice",
      features: [
        "Unlimited Mock Interviews",
        "Advanced AI feedback",
        "Full question database",
        "Priority support",
        "Custom learning path",
        "Resume review",
        "Industry expert feedback",
      ],
      buttonText: "Try Professional",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For serious candidates",
      features: [
        "All Professional features",
        "1-on-1 mentoring sessions",
        "Custom interview scenarios",
        "Portfolio review",
        "Career strategy planning",
        "Job placement assistance",
        "Lifetime access to resources",
      ],
      buttonText: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Pricing Cards Section with Animations */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-teal/5 bg-[length:20px_20px] animate-gradient-xy"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-[#09363E] mb-4">
              Plans & Pricing
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Choose a plan that works for you. All plans include core features
              to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: `fade-up 0.5s ease-out ${index * 150}ms both`,
                }}
              >
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                )}

                <div
                  className={`
                  relative bg-background/80 backdrop-blur-sm p-8 rounded-3xl transition-all duration-500
                  hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2
                  ${
                    plan.highlighted
                      ? "border-2 border-primary"
                      : "border border-primary/10"
                  }
                `}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary to-teal px-4 py-2 rounded-full text-primary-foreground text-sm font-medium flex items-center gap-2 animate-pulse-glow">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted mb-4">{plan.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                        {plan.price}
                      </span>
                      <span className="text-muted">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-muted group-hover:text-foreground transition-colors duration-300"
                        style={{
                          animationDelay: `${
                            index * 100 + featureIndex * 50
                          }ms`,
                          animation: `slide-in 0.4s ease-out ${
                            index * 100 + featureIndex * 50
                          }ms both`,
                        }}
                      >
                        <div className="mr-2 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`
                    w-full py-4 px-6 rounded-full flex items-center justify-center gap-2
                    ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-teal text-primary-foreground"
                        : "bg-background border-2 border-primary/10 hover:border-primary text-primary"
                    }
                    transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20
                  `}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
