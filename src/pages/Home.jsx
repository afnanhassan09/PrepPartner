"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { Linkedin, Instagram, DiscIcon as Discord, ArrowRight } from "lucide-react"

const Home = () => {
  // State for FAQ accordion
  const [activeFaq, setActiveFaq] = useState(null)

  // State for How It Works section
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    {
      title: "Discover",
      description: "Complete your profile to personalize your preparation experience for your schools.",
      image: "https://framerusercontent.com/images/dNI530MgTN1a59vGU8RJQGUEV8.png",
    },
   
    {
      title: "Improve",
      description: "Track the progress of your scores and improve your interview performance.",
      image: "https://framerusercontent.com/images/la690jb3OMNsA27IfX5PG6j6qyM.png",
    },
  ]

  // References for scroll animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const aiPoweredRef = useRef(null)
  const personalizedRef = useRef(null)
  const scoringRef = useRef(null)
  const pricingRef = useRef(null)
  const howItWorksRef = useRef(null)
  const faqRef = useRef(null)
  const footerRef = useRef(null)

  // Refs for scroll-triggered animation in How It Works section
  const stepsContainerRef = useRef(null)
  const stepsRefs = useRef(steps.map(() => React.createRef()))

  const heroInView = useInView(heroRef, { once: false, threshold: 0.3 })
  const featuresInView = useInView(featuresRef, { once: false, threshold: 0.3 })
  const aiPoweredInView = useInView(aiPoweredRef, { once: false, threshold: 0.3 })
  const personalizedInView = useInView(personalizedRef, { once: false, threshold: 0.3 })
  const scoringInView = useInView(scoringRef, { once: false, threshold: 0.3 })
  const pricingInView = useInView(pricingRef, { once: false, threshold: 0.3 })
  const howItWorksInView = useInView(howItWorksRef, { once: false, threshold: 0.3 })
  const faqInView = useInView(faqRef, { once: false, threshold: 0.3 })
  const footerInView = useInView(footerRef, { once: false, threshold: 0.3 })

  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const aiPoweredControls = useAnimation()
  const personalizedControls = useAnimation()
  const scoringControls = useAnimation()
  const pricingControls = useAnimation()
  const howItWorksControls = useAnimation()
  const faqControls = useAnimation()
  const footerControls = useAnimation()

  // Trigger animations when elements come into view
  useEffect(() => {
    if (heroInView) heroControls.start("visible")
    if (featuresInView) featuresControls.start("visible")
    if (aiPoweredInView) aiPoweredControls.start("visible")
    if (personalizedInView) personalizedControls.start("visible")
    if (scoringInView) scoringControls.start("visible")
    if (pricingInView) pricingControls.start("visible")
    if (howItWorksInView) howItWorksControls.start("visible")
    if (faqInView) faqControls.start("visible")
    if (footerInView) footerControls.start("visible")
  }, [
    heroInView,
    featuresInView,
    aiPoweredInView,
    personalizedInView,
    scoringInView,
    pricingInView,
    howItWorksInView,
    faqInView,
    footerInView,
    heroControls,
    featuresControls,
    aiPoweredControls,
    personalizedControls,
    scoringControls,
    pricingControls,
    howItWorksControls,
    faqControls,
    footerControls,
  ])

  // Completely revised scroll-triggered animation for How It Works section
  useEffect(() => {
    if (!stepsContainerRef.current || !howItWorksRef.current) return

    let isAnimating = false
    let lastScrollTime = 0
    const scrollCooldown = 1000 // ms between scroll actions

    const handleWheel = (e) => {
      const section = howItWorksRef.current
      const sectionRect = section.getBoundingClientRect()
      const currentTime = new Date().getTime()

      // Check if we're in the section's viewport area
      const isInSection = 
        sectionRect.top <= window.innerHeight * 0.5 && 
        sectionRect.bottom >= window.innerHeight * 0.3
      
      // Allow natural scrolling if we're not in the section
      if (!isInSection) return true;
      
      // Determine scroll direction
      const scrollingDown = e.deltaY > 0

      // Check if we're at the first or last step and scrolling beyond section boundaries
      if ((activeStep === 0 && !scrollingDown) || 
          (activeStep === steps.length - 1 && scrollingDown)) {
        // Don't prevent default, allowing natural page scrolling
        return true;
      }
      
      // For all other cases within the section, control scrolling
      if (isInSection) {
        // Enforce cooldown between scroll actions
        if (currentTime - lastScrollTime < scrollCooldown || isAnimating) {
          e.preventDefault();
          return false;
        }
        
        // Prevent default to control the scrolling
        e.preventDefault();
        
        // Update scroll timestamp
        lastScrollTime = currentTime;
        isAnimating = true;
        
        // Update active step based on scroll direction
        setActiveStep((prevStep) => {
          const newStep = scrollingDown
            ? Math.min(steps.length - 1, prevStep + 1)
            : Math.max(0, prevStep - 1);
          
          return newStep;
        });
        
        // Reset animation lock after animation completes
        setTimeout(() => {
          isAnimating = false;
        }, scrollCooldown);
        
        return false;
      }
    };

    // Touch handling
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      const section = howItWorksRef.current;
      const sectionRect = section.getBoundingClientRect();
      const currentTime = new Date().getTime();
      
      // Check if we're in the section
      const isInSection = 
        sectionRect.top <= window.innerHeight * 0.5 && 
        sectionRect.bottom >= window.innerHeight * 0.3;
      
      if (!isInSection) return true;
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      const scrollingDown = diff > 0;
      
      // If we're at boundaries, allow natural scrolling
      if ((activeStep === 0 && !scrollingDown) || 
          (activeStep === steps.length - 1 && scrollingDown)) {
        return true;
      }
      
      // Only handle significant movements
      if (Math.abs(diff) > 30) {
        // Cooldown check
        if (currentTime - lastScrollTime < scrollCooldown || isAnimating) {
          e.preventDefault();
          return false;
        }
        
        e.preventDefault();
        lastScrollTime = currentTime;
        isAnimating = true;
        
        // Update active step
        setActiveStep((prevStep) => {
          return scrollingDown
            ? Math.min(steps.length - 1, prevStep + 1)
            : Math.max(0, prevStep - 1);
        });
        
        // Reset touch position
        touchStartY = touchY;
        
        // Reset animation lock
        setTimeout(() => {
          isAnimating = false;
        }, scrollCooldown);
      }
    };

    // Manual navigation with buttons (helpful for debugging)
    const handleManualNavigation = (step) => {
      if (!isAnimating) {
        isAnimating = true;
        setActiveStep(step);
        setTimeout(() => {
          isAnimating = false;
        }, scrollCooldown);
      }
    };
    
    // Add event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    // Expose navigation function to window for debugging
    window.navigateStep = handleManualNavigation;
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      delete window.navigateStep;
    };
  }, [steps.length, activeStep]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  }

  const pricingCardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // Enhanced animation variants
  const textFadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother animation
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const imageSlideVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const featureCardAnimation = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.2,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  // Also enhance the feature card animations to be more responsive
  const enhancedFeatureCardAnimation = {
    ...featureCardAnimation,
    onscreen: (i) => ({
                        opacity: 1,
                        y: 0,
      transition: {
        duration: 0.9,
        delay: i * 0.3,
        ease: [0.2, 0.65, 0.3, 0.9], // More natural easing
      },
    }),
    hover: {
      y: -12,
      boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    }
  }

  // FAQ data
  const faqs = [
    {
      question: "How does the AI interview simulator work?",
      answer:
        "Our AI uses advanced natural language processing to analyze your responses, providing real-time feedback on content, delivery, and body language.",
    },
    {
      question: "Can I practice specific types of interviews?",
      answer:
        "Yes! We offer specialized practice sessions for technical, behavioral, and industry-specific interviews.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We take data security seriously. All your practice sessions and personal information are encrypted and stored securely.",
    },
    {
      question: "How often is the question bank updated?",
      answer:
        "Our question bank is updated weekly with real questions from recent interviews across various industries.",
    },
  ]

  // Toggle FAQ
  const toggleFaq = (index) => {
    if (index === activeFaq) {
      setActiveFaq(null)
    } else {
      setActiveFaq(index)
    }
  }

  return (
    <div className="font-sans bg-background min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="px-6 md:px-12 pt-10 pb-20 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={heroControls}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          <motion.div variants={fadeInUp} className="md:w-1/2 mb-10 md:mb-0">
            <motion.p variants={fadeInUp} className="text-sm text-primary mb-4 font-medium">
              Join 50K+ other interviewees this year
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-serif text-teal mb-6 leading-tight">
              Master Your Interview Skills with AI
            </motion.h1>
            <motion.a
              variants={fadeInUp}
              href="/auth"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full inline-block hover:bg-opacity-90 transition-all text-sm font-medium"
            >
              Try for free now!
            </motion.a>
            <motion.p variants={fadeInUp} className="mt-6 text-muted max-w-md">
              Prepare for your next interview with confidence using our AI-powered platform that provides real-time
              feedback
            </motion.p>
          </motion.div>
          <motion.div variants={fadeInUp} className="md:w-1/2 relative">
            <motion.img
              variants={fadeInUp}
              src="https://framerusercontent.com/images/djH7Gm8aETNOspdayO4B1mFDUc.png?scale-down-to=1024"
              alt="AI Interviewer Demo"
              className="rounded-lg shadow-xl w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-background-secondary rounded-full z-[-1]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 bg-secondary rounded-full z-[-1]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Intro Section - Enhanced with modern animations */}
      <section 
        ref={featuresRef} 
        className="px-6 md:px-12 py-16 max-w-7xl mx-auto relative overflow-hidden"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={featuresControls}
          className="text-center mb-20"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif text-teal mb-6">
            Stand out with your answers
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted max-w-2xl mx-auto">
            Blending state-of-the-art AI with the most comprehensive interview data across industries.
          </motion.p>
        </motion.div>

        {/* Decorative background elements - Enhanced for more dynamic movement */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full z-0"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full z-0"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 15,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* AI-Powered Mock Interviews - Enhanced */}
        <div ref={aiPoweredRef} className="mb-36 relative z-10 pt-24 -mt-24 first-card">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.3 }}
            whileHover="hover"
            variants={enhancedFeatureCardAnimation}
            custom={0}
            className="flex flex-col md:flex-row items-center bg-white rounded-xl p-8 shadow-sm"
          >
            <motion.div variants={cardVariant} className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-serif text-teal mb-4">AI-Powered Mock Interviews</h3>
              <p className="text-muted mb-6">
                Our technology simulates realistic interview scenarios using advanced AI technology, providing users
                with a comprehensive and engaging practice experience.
              </p>
              <div className="space-y-4">
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Realtime interaction</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Realistic, back and forth conversation</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Personalized to your industry</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <img
                src="https://framerusercontent.com/images/6WUk79zhHusSDE4XBBlZ6WPXJrM.png"
                alt="AI Interviewer Screen"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Personalized Feedback - Enhanced */}
        <div ref={personalizedRef} className="mb-36 relative z-10 pt-24 -mt-24">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.3 }}
            whileHover="hover"
            variants={enhancedFeatureCardAnimation}
            custom={1}
            className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl p-8 shadow-sm"
          >
            <motion.div variants={cardVariant} className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
              <h3 className="text-2xl font-serif text-teal mb-4">Personalized Feedback</h3>
              <p className="text-muted mb-6">
                After each mock interview, PrepPartner analyzes your responses using comprehensive data from industry
                experts and hiring managers.
              </p>
              <div className="space-y-4">
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Actionable feedback</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Identification of strengths</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Highlighting areas for improvements</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <img
                src="https://framerusercontent.com/images/Zc9hZ2nZzd7Ue3HwJg72WB3I.png"
                alt="Personalized Feedback"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Comprehensive Scoring - Enhanced */}
        <div ref={scoringRef} className="mb-36 relative z-10 pt-24 -mt-24">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.3 }}
            whileHover="hover"
            variants={enhancedFeatureCardAnimation}
            custom={2}
            className="flex flex-col md:flex-row items-center bg-white rounded-xl p-8 shadow-sm"
          >
            <motion.div variants={cardVariant} className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-serif text-teal mb-4">Comprehensive Scoring</h3>
              <p className="text-muted mb-6">
                Assessing a score out of 100, broken down into key categories like communication skills, critical
                thinking, problem-solving, and professionalism.
              </p>
              <div className="space-y-4">
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Scoring based on industry hiring criteria</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Criteria analysis for each assessment element</p>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="bg-background-secondary p-2 rounded-full mr-3 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#09363E" />
                    </svg>
                  </div>
                  <p className="text-teal font-medium">Key observations including delivery</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <img
                src="https://framerusercontent.com/images/FhFSmnVC7tt2dhKC5k4RbP5wg.png"
                alt="Comprehensive Scoring"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.a
            href="/auth"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full inline-block hover:bg-opacity-90 transition-all text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try for free now!
          </motion.a>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="px-6 md:px-12 py-20 bg-background max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={pricingControls}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif text-teal mb-6">
            Simple pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted max-w-2xl mx-auto">
            Start with 5 free mock interviews
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pricing Card 1 */}
          <motion.div variants={pricingCardVariant} className="bg-white rounded-xl p-8 shadow-sm flex flex-col h-full">
            <p className="text-muted mb-4">Basic</p>
            <h3 className="text-4xl font-serif text-teal mb-6">Free</h3>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">5 Mock Interviews</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Basic AI Feedback</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Interview Question Bank</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Community Support</p>
              </li>
            </ul>
            <a
              href="/auth"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-center hover:bg-opacity-90 transition-all text-sm font-medium mt-auto"
            >
              Try for free now!
            </a>
          </motion.div>

          {/* Pricing Card 2 */}
          <motion.div
            variants={pricingCardVariant}
            className="bg-white rounded-xl p-8 shadow-sm flex flex-col h-full"
            custom={1}
          >
            <p className="text-muted mb-4">Pro</p>
            <h3 className="text-4xl font-serif text-teal mb-6">$29/month</h3>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Unlimited Mock Interviews</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Advanced AI Analysis</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Expert Review Sessions</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Interview Recording</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Custom Learning Path</p>
              </li>
            </ul>
            <a
              href="/auth"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-center hover:bg-opacity-90 transition-all text-sm font-medium mt-auto"
            >
              Try for free now!
            </a>
          </motion.div>

          {/* Pricing Card 3 */}
          <motion.div
            variants={pricingCardVariant}
            className="bg-white rounded-xl p-8 shadow-sm flex flex-col h-full"
            custom={2}
          >
            <p className="text-muted mb-4">Enterprise</p>
            <h3 className="text-4xl font-serif text-teal mb-6">Custom</h3>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Team Management</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Custom Question Sets</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Dedicated Support</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">Analytics Dashboard</p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3">✓</div>
                <p className="text-teal">API Access</p>
              </li>
            </ul>
            <a
              href="/auth"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-center hover:bg-opacity-90 transition-all text-sm font-medium mt-auto"
            >
              Contact Sales
            </a>
          </motion.div>
        </div>

        <motion.p variants={fadeInUp} className="text-center mt-6 text-muted">
          All plans come with a 7 day trial!
        </motion.p>
      </section>

      {/* How It Works Section - Premium design with scroll animation */}
      <section
        ref={howItWorksRef}
        className="py-20 overflow-hidden relative bg-gradient-to-b from-background-secondary to-background"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 20,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary/5"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 15,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={howItWorksControls}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp} 
              className="text-3xl md:text-5xl font-serif text-teal mb-4 relative inline-block"
            >
              How PrepPartner Works
              <motion.div 
                className="absolute -bottom-3 left-0 right-0 h-1 bg-primary rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: false }}
              />
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted max-w-2xl mx-auto text-lg">
              An AI-powered interview preparation platform designed to help job seekers
              <span className="text-primary font-medium"> ace their interviews </span>
              across all industries
            </motion.p>
          </motion.div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-6 mb-12 relative z-20">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: activeStep === index ? 1.2 : 1,
                  opacity: activeStep === index ? 1 : 0.5,
                }}
                transition={{ duration: 0.4 }}
                className={`w-3 h-3 rounded-full ${
                  activeStep === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Scroll-triggered animation container - Keep this container for scroll effects */}
          <div
            ref={stepsContainerRef}
            className="relative h-[600px] md:h-[500px] overflow-hidden sticky top-0"
          >
            {/* Fixed background - Now with premium styling */}
            <div className="absolute inset-0 z-0">
              <motion.div 
                className="absolute inset-0 bg-background-secondary/30 backdrop-blur-sm rounded-3xl" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Content area with AnimatePresence for smooth transitions */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-full max-w-6xl px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.6
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                  >
                    {/* Text content */}
                    <div className="order-2 md:order-1 mt-12 md:mt-0">
                      <motion.div
                        className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        Step {activeStep + 1} of {steps.length}
                      </motion.div>
                      
                      <motion.h3
                        className="text-3xl font-serif text-teal mb-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {steps[activeStep].title}
                      </motion.h3>
                      
                      <motion.p
                        className="text-muted text-lg mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {steps[activeStep].description}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <a
                          href="/auth"
                          className="bg-primary text-primary-foreground px-6 py-3 rounded-full inline-flex items-center hover:bg-opacity-90 transition-all text-sm font-medium group"
                        >
                          Get Started
                          <motion.span 
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              repeatType: "loop",
                              ease: "easeInOut" 
                            }}
                          >
                            <ArrowRight size={16} />
                          </motion.span>
                        </a>
                      </motion.div>
                    </div>

                    {/* Image with enhanced animation */}
                    <motion.div
                      className="order-1 md:order-2 relative"
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-2xl">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.img
                          src={steps[activeStep].image || "/placeholder.svg"}
                          alt={steps[activeStep].title}
                          className="w-full object-cover rounded-xl"
                          style={{ height: '340px' }}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                        
                        {/* Floating decorative elements */}
                        <motion.div 
                          className="absolute top-4 right-4 w-16 h-16 bg-primary/10 backdrop-blur-sm rounded-lg -rotate-6 z-20"
                          animate={{ 
                            rotate: [-6, 3, -6], 
                            y: [0, -5, 0] 
                          }}
                          transition={{ 
                            duration: 6, 
                            repeat: Infinity, 
                            repeatType: "reverse", 
                            ease: "easeInOut" 
                          }}
                        />
                        <motion.div 
                          className="absolute bottom-8 left-8 w-20 h-20 bg-secondary/10 backdrop-blur-sm rounded-lg rotate-12 z-20"
                          animate={{ 
                            rotate: [12, -5, 12], 
                            y: [0, 8, 0] 
                          }}
                          transition={{ 
                            duration: 7, 
                            repeat: Infinity, 
                            repeatType: "reverse", 
                            ease: "easeInOut",
                            delay: 1 
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Keep the scroll instructions and CTA */}
          <div className="text-center relative z-20 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="mb-8 text-sm text-muted"
            >
              <div className="flex justify-center items-center opacity-80">
                <span>Scroll to explore</span>
                <motion.div
                  className="ml-2"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↓
                </motion.div>
              </div>
            </motion.div>
            
            <motion.a
              href="/auth"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full inline-block hover:bg-opacity-90 transition-all text-base font-medium shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try for free now!
            </motion.a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate={faqControls} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif text-teal mb-6">
            Frequently Asked Questions
          </motion.h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={faqControls} className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={fadeInUp} className="mb-4 border-b border-border pb-4">
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-teal font-medium text-lg">{faq.question}</h3>
                <div className="text-teal transform transition-transform duration-300">
                  {activeFaq === index ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13H5v-2h14v2z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </button>
              <div
                className={`mt-2 text-muted overflow-hidden transition-all duration-300 ease-in-out ${
                  activeFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Redesigned Footer */}
      <footer ref={footerRef} className="bg-background-secondary py-12 mt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={footerControls}
          className="max-w-7xl mx-auto px-6 md:px-12"
        >
          {/* Social Media Links - Horizontal with arrows */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-12 space-y-6 md:space-y-0">
            <motion.a
              variants={fadeInUp}
              href="https://www.linkedin.com/company/preppartner/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal hover:text-primary transition-colors md:border-r md:border-border md:pr-6"
            >
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
              <ArrowRight className="ml-6 h-5 w-5 hidden md:inline-block" />
            </motion.a>

            <motion.a
              variants={fadeInUp}
              href="https://www.instagram.com/preppartner/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal hover:text-primary transition-colors md:border-r md:border-border md:px-6"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Instagram
              <ArrowRight className="ml-6 h-5 w-5 hidden md:inline-block" />
            </motion.a>

            <motion.a
              variants={fadeInUp}
              href="https://discord.gg/preppartner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-teal hover:text-primary transition-colors md:pl-6"
            >
              <Discord className="mr-2 h-5 w-5" />
              Discord
            </motion.a>
          </div>
        </motion.div>
      </footer>

     
    </div>
  )
}

export default Home

