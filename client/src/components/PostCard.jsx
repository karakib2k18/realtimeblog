import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          By <Link to={`/author/${post.author}`}>{post.author}</Link>
        </Card.Subtitle>
        <Card.Text>{post.preview}</Card.Text>
        <Card.Text>
          <small>Tags: {post.tags.join(', ')}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PostCard;
