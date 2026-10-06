import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowRightIcon } from './Icons';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

const ContactForm = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("BrRSRetOQlcwhIMMH");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Payload: never use the visitor's address as From (from_email) — that breaks SPF/DKIM
    // and causes spam folder placement. Reply-To is the correct place for the submitter's email.
    const emailPayload = {
      to_email: 'info@metalloscrap.com',
      from_name: 'Shreela Group — Website',
      user_name: formData.name,
      user_email: formData.email,
      user_subject: formData.subject,
      user_message: formData.message,
      subject: `New inquiry: ${formData.subject}`,
      // Plain fallback if EmailJS template still uses {{message}} only
      message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\n${formData.message}`,
      reply_to: formData.email
    };

    try {
      const businessEmailResult = await emailjs.send(
        'service_gxrynx3',
        'template_q926awn',
        emailPayload,
        'BrRSRetOQlcwhIMMH'
      );

      if (businessEmailResult.status === 200) {
        setSubmitStatus('success');
        setFormData(EMPTY_FORM);
      }
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3 className="form-card__title">Send an inquiry</h3>
      <p className="form-card__intro">Tell us the metal, grade and quantity you need. We reply by email.</p>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" type="text" name="name" autoComplete="name" placeholder="Your name"
            value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" name="email" autoComplete="email" placeholder="you@company.com"
            value={formData.email} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-subject">Subject</label>
        <input id="cf-subject" type="text" name="subject" placeholder="e.g. Brass scrap inquiry"
          value={formData.subject} onChange={handleInputChange} required />
      </div>

      <div className="field">
        <label htmlFor="cf-message">Requirements</label>
        <textarea id="cf-message" name="message" rows="5"
          placeholder="Metal type, quantity, grade and any specific requirements..."
          value={formData.message} onChange={handleInputChange} required />
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send inquiry'}
        {!isSubmitting && <ArrowRightIcon size={18} />}
      </button>

      <div aria-live="polite">
        {submitStatus === 'success' && (
          <p className="status status--success">
            Thank you. Your inquiry has been sent and we will get back to you soon.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="status status--error">
            Sorry, your message could not be sent. Please try again, or email us directly.
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
