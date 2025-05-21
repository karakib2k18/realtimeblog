import React, { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function NotificationBell() {
  const { notifications, markAllAsSeen } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleToggle = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      markAllAsSeen();
    }
  };

  return (
    <Dropdown align="end" show={open} onToggle={handleToggle}>
      <Dropdown.Toggle variant="light" id="dropdown-notifications">
        🔔
        {notifications.length > 0 && (
          <Badge bg="danger" className="ms-1">{notifications.length}</Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '300px' }}>
        {notifications.length === 0 ? (
          <Dropdown.ItemText>No new notifications</Dropdown.ItemText>
        ) : (
          notifications.map(n => (
            <Dropdown.Item as={Link} to={`/posts/${n.postId}`} key={n.id}>
              <div className="fw-bold">{n.postTitle}</div>
              <small className="text-muted">{dayjs(n.timestamp).fromNow()}</small>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;
