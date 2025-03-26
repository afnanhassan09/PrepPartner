"use client";

import { ArrowRight, CheckCircle, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect, useRef } from "react";
//how to import css  ?
import "./index.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Index = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-[#3DD598]" />,
      title: "Expert Guidance",
      description: "Get personalized feedback from industry professionals",
    },
    {
      icon: <Users className="w-8 h-8 text-[#3DD598]" />,
      title: "Mock Interviews",
      description: "Practice with our AI-powered interview simulator",
    },
    {
      icon: <Star className="w-8 h-8 text-[#3DD598]" />,
      title: "Real Questions",
      description: "Access our database of real interview questions",
    },
  ];

  const successStories = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      story: "PrepPartner helped me land my dream job!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Meta",
      story: "The mock interviews were incredibly realistic.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Data Scientist at Amazon",
      story: "Best interview preparation platform!",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "5 Mock Interviews",
        "Basic AI Feedback",
        "Interview Question Bank",
        "Community Support",
      ],
      recommended: false,
    },
    {
      name: "Pro",
      price: "$29/month",
      features: [
        "Unlimited Mock Interviews",
        "Advanced AI Analysis",
        "Expert Review Sessions",
        "Interview Recording",
        "Custom Learning Path",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Team Management",
        "Custom Question Sets",
        "Dedicated Support",
        "Analytics Dashboard",
        "API Access",
      ],
      recommended: false,
    },
  ];

  const stats = [
    { value: "50K+", label: "Success Stories" },
    { value: "95%", label: "Success Rate" },
    { value: "1000+", label: "Interview Questions" },
    { value: "24/7", label: "AI Support" },
  ];

  useEffect(() => {
    // Create a context for GSAP animations
    const ctx = gsap.context(() => {
      // Hero section entrance animation
      const heroTimeline = gsap.timeline();
      heroTimeline
        .from(".hero-badge", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".hero-heading span",
          {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-image-container",
          {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8"
        )
        .from(
          ".floating-stat",
          {
            opacity: 0,
            scale: 0.5,
            stagger: 0.2,
            duration: 0.6,
            ease: "back.out(2)",
          },
          "-=0.6"
        );

      // Function to create animations for section titles and content
      const animateSection = (sectionClass, itemClass) => {
        // Animate section title (appears at 50% of viewport - middle of screen)
        gsap.from(`${sectionClass} .text-center`, {
          scrollTrigger: {
            trigger: `${sectionClass} .text-center`,
            start: "top 50%", // Middle of the viewport
            toggleActions: "play none none none",
            once: true,
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate section items
        gsap.utils
          .toArray(`${sectionClass} ${itemClass}`)
          .forEach((item, index) => {
            gsap.from(item, {
              scrollTrigger: {
                trigger: item,
                start: "top 70%", // Appears before reaching the middle
                toggleActions: "play none none none",
                once: true,
              },
              opacity: 0,
              y: 40,
              duration: 0.7,
              ease: "back.out(1.7)",
              delay: 0.1 * index, // Stagger effect
            });
          });
      };

      // Animate each section
      animateSection(".features-section", ".feature-card");
      animateSection(".success-stories", ".success-story");
      animateSection(".stats-section", ".stat-card");
      animateSection(".faq-section", ".faq-item");

      // Special handling for CTA section (different structure)
      gsap.from(".cta-heading", {
        scrollTrigger: {
          trigger: ".cta-heading",
          start: "top 50%", // Middle of the viewport
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".cta-description", {
        scrollTrigger: {
          trigger: ".cta-description",
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.from(".cta-button", {
        scrollTrigger: {
          trigger: ".cta-button",
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      gsap.from(".cta-badge", {
        scrollTrigger: {
          trigger: ".cta-badge",
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 0,
        scale: 0.5,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(2)",
      });

      // Parallax effects
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
        y: (i, el) => -150 * Number.parseFloat(el.getAttribute("data-speed")),
        ease: "none",
      });
    }, mainRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  // Function to set refs for feature cards
  const setFeatureCardRef = (el, index) => {
    featureCardsRef.current[index] = el;
  };

  return (
    <div ref={mainRef} className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-[#E8F5E9]">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div
            className="parallax-bg absolute top-1/4 -left-10 w-72 h-72 bg-[#3DD598]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            data-speed="0.5"
          ></div>
          <div
            className="parallax-bg absolute top-1/3 -right-10 w-72 h-72 bg-[#D1C4E9]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "2s" }}
            data-speed="0.8"
          ></div>
          <div
            className="parallax-bg absolute -bottom-8 left-1/2 w-72 h-72 bg-[#004D40]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "4s" }}
            data-speed="0.3"
          ></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 pt-19 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative">
              {/* Floating badge */}
              <div className="hero-badge inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl animate-float">
                <span className="relative w-3 h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#004D40] opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004D40]"></span>
                </span>
                <span className="text-sm font-medium">
                  PrepPartner: Your Path to Interview Success
                </span>
              </div>

              {/* Modern gradient heading */}
              <h1 className="hero-heading text-6xl font-bold leading-tight">
                <span className="inline-block bg-gradient-to-r from-[#004D40] via-[#3DD598] to-[#D1C4E9] bg-clip-text text-transparent animate-gradient-xy">
                  Master your interview skills with
                </span>
                <br />
                <span className="inline-block">realtime feedback,</span>
                <br />
                <span className="relative inline-block">
                  AI-powered practice sessions.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5"
                      stroke="#3DD598"
                      strokeWidth="3"
                      fill="none"
                      className="animate-pulse-glow"
                    />
                  </svg>
                </span>
              </h1>

              <p className="hero-description text-lg text-[#6B7280] max-w-xl">
                Prepare for your next interview with confidence using our
                AI-powered platform that provides real-time feedback and
                personalized coaching.
              </p>

              {/* Modern CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  onClick={() => navigate("/interview")}
                  className="hero-cta group relative px-8 py-4 bg-[#004D40] overflow-hidden rounded-full transition-all duration-300"
                >
                  <div className="absolute inset-0 w-0 bg-[#3DD598] transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                  <span className="relative text-white group-hover:text-white flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <button className="hero-cta relative px-8 py-4 bg-white/80 backdrop-blur-sm rounded-full border border-[#E2E8F0] hover:border-[#3DD598] transition-all duration-300 hover:shadow-lg hover:shadow-[#3DD598]/20">
                  <span className="relative flex items-center justify-center">
                    Watch Demo
                    <span className="ml-2 relative w-5 h-5 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DD598] opacity-20"></span>
                      <span className="relative block w-3 h-3 bg-[#3DD598] rounded-full"></span>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Modern image section with floating elements */}
            <div className="hero-image-container relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3DD598]/10 to-[#D1C4E9]/10 rounded-2xl transform rotate-3 animate-pulse-glow"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://media.datacamp.com/cms/74e82d72d2b6161c1fb1ddc40dc77bad.png"
                  alt="Platform preview"
                  className="w-full h-auto transform transition-transform hover:scale-105 duration-500"
                />
                {/* Floating stats cards */}
                <div
                  className="floating-stat absolute right-1 top-1 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                    <div className="text-2xl font-bold text-[#004D40]">95%</div>
                    <div className="text-sm text-[#6B7280]">Success Rate</div>
                  </div>
                </div>
                <div
                  className="floating-stat absolute left-1 bottom-1 animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                    <div className="text-2xl font-bold text-[#3DD598]">
                      24/7
                    </div>
                    <div className="text-sm text-[#6B7280]">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Completely Redesigned */}
      <section
        ref={featuresRef}
        className="features-section py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(61,213,152,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#3DD598]/10 rounded-full blur-xl animate-pulse"></div>
            <span className="relative inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#3DD598]/20 to-[#004D40]/20 text-[#004D40] text-sm font-medium">
              <span className="absolute inset-0 rounded-full bg-[#3DD598] animate-ping opacity-20"></span>
              Our Features
            </span>
            <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-[#004D40] via-[#3DD598] to-[#D1C4E9] bg-clip-text text-transparent">
              Why Choose PrepPartner?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => setFeatureCardRef(el, index)}
                className="feature-card relative group"
              >
                {/* Animated background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3DD598] to-[#004D40] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                {/* Main content */}
                <div className="relative flex flex-col items-center">
                  {/* Floating icon */}
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3DD598] to-[#004D40] rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                    <div className="absolute inset-0.5 bg-white rounded-3xl flex items-center justify-center">
                      <div className="transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Text content with floating effect */}
                  <div className="relative text-center group-hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-[#6B7280] group-hover:text-black transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#3DD598]/5 rounded-full blur-xl group-hover:bg-[#3DD598]/20 transition-colors duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section - Updated Design */}
      <section className="success-stories py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3DD598]/5 to-[#D1C4E9]/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="px-4 py-2 rounded-full bg-[#004D40]/10 text-[#004D40] text-sm font-medium mb-4 inline-block">
              Testimonials
            </span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent mb-4">
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="success-story group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3DD598] to-[#D1C4E9] rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#3DD598]/20 hover:-translate-y-2">
                  <div className="absolute -right-4 -top-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#004D40] to-[#3DD598] rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center mb-6 gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3DD598]/20 to-[#D1C4E9]/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#004D40]">
                        {story.name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#004D40]">
                        {story.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">{story.role}</p>
                    </div>
                  </div>

                  <blockquote className="relative mb-6">
                    <div className="absolute -left-2 -top-2 text-4xl text-[#3DD598] opacity-20">
                      "
                    </div>
                    <p className="text-[#6B7280] relative z-10 italic pl-4">
                      {story.story}
                    </p>
                  </blockquote>

                  <div className="flex space-x-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#FFD166] transform transition-all duration-300 group-hover:scale-110 hover:rotate-12"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Modernized */}
      <section className="stats-section py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#E8F5E9]/30"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="stats-heading text-5xl font-bold bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent mb-4">
              Our Impact
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card relative group">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3DD598]/20 to-[#004D40]/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                {/* Main content */}
                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-[#3DD598]/10 group-hover:border-[#3DD598]/30 transition-all duration-300 hover:transform hover:-translate-y-2">
                  {/* Floating icon */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#3DD598] to-[#004D40] rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="text-4xl font-bold bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent mb-2 animate-pulse">
                    <div className="stat-number">{stat.value}</div>
                  </div>
                  <div className="text-[#6B7280] relative">
                    {stat.label}
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#3DD598] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Updated Design */}
      <section className="faq-section py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 rounded-full bg-[#D1C4E9] text-[#004D40] text-sm font-medium mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent">
              Common Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "How does the AI interview simulator work?",
                a: "Our AI uses advanced natural language processing to analyze your responses, providing real-time feedback on content, delivery, and body language.",
              },
              {
                q: "Can I practice specific types of interviews?",
                a: "Yes! We offer specialized practice sessions for technical, behavioral, and industry-specific interviews.",
              },
              {
                q: "Is my data secure?",
                a: "We take data security seriously. All your practice sessions and personal information are encrypted and stored securely.",
              },
              {
                q: "How often is the question bank updated?",
                a: "Our question bank is updated weekly with real questions from recent interviews across various industries.",
              },
            ].map((faq, index) => (
              <div key={index} className="faq-item group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3DD598] to-[#004D40] rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#3DD598]/20 hover:-translate-y-2">
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-[#004D40] to-[#3DD598] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-white font-bold">Q</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-[#004D40] group-hover:text-[#3DD598] transition-colors duration-300">
                    {faq.q}
                  </h3>
                  <p className="text-[#6B7280] group-hover:text-black transition-colors duration-300">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modernized */}
      <section className="cta-section py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3DD598]/10 to-[#004D40]/10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(61,213,152,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="space-y-8">
            <h2 className="cta-heading text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#004D40] to-[#3DD598] bg-clip-text text-transparent">
                Ready to Ace Your
              </span>
              <br />
              <span className="relative inline-block mt-2">
                Next Interview?
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#3DD598] to-[#004D40]"></div>
              </span>
            </h2>

            <p className="cta-description text-lg text-[#6B7280] max-w-2xl mx-auto">
              Join thousands of successful professionals who transformed their
              interview performance with PrepPartner
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="cta-button group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-gradient-to-r from-[#3DD598] to-[#004D40] transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-white transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative text-white group-hover:text-[#004D40] flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Floating badges */}
            <div
              className="cta-badge absolute -top-4 -left-4 animate-float"
              style={{ animationDelay: "0s" }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl">
                <CheckCircle className="w-6 h-6 text-[#3DD598]" />
              </div>
            </div>
            <div
              className="cta-badge absolute -bottom-4 -right-4 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl">
                <Star className="w-6 h-6 text-[#3DD598]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
