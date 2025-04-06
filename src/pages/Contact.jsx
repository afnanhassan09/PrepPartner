import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    name: "",
    surname: "",
    email: "",
    preferredContact: "email",
  });

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "support@preppartner.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "1-800-PREP-NOW",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "123 Interview Street",
      description: "Success City, SC 12345",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // Reset form or show success message
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-teal leading-tight mb-6 animate-fade-up">
            Let's Start a Conversation
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto animate-fade-up delay-100">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-up">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none bg-background"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background"
                      value={formData.surname}
                      onChange={(e) =>
                        setFormData({ ...formData, surname: e.target.value })
                      }
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-all duration-300 bg-background">
                      <input
                        type="radio"
                        name="contact"
                        value="email"
                        checked={formData.preferredContact === "email"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContact: e.target.value,
                          })
                        }
                        className="text-[#DBCFFC] focus:ring-[#DBCFFC] mr-3 h-4 w-4"
                      />
                      <span className="text-sm font-medium">
                        Contact via Email
                      </span>
                    </label>
                    <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-all duration-300 bg-background">
                      <input
                        type="radio"
                        name="contact"
                        value="phone"
                        checked={formData.preferredContact === "phone"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContact: e.target.value,
                          })
                        }
                        className="text-[#DBCFFC] focus:ring-[#DBCFFC] mr-3 h-4 w-4"
                      />
                      <span className="text-sm font-medium">
                        Contact via Phone
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#09363E] text-white p-4 rounded-lg hover:bg-[#09363A]/90 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 p-8 bg-background-secondary rounded-lg hover:bg-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fade-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-[#DBCFFC] p-4 bg-[#DBCFFC]/10 rounded-full">
                    {info.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl text-teal">
                      {info.title}
                    </h3>
                    <p className="text-primary font-medium text-lg">
                      {info.details}
                    </p>
                    <p className="text-muted">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
