import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
        withCredentials: true
      });
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (authorId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/subscriptions/${authorId}`, {
        withCredentials: true
      });
      setSubscriptions(prev => prev.filter(sub => sub.id !== authorId));
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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
