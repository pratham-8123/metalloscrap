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
    emailjs.init("BrRSRetOQlcwhIMMH");
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
        'service_gxrynx3',
        'template_q926awn',
        {
          to_email: 'info@metalloscrap.com',
          user_name: formData.name,
          user_email: formData.email,
          subject: `New Contact Form: ${formData.subject}`,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
          reply_to: formData.email
        },
        'BrRSRetOQlcwhIMMH'
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
          'service_gxrynx3',
          'template_q926awn',
          {
            to_email: 'info@metalloscrap.com',
            from_name: formData.name,
            from_email: formData.email,
            subject: `New Contact Form: ${formData.subject}`,
            message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
            reply_to: formData.email
          },
          'BrRSRetOQlcwhIMMH'
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
          <p>Strategic Metal Scrap Sourcing for Industrial Clients</p>
          <p className="hero-subtitle">Direct supply chain solutions for rolling mills and manufacturers. Trusted by industry leaders for reliability and compliance.</p>
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
                <img src={process.env.PUBLIC_URL + '/images/vision.jpg'} alt="Vision" className="vision-image" />
              </div>
              <h2>Our Vision</h2>
              <p>
                To set the benchmark for transparent, compliant, and efficient metal scrap procurement in India and Europe. We aim to empower rolling mills and manufacturers by providing direct access to vetted sources, minimizing risk and maximizing operational continuity.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <img src={process.env.PUBLIC_URL + '/images/mission.jpg'} alt="Mission" className="mission-image" />
              </div>
              <h2>Our Mission</h2>
              <p>
                Our mission is to deliver consistent, specification-driven metal scrap supply, leveraging a robust network of international and domestic partners. We focus on quality assurance, regulatory adherence, and tailored logistics, as demonstrated by our successful direct brass scrap deliveries to Mayank Rolling Mill (Farrukhabad, UP) and other industrial clients.
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
            We specialize in the procurement and supply of high-grade brass, iron, aluminium, and copper scrap, serving the evolving needs of rolling mills and industrial manufacturers across India and Europe.
          </p>
          
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src={process.env.PUBLIC_URL + '/images/brassScrap.jpg'} alt="Brass Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">🟡</div>
                <h3>Brass Scrap</h3>
                <p>
                  Sourced from certified European and domestic suppliers, our brass scrap meets stringent metallurgical standards. We offer consistent supply for foundries and mills requiring reliable, specification-compliant material for high-performance applications.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src={process.env.PUBLIC_URL + '/images/copperScrap.jpg'} alt="Copper Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">🟠</div>
                <h3>Copper Scrap</h3>
                <p>
                  Our copper scrap portfolio includes Berry, Birch/Cliff, and Cobra grades, suitable for electrical, construction, and manufacturing sectors. All lots are XRF-verified and traceable, ensuring compliance with international quality benchmarks.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src={process.env.PUBLIC_URL + '/images/ironScrap.jpg'} alt="Iron Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">⚫</div>
                <h3>Iron Scrap</h3>
                <p>
                  We supply HMS 1 & 2 iron scrap with full documentation and logistics support. Our iron scrap is sourced from audited yards, ensuring consistent sizing and minimal impurities for efficient melting and processing.
                </p>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <img src={process.env.PUBLIC_URL + '/images/aluminiumScrap.jpg'} alt="Aluminium Scrap" className="img-cover" />
              </div>
              <div className="product-content">
                <div className="product-icon">⚪</div>
                <h3>Aluminium Scrap</h3>
                <p>
                  Our aluminium scrap includes wire, shredded (E40/ISRI 201:211), and UBC. Each batch is inspected for alloy content and contamination, supporting clients in automotive, packaging, and extrusion industries.
                </p>
              </div>
            </div>
          </div>

          <div className="business-philosophy">
            <div className="philosophy-background">
              <img src={process.env.PUBLIC_URL + '/images/metalProcessing2.jpg'} alt="Business Philosophy" className="philosophy-image" />
            </div>
            <div className="philosophy-content">
              <h3>Our Business Philosophy</h3>
              <p>
                We operate with a commitment to regulatory compliance, supply chain transparency, and long-term value creation for our partners. Our business is built on rigorous due diligence, ethical sourcing, and a proactive approach to risk management.
              </p>
              <p>
                For tailored procurement solutions or to discuss your technical requirements, contact us directly or submit a detailed inquiry. Our team is ready to provide expert guidance and responsive service.
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
                <img src={process.env.PUBLIC_URL + '/images/contactUs.png'} alt="Contact Us" className="img-cover" />
              </div>
              <h3>Get In Touch</h3>
              <p className="contact-intro">
                For procurement partnerships, technical consultations, or compliance documentation, please contact our team. We serve industrial clients across India and Europe with end-to-end sourcing solutions.
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
                  <p>+49 176 68554158</p>
                  <p>+91 91489 71493</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>info@metalloscrap.com</p>
                  <p>purchasing@metalloscrap.com</p>
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
              <p>MetalloScrap delivers compliant, specification-driven metal scrap sourcing for industrial clients. Our expertise spans direct procurement, quality assurance, and logistics for rolling mills and manufacturers.</p>
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