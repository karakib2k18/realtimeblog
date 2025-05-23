import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthorProfilePage() {
  const { authorId } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const isSelf = user && user._id === authorId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
        const authorPosts = res.data.filter(post => post.author._id === authorId);
        setPosts(authorPosts);
        setAuthor(authorPosts[0]?.author || null);
        if (user && authorId !== user._id) {
          const subRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
            withCredentials: true
          });
          setSubscribed(subRes.data.subscriptions.some(sub => sub.id === authorId));
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load author data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId, user]);

  const handleToggleSubscription = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/subscriptions/${authorId}`;
    try {
      if (subscribed) {
        await axios.delete(url, { withCredentials: true });
        setSubscribed(false);
        toast.info('Unsubscribed successfully');
      } else {
        await axios.post(url, {}, { withCredentials: true });
        setSubscribed(true);
        toast.success('Subscribed successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Subscription action failed');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h3>{author ? author.name : 'Author'}'s Posts ({posts.length})</h3>
      {!isSelf && user && (
        <Button
          onClick={handleToggleSubscription}
          variant={subscribed ? 'secondary' : 'primary'}
          className="my-3"
          size="sm"
        >
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      )}
      {posts.map(post => (
        <Card key={post._id} className="mb-3 animate__animated animate__fadeIn">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
            <Link to={`/posts/${post._id}`}>
              <Button size="sm">Read More</Button>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default AuthorProfilePage;
