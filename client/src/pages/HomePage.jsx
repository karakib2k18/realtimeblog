import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import AuthorSidebar from '../components/AuthorSidebar';
import { Row, Col, Form, Spinner } from 'react-bootstrap';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
        withCredentials: true
      });
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/authors`, {
        withCredentials: true
      });
      setAuthors(res.data);
    } catch (err) {
      console.error('Failed to fetch authors', err);
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(keyword) ||
      post.tags.join(',').toLowerCase().includes(keyword)
    );
    setFilteredPosts(filtered);
  };

  return (
    <Row>
      {/* Author Sidebar */}
      <Col md={3}>
      <h5 className="mt-2">📚 Author List</h5>

        {loadingAuthors ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <AuthorSidebar authors={authors} />
          </>
        )}
      </Col>

      {/* Main Post List */}
      <Col md={9}>
        <h3>Recent Posts</h3>

        {/* Search Bar */}
        <Form.Control
          type="text"
          placeholder="Search by title or tag..."
          value={search}
          onChange={handleSearch}
          className="mb-3"
        />

        {loadingPosts ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </Col>
    </Row>
  );
}

export default HomePage;
