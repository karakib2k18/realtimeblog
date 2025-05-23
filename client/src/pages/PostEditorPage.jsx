import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function PostEditorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const postId = new URLSearchParams(search).get('id');

  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
        withCredentials: true
      });

      const { title, content, tags, author } = res.data;

      if (author._id !== user._id) {
        alert('You are not authorized to edit this post.');
        navigate('/');
        return;
      }

      setFormData({
        title,
        content,
        tags: tags.join(', ')
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load post:', err);
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim());
    setError('');
    setSuccess('');

    try {
      if (postId) {
        // Update
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
          ...formData,
          tags: tagsArray
        }, { withCredentials: true });

        setSuccess('Post updated successfully!');
      } else {
        // Create
        await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, {
          ...formData,
          tags: tagsArray
        }, { withCredentials: true });

        setSuccess('Post created successfully!');
      }

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit post');
    }
  };

  if (!user) return <p>You must be logged in to access this page.</p>;
  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

  return (
    <div className="mx-auto" style={{ maxWidth: 600 }}>
      <h3>{postId ? 'Edit Post' : 'Create a New Post'}</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            name="content"
            as="textarea"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">
          {postId ? 'Update Post' : 'Publish'}
        </Button>
      </Form>
    </div>
  );
}

export default PostEditorPage;
