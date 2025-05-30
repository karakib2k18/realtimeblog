import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
      withCredentials: true
    }).then(res => {
      setSubscriptions(res.data.subscriptions);
    }).catch(err => {
      console.error('Failed to load subscriptions:', err);
      toast.error('Failed to load subscriptions');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleUnsubscribe = async (authorId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/subscriptions/${authorId}`, {
        withCredentials: true
      });
      setSubscriptions(prev => prev.filter(sub => sub.id !== authorId));
      toast.info('Unsubscribed successfully');
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      toast.error('Unsubscribe failed');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h3>Subscriptions</h3>
      {subscriptions.length === 0 ? (
        <p>You’re not subscribed to any authors yet.</p>
      ) : (
        subscriptions.map(sub => (
          <Card key={sub.id} className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/author/${sub.id}`}>
                  <strong>{sub.name}</strong>
                </Link>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleUnsubscribe(sub.id)}
              >
                Unsubscribe
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default SubscriptionsPage;
