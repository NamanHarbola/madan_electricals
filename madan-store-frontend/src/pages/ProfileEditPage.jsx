// src/pages/ProfileEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProfileEditPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // <-- ADD THIS LINE
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { userInfo, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/v1/profile');
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || ''); // <-- ADD THIS LINE
        if (data.shippingAddress) {
          setAddress(data.shippingAddress.address || '');
          setCity(data.shippingAddress.city || '');
          setPostalCode(data.shippingAddress.postalCode || '');
          setCountry(data.shippingAddress.country || 'India');
        }
      } catch (error) {
        toast.error('Could not load profile data.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchProfile();
  }, [userInfo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name.');
    if (!email.trim()) return toast.error('Please enter your email.');

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(), // <-- ADD THIS LINE
        shippingAddress: {
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim() || 'India',
        },
      };

      const { data } = await API.put('/api/v1/profile', payload);
      login({ ...userInfo, ...data });
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
      <h1 className="page-title">Edit Profile</h1>

      <div className="form-wrapper" style={{ maxWidth: 600, margin: 'auto' }}>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>

          {/* --- NEW PHONE FIELD --- */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>

          <h3 style={{ marginTop: 30 }}>Shipping Address</h3>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="address-line1" />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input id="city" type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
          </div>

          <div className="form-group">
            <label htmlFor="postal">Postal Code</label>
            <input id="postal" type="text" className="form-control" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{4,10}" title="Enter a valid postal code" />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input id="country" type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" />
          </div>

          <button type="submit" className="btn-full" disabled={saving}>
            {saving ? 'Saving…' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
