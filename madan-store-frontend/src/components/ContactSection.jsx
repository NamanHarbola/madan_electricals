// src/components/ContactSection.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactSection = () => {
  // Correct Google Maps embed URL for your store's address
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1750.5046116855683!2d77.32235638887093!3d28.65944249751458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb1a3107a0cd%3A0xe2458c18e7a10b14!2sMADAN%20ELECTRICALS!5e0!3m2!1sen!2sin!4v1756135909833!5m2!1sen!2sin';

  const name = 'Madan Electricals';
  const street = 'SHOP NO. 15, A BLOCK SUPERMARKET';
  const area = 'RAMPRASTHA COLONY';
  const city = 'Ghaziabad';
  const state = 'Uttar Pradesh';
  const postal = '201011';
  const country = 'IN';
  const tel = '+919810652432';
  const email = 'namanharbola3@gmail.com';

  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <h2 className="section-heading" id="contact-heading">
          Contact Us
        </h2>

        <div className="contact-grid">
          {/* Business details */}
          <address className="contact-info" itemScope itemType="https://schema.org/LocalBusiness">
            <h3 itemProp="name" style={{ marginTop: 0 }}>{name}</h3>

            <p itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="streetAddress">
                {street}, {area}
              </span>
              <br />
              <span itemProp="addressLocality">{city}</span>,{' '}
              <span itemProp="addressRegion">{state}</span>{' '}
              <span itemProp="postalCode">{postal}</span>
            </p>

            <ul aria-label="Contact methods" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <FaPhone aria-hidden="true" />{' '}
                <a href={`tel:${tel}`} itemProp="telephone">
                  +91-9810652432
                </a>
              </li>
              <li>
                <FaEnvelope aria-hidden="true" />{' '}
                <a href={`mailto:${email}`} itemProp="email">
                  {email}
                </a>
              </li>
              <li>
                <FaClock aria-hidden="true" /> <span itemProp="openingHours">Mon–Sun: 9:00 AM – 8:00 PM</span>
              </li>
              <li>
                <strong>Tuesday: Closed</strong>
              </li>
            </ul>

            {/* Hidden geo coordinates for better map/SEO hints (optional) */}
            <meta itemProp="addressCountry" content={country} />
          </address>

          {/* Map (decorative for SR since the info is listed above) */}
          <div className="contact-map">
            <iframe
              src={mapSrc}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map showing Madan Electricals location"
              aria-label="Map showing Madan Electricals location"
            />
          </div>
        </div>
      </div>

      {/* JSON-LD for richer search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: `${street}, ${area}`,
              addressLocality: city,
              addressRegion: state,
              postalCode: postal,
              addressCountry: country,
            },
            telephone: tel,
            email,
            openingHours: ['Mo,We,Th,Fr,Sa,Su 09:00-20:00'],
            url: typeof window !== 'undefined' ? window.location.origin : undefined,
          }),
        }}
      />
    </section>
  );
};

export default ContactSection;
