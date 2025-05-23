import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthor = user && post?.author?._id === user._id;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
        withCredentials: true
      });
      setPost(res.data);
      setLoading(false);

      // Check subscription status
      if (user && user._id !== res.data.author._id) {
        const subRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
          withCredentials: true
        });
        const isSubbed = subRes.data.subscriptions.some(sub => sub.id === res.data.author._id);
        setSubscribed(isSubbed);
      }
    } catch (err) {
      console.error('Failed to load post', err);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
          withCredentials: true
        });
        navigate('/');
      } catch (err) {
        console.error('Failed to delete post', err);
      }
    }
  };

  const handleSubscribe = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/subscriptions/${post.author._id}`, {}, {
        withCredentials: true
      });
      setSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe', err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/subscriptions/${post.author._id}`, {
        withCredentials: true
      });
      setSubscribed(false);
    } catch (err) {
      console.error('Failed to unsubscribe', err);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>
        by{' '}
        <Link to={`/author/${post.author._id}`}>
          {post.author.name}
        </Link>{' '}
        {!isAuthor && (
          <>
            {subscribed ? (
              <Button variant="outline-secondary" size="sm" onClick={handleUnsubscribe}>
                Unsubscribe
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleSubscribe}>
                Subscribe
              </Button>
            )}
          </>
        )}
      </p>
      <p>{post.content}</p>
      <p><strong>Tags:</strong> {post.tags.join(', ')}</p>

      {isAuthor && (
        <div className="mt-3">
          <Button as={Link} to={`/editor?id=${post._id}`} variant="warning" className="me-2">
            Edit
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default PostDetailPage;
