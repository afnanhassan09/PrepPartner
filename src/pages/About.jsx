import {
  Users,
  BookOpen,
  Target,
  Award,
  Quote,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTeam, setShowTeam] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const statsTimer = setTimeout(() => {
      setShowStats(true);
    }, 800);

    const teamTimer = setTimeout(() => {
      setShowTeam(true);
    }, 1600);

    return () => {
      clearTimeout(statsTimer);
      clearTimeout(teamTimer);
    };
  }, []);

  const teamMembers = [
    {
      name: "Jessica Wales",
      role: "Lead AI Researcher",
      quote: "Venus is the second planet from the Sun",
    },
    {
      name: "Paul Doe",
      role: "Interview Expert",
      quote: "Mercury is the closest planet to the Sun",
    },
    {
      name: "Nina Collins",
      role: "Career Coach",
      quote: "Jupiter was named after a Roman god",
    },
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "10,000+",
      label: "Students Helped",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      value: "95%",
      label: "Success Rate",
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: "50+",
      label: "Partner Companies",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "4.9/5",
      label: "Average Rating",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-background to-background-secondary">
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

        <div className="max-w-7xl mx-auto pt-32 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative">
              {/* Floating badge with animation */}
              <div
                className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl animate-float transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <span className="relative w-3 h-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">About PrepPartner</span>
              </div>

              {/* Heading with animation */}
              <h1
                className={`text-6xl font-bold leading-tight transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <span className="bg-gradient-to-r from-teal via-primary to-secondary bg-clip-text text-transparent animate-gradient-xy">
                  Our Mission to Transform
                </span>
                <br />
                Interview Preparation
              </h1>

              {/* Paragraph with animation */}
              <p
                className={`text-lg text-muted max-w-xl relative transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                At PrepPartner, we're dedicated to empowering job seekers with
                the tools and confidence they need to succeed in their career
                journey.
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

            {/* Image with animation */}
            <div
              className={`relative transition-all duration-1000 transform ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl transform rotate-3 animate-pulse-glow"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://img.freepik.com/premium-photo/3d-rendering-group-artificial-intelligence-robot-teamwork_493806-2986.jpg"
                  alt="Team"
                  className="w-full h-auto transform transition-transform hover:scale-105 duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - With animation */}
      <section
        className={`py-20 px-4 relative overflow-hidden transition-all duration-1000 transform ${
          showStats ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background-secondary/30"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: `fade-up 0.6s ease-out ${index * 200}ms both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-teal/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 group-hover:border-primary/30 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-teal rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    {stat.icon}
                  </div>

                  <div className="text-4xl font-bold bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent mb-2 animate-pulse">
                    {stat.value}
                  </div>
                  <div className="text-muted relative">
                    {stat.label}
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - With animation */}
      <section
        className={`py-20 px-4 relative overflow-hidden transition-all duration-1000 transform ${
          showTeam ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(243,193,120,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <span className="relative inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-teal/20 text-primary text-sm font-medium">
              Our Team
            </span>
            <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-teal via-primary to-secondary bg-clip-text text-transparent">
              Meet The Experts
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animationDelay: `${index * 300 + 200}ms`,
                  animation: `fade-up 0.7s ease-out ${
                    index * 300 + 200
                  }ms both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>

                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                  <div className="absolute -right-4 -top-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-teal rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <img
                        src="https://www.profilebakery.com/wp-content/uploads/2024/05/Profile-picture-created-with-ai.jpeg"
                        alt={member.name}
                        className="rounded-full w-full h-full object-cover relative z-10 transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-teal to-primary bg-clip-text text-transparent mb-2">
                      {member.name}
                    </h3>
                    <p className="text-muted mb-4">{member.role}</p>
                    <p className="italic text-muted relative">
                      "{member.quote}"
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const animationStyles = `
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default About;
