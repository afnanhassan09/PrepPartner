import { Check, ArrowRight, Sparkles } from "lucide-react";

const Pricing = () => {
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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-b from-background to-background-secondary">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div
            className="absolute top-1/3 -right-10 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto pt-32 px-4 text-center">
          <div className="space-y-8 relative">
            {/* Floating badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl animate-float">
              <span className="relative w-3 h-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">Choose Your Plan</span>
            </div>

            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-teal via-primary to-secondary bg-clip-text text-transparent animate-gradient-xy">
                Select Your Success Path
              </span>
            </h1>

            <p className="text-lg text-muted max-w-xl mx-auto relative">
              Find the perfect plan to accelerate your interview preparation
              journey
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="4"
                viewBox="0 0 100 4"
              >
                <path
                  d="M0 2 Q 25 0, 50 2 Q 75 4, 100 2"
                  stroke="#F3C178"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section - Modernized */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(243,193,120,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="relative group">
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                )}

                <div
                  className={`
                  relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl transition-all duration-500
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
                      <div className="bg-gradient-to-r from-primary to-teal px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
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
                      <span className="text-4xl font-bold bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-muted">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-muted group-hover:text-black transition-colors duration-300"
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
                        ? "bg-gradient-to-r from-primary to-teal text-white"
                        : "bg-white border-2 border-primary/10 hover:border-primary text-primary"
                    }
                    transition-all duration-300 group hover:shadow-lg hover:shadow-primary/20
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
