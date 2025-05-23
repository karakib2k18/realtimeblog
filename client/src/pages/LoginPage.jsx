import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { loginSchema } from '../validations/loginSchema';

function LoginPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validated = await loginSchema.validateAsync({ email, password });
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, validated, {
        withCredentials: true
      });
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      if (err.isJoi) {
        setError(err.message);
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">Login</Button>
        <Button variant="danger" onClick={handleGoogleLogin} className="mt-2 w-100">
          Sign in with Google
        </Button>
      </Form>
    </div>
  );
}

export default LoginPage;
