// src/components/ContactSection.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactSection = () => {
    // This is the corrected Google Maps embed URL for your store's address
    const mapSrc = "https://maps.google.com/maps?q=Madan%20Electricals%20Rampuri%20Ghaziabad&t=&z=15&ie=UTF8&iwloc=&output=embed";

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