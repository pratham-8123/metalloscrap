import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './BusinessWebsite.css';

const BusinessWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("4UdegH2WSwEGFxEIk");
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Method 1: Try to send directly to business email using send method
      console.log('Attempting to send form data to business email...');
      
      const businessEmailResult = await emailjs.send(
        'service_4zyu3ie',
        'template_4r2ogcc',
        {
          to_email: 'pratham8123@gmail.com',
          user_name: formData.name,
          user_email: formData.email,
          subject: `New Contact Form: ${formData.subject}`,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
          reply_to: formData.email
        },
        '4UdegH2WSwEGFxEIk'
      );

      console.log('Business email sent successfully:', businessEmailResult);

      if (businessEmailResult.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Primary method failed:', error);
      
      // Method 2: Try with different parameter names that might match your template
      try {
        console.log('Trying alternative parameter format...');
        
        const result = await emailjs.send(
          'service_4zyu3ie',
          'template_4r2ogcc',
          {
            to_email: 'pratham8123@gmail.com',
            from_name: formData.name,
            from_email: formData.email,
            subject: `New Contact Form: ${formData.subject}`,
            message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
            reply_to: formData.email
          },
          '4UdegH2WSwEGFxEIk'
        );
        
        if (result.status === 200) {
          setSubmitStatus('success');
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          return;
        }
      } catch (altError) {
        console.error('Alternative method failed:', altError);
      }
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="business-website">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>MetalloScrap</h2>
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => scrollToSection('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'vision' ? 'active' : ''}`}
                onClick={() => scrollToSection('vision')}
              >
                Vision & Mission
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}
                onClick={() => scrollToSection('products')}
              >
                Products & Services
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => scrollToSection('contact')}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-image-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>MetalloScrap</h1>
          <p>Direct Metal Procurement Solutions for Rolling Mills</p>
          <p className="hero-subtitle">Eliminating intermediaries. Empowering businesses.</p>
          <button className="cta-button" onClick={() => scrollToSection('products')}>
            Explore Our Products
          </button>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision" className="vision-mission">
        <div className="container">
          <div className="vision-content">
            <div className="vision-card">
              <div className="vision-icon">
                <img src="/images/vision.jpg" alt="Vision" className="vision-image" />
              </div>
              <h2>Our Vision</h2>
              <p>
                To eliminate the complex network of intermediaries that small rolling mills 
                must navigate to procure metals in India. We envision a streamlined, 
                transparent supply chain that directly connects mills with quality metal suppliers, 
                ensuring cost efficiency and reliable delivery for all our partners.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <img src="/images/mission.jpg" alt="Mission" className="mission-image" />
              </div>
              <h2>Our Mission</h2>
              <p>
                We have successfully broken down traditional barriers in metal procurement 
                and established direct supply channels. Our proven track record includes 
                helping rolling mills like Mayank Rolling Mill in Farrukhabad, Uttar Pradesh 
                to procure brass scrap directly from sellers, reducing costs and improving 
                efficiency. We continue to expand our network and capabilities to serve 
                more mills across India with reliable, direct metal sourcing solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services Section */}
      <section id="products" className="products">
        <div className="container">
          <h2>Our Products & Services</h2>
          <p className="section-subtitle">
            We primarily deal in brass, iron, aluminium and copper scrap, serving rolling mills 
            across India with direct procurement solutions.
          </p>
          
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="/images/brassScrap.jpg" alt="Brass Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">🟡</div>
                <h3>Brass Scrap</h3>
                <p>
                  India ranks among the top consumers of brass globally. Due to growing demand, 
                  we now import high-quality brass scrap from the European Union, ensuring 
                  consistent supply and superior quality for our clients.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/images/copperScrap.jpg" alt="Copper Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">🟠</div>
                <h3>Copper Scrap</h3>
                <p>
                  With India's ongoing infrastructure development drive, we have recently 
                  expanded into copper trading. We offer various grades of copper scrap 
                  to meet specific requirements. Please reach out for any specific grade needs.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/images/ironScrap.jpg" alt="Iron Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">⚫</div>
                <h3>Iron Scrap</h3>
                <p>
                  With 5-6 years of successful trading experience, we are your reliable partner 
                  for iron scrap procurement. We offer HMS 1 and 2 grades, ready for dispatch 
                  across India with competitive pricing and reliable delivery.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src="/images/aluminiumScrap.jpg" alt="Aluminium Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">⚪</div>
                <h3>Aluminium Scrap</h3>
                <p>
                  Our aluminium portfolio includes wire, disc brake scrap, shredded scrap 
                  (E40/ISRI 201:211), and aluminium cans. With years of experience, we ensure 
                  quality products and timely delivery to meet your production requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="business-philosophy">
            <div className="philosophy-background">
              <img src="/images/metalProcessing2.jpg" alt="Business Philosophy" className="philosophy-image" />
            </div>
            <div className="philosophy-content">
              <h3>Our Business Philosophy</h3>
              <p>
                We believe in customer satisfaction and fair trade practices. Our commitment 
                is to ensure a safe and conducive environment for business opportunities. 
                We maintain transparency in all transactions and prioritize long-term 
                partnerships over short-term gains.
              </p>
              <p>
                Ready to streamline your metal procurement? Reach out to us directly or 
                submit a query using our contact form. We would be more than happy to assist 
                you with your specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-image">
                <img src="/images/contactUs.png" alt="Contact Us" className="img-cover" />
              </div>
              <h3>Get In Touch</h3>
              <p className="contact-intro">
                Ready to optimize your metal procurement process? Let's discuss how we can 
                help your rolling mill achieve better efficiency and cost savings.
              </p>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Location</h4>
                  <p>Serving rolling mills across India</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+91 9098189919</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>pratham8123@gmail.com</p>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Submit Your Query</h3>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject (e.g., Brass Scrap Inquiry)" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="message"
                  placeholder="Please describe your requirements, including metal type, quantity, and any specific grade requirements..." 
                  rows="5" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="status-message success">
                  ✅ Thank you! Your inquiry has been sent successfully. We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="status-message error">
                  ❌ Sorry, there was an error sending your message. Please try again or contact us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>MetalloScrap</h3>
              <p>Direct metal procurement solutions for rolling mills across India. Eliminating intermediaries, empowering businesses.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><button onClick={() => scrollToSection('home')}>Home</button></li>
                <li><button onClick={() => scrollToSection('vision')}>Vision & Mission</button></li>
                <li><button onClick={() => scrollToSection('products')}>Products & Services</button></li>
                <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Our Products</h4>
              <ul>
                <li>Brass Scrap</li>
                <li>Copper Scrap</li>
                <li>Iron Scrap</li>
                <li>Aluminium Scrap</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MetalloScrap. All rights reserved. | Direct Metal Procurement Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessWebsite; 