import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../validations/registerSchema';

function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validated = await registerSchema.validateAsync(form);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, validated, {
        withCredentials: true
      });
      navigate('/login');
    } catch (err) {
      if (err.isJoi) {
        setError(err.message);
      } else {
        setError(err.response?.data?.error || 'Registration failed');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" value={form.password} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">Sign Up</Button>
        <Button variant="danger" onClick={handleGoogleLogin} className="mt-2 w-100">
          Sign in with Google
        </Button>
      </Form>
    </div>
  );
}

export default RegisterPage;
