// src/components/ContactSection.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactSection = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-heading">Contact Us</h2>
                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Madan Electricals</h3>
                        <p>Shop No. 13, A Block Market, Kavi Nagar, Ghaziabad, Uttar Pradesh 201002</p>
                        <ul>
                            <li><FaPhone /> +91-98102-86524</li>
                            <li><FaEnvelope /> madanelectricals@gmail.com</li>
                            <li><FaClock /> Mon-Sun: 9:00 AM - 8:00 PM</li>
                        </ul>
                    </div>
                    <div className="contact-map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.087915310218!2d77.4429933150831!3d28.65706898240804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1de78222223%3A0x88628a7a5b5e390!2sMADAN%20ELECTRICALS!5e0!3m2!1sen!2sin!4v1661771112345!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;