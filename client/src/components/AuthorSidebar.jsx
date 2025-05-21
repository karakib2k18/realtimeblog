import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const activeUsers = ['Alice', 'Bob', 'Charlie'];

function AuthorSidebar() {
  return (
    <div>
      <h5>Active Users</h5>
      <ListGroup>
        {activeUsers.map((user, idx) => (
          <ListGroup.Item key={idx}>
            <Link to={`/author/${user}`}>{user}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default AuthorSidebar;
