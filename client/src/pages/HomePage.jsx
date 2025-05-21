import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Recent Posts</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <Row xs={1} md={2} className="g-4 mt-3">
          {posts.map((post) => (
            <Col key={post._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    By <Link to={`/author/${post.author._id}`}>{post.author.name}</Link>
                  </Card.Subtitle>
                  <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
                  <Link to={`/posts/${post._id}`}>
                    <Button size="sm">Read More</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomePage;
