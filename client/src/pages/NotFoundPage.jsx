import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function NotFoundPage() {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-3">404</h1>
      <p className="lead">Oops! Page not found.</p>
      <Button as={Link} to="/" variant="primary">
        Go Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
