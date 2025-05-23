import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Card className="mb-3 animate__animated animate__fadeIn">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          By <Link to={`/author/${post.author._id}`}>{post.author.name}</Link>
        </Card.Subtitle>

        <Card.Text>
          {post.content.slice(0, 100)}...
        </Card.Text>

        {/* ✅ Show tags here */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-2">
            Tags:
            {post.tags.map((tag, index) => (
              <Badge key={index} bg="" className="me-1 text-dark"> {tag}</Badge>
            ))}
          </div>
        )}

        <Link to={`/posts/${post._id}`}>
          <Button size="sm" variant="primary">Read More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default PostCard;
