import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function PostEditorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        {
          title: formData.title,
          content: formData.content,
          tags: formData.tags.split(',').map(tag => tag.trim())
        },
        { withCredentials: true }
      );
      navigate('/');
    } catch (err) {
      console.error('Post creation failed:', err);
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  if (!user) return <p>You must be logged in to create or edit posts.</p>;

  return (
    <div className="mx-auto" style={{ maxWidth: 600 }}>
      <h3>Create a New Post</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control name="tags" value={formData.tags} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows={6} name="content" value={formData.content} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="success">Publish</Button>
      </Form>
    </div>
  );
}

export default PostEditorPage;
