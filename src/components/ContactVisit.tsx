import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactVisit = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="contact" ref={ref} className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Visit Us
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We'd love to meet you in person. Come as you are - you'll find a warm welcome here.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-slate-800 mb-8 text-center">Get in Touch</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition-colors duration-300 resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-3xl font-bold text-slate-800 mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Address</h4>
                      <p className="text-slate-600">123 Faith Avenue<br />Spiritual City, SC 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Phone</h4>
                      <p className="text-slate-600">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Email</h4>
                      <p className="text-slate-600">info@maranthatemple.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Office Hours</h4>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM<br />
                        Sunday: Closed (Worship Services)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-slate-200 rounded-3xl h-64 flex items-center justify-center shadow-lg group hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4 group-hover:text-amber-500 transition-colors" />
                  <p className="text-slate-500 group-hover:text-slate-600 transition-colors">
                    Interactive Map<br />
                    <span className="text-sm">Click for directions</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactVisit;