// src/components/ContactSection.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactSection = () => {
    // This is the corrected Google Maps embed URL for your store's address
    const mapSrc ="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1750.5046116855683!2d77.32235638887093!3d28.65944249751458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb1a3107a0cd%3A0xe2458c18e7a10b14!2sMADAN%20ELECTRICALS!5e0!3m2!1sen!2sin!4v1756135909833!5m2!1sen!2sin";

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-heading">Contact Us</h2>
                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Madan Electricals</h3>
                        <p>SHOP NO. 15, A BLOCK SUPERMARKET RAMPRASTHA COLONY GHAZIABAD UTTAR PRADESH 201011</p>
                        <ul>
                            <li><FaPhone /> +91-9810652432</li>
                           <li><FaEnvelope /> namanharbola3@gmail.com</li>
                            <li><FaClock /> Mon-Sun: 9:00 AM - 8:00 PM</li>
                            <li><b>Tuesday: Closed</b></li>
                        </ul>
                    </div>
                    <div className="contact-map">
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Madan Electricals Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;