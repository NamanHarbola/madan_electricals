// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/register',
                { name, email, password },
                config
            );
            console.log(data); // Contains user info and token
            alert('Signup successful!');
            // TODO: Log the user in and redirect
        } catch (error) {
            alert(error.response.data.message || 'An error occurred');
            console.error(error.response.data);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', margin: '50px auto' }}>
            <div className="modal-content" style={{ padding: '24px' }}>
                <h1 style={{ textAlign: 'center' }}>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn--primary btn--full-width">Sign Up</button>
                </form>
                <p className="auth-switch">
                    <span>Already have an account? </span>
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;