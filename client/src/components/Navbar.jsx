import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Blog Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/editor">New Post</Nav.Link>
                <Nav.Link as={Link} to="/subscriptions">Subscriptions</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <NotificationBell />
                <Navbar.Text className="mx-2">
                  {user.name}
                </Navbar.Text>
                <Button onClick={logout} size="sm" variant="outline-danger">Logout</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="primary" size="sm">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
