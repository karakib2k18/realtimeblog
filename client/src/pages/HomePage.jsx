import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Spinner } from 'react-bootstrap';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3>Recent Posts</h3>
      {loading ? <Spinner animation="border" /> : (
        posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  );
}

export default HomePage;
