import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  const isAuthor = user && post?.author?._id === user._id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`);
        setPost(res.data);
        setLoading(false);

        if (user && res.data.author._id !== user._id) {
          const subs = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
            withCredentials: true
          });
          const isSubbed = subs.data.subscriptions.some(sub => sub.id === res.data.author._id);
          setSubscribed(isSubbed);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubscribeToggle = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/subscriptions/${post.author._id}`;
    try {
      if (subscribed) {
        await axios.delete(url, { withCredentials: true });
        setSubscribed(false);
      } else {
        await axios.post(url, {}, { withCredentials: true });
        setSubscribed(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update subscription');
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (!post) return <p>Post not found.</p>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          By <Link to={`/author/${post.author._id}`}>{post.author.name}</Link>
        </Card.Subtitle>
        <Card.Text className="mt-3">{post.content}</Card.Text>

        {!isAuthor && user && (
          <Button
            variant={subscribed ? 'secondary' : 'primary'}
            size="sm"
            className="mt-3"
            onClick={handleSubscribeToggle}
          >
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostDetailPage;
