import React, { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';

dayjs.extend(relativeTime);

function NotificationBell() {
  const { notifications, setNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = (isOpen) => {
    setOpen(isOpen);
  };

  const handleClickNotification = async (postId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/notifications/mark-single`, {

        postId
      }, {
        withCredentials: true
      });

      // Only remove the clicked notification
      setNotifications(prev => prev.filter(n => n.postId !== postId));

      // Navigate to post detail page
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error('❌ Failed to mark notification:', err);
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
      <Dropdown.Menu style={{ minWidth: '320px' }}>
        {notifications.length === 0 ? (
          <Dropdown.ItemText>No new notifications</Dropdown.ItemText>
        ) : (
          notifications.map((n, index) => (
            <Dropdown.Item
              key={n.id || index}
              onClick={() => handleClickNotification(n.postId)}
            >
              <div className="fw-bold">{n.postTitle || 'New Post'}</div>
              {n.authorName && (
                <div className="text-muted" style={{ fontSize: '0.9em' }}>
                  By{' '}
                  <span className="text-decoration-underline">
                    {n.authorName}
                  </span>
                </div>
              )}
              <small className="text-muted">
                {dayjs(n.createdAt || n.timestamp).fromNow()}
              </small>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;
