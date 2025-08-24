// src/pages/ProfileEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js'; // <-- CORRECTED IMPORT PATH
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProfileEditPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [loading, setLoading] = useState(true);

    const { userInfo, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/v1/profile', config);
                setName(data.name);
                setEmail(data.email);
                if (data.shippingAddress) {
                    setAddress(data.shippingAddress.address);
                    setCity(data.shippingAddress.city);
                    setPostalCode(data.shippingAddress.postalCode);
                }
            } catch (error) {
                toast.error("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userInfo.token]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.put('/api/v1/profile', {
                name,
                email,
                shippingAddress: { address, city, postalCode, country: 'India' }
            }, config);
            
            // Update the user info in local storage
            login({ ...userInfo, name: data.name });

            toast.success('Profile updated successfully!');
            navigate('/profile');

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '50px' }}>
            <h1 className="page-title">Edit Profile</h1>
            <div className="form-wrapper" style={{ maxWidth: '600px', margin: 'auto' }}>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                    </div>
                    <h3 style={{marginTop: '30px'}}>Shipping Address</h3>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Postal Code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="form-control" />
                    </div>

                    <button type="submit" className="btn-full">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditPage;