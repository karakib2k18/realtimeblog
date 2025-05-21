import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AuthorSidebar({ authors }) {
  return (
    <ListGroup>
      {authors.map(author => (
        <ListGroup.Item key={author._id}>
          <Link to={`/author/${author._id}`}>{author.name}</Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default AuthorSidebar;
