import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Card className="mb-3">
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
  );
}

export default PostCard;
