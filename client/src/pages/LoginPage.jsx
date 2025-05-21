import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { loginSchema } from '../validations/loginSchema';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    // Simulate login (replace with real API call)
    login({ name: 'Demo User', email: formData.email, image: null });
    navigate('/');
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 400 }}>
      <h3 className="mb-4">Login</h3>
      {formError && <Alert variant="danger">{formError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Login</Button>
      </Form>
    </div>
  );
}

export default LoginPage;
