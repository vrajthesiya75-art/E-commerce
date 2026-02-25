import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Badge, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import ShophubLayout from "../../components/ShophubLayout";
import { getAllPosts, searchPosts, getAllPostsTags, getPostsByTag } from "../../api/dummyjsonAPI";

export default function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchTags();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag();
    } else if (searchQuery) {
      fetchSearchPosts();
    } else {
      fetchPosts();
    }
  }, [selectedTag, searchQuery]);

  const fetchTags = async () => {
    try {
      const data = await getAllPostsTags();
      setTags(data || []);
    } catch (err) {
      console.error("Tags error:", err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts({ limit: 30 });
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchPosts = async () => {
    setLoading(true);
    try {
      const data = await searchPosts(searchQuery);
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsByTag = async () => {
    setLoading(true);
    try {
      const data = await getPostsByTag(selectedTag);
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Tag filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedTag("");
  };

  return (
    <ShophubLayout>
      <Container className="py-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          style={{ fontSize: "1.75rem", fontWeight: 700 }}
        >
          Posts
        </motion.h1>

        <Row className="mb-4">
          <Col md={8}>
            <Form onSubmit={handleSearch} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="warning" type="submit">
                Search
              </Button>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-dark text-white">
                <strong>Filter by Tags</strong>
              </Card.Header>
              <Card.Body>
                <Button
                  variant={selectedTag === "" ? "warning" : "outline-secondary"}
                  size="sm"
                  className="mb-2 me-2"
                  onClick={() => {
                    setSelectedTag("");
                    setSearchQuery("");
                  }}
                >
                  All
                </Button>
                {tags.slice(0, 20).map((tag) => (
                  <Badge
                    key={tag.slug}
                    bg={selectedTag === tag.slug ? "warning" : "secondary"}
                    className="me-2 mb-2"
                    style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    onClick={() => {
                      setSelectedTag(tag.slug);
                      setSearchQuery("");
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-muted">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No posts found</h4>
              </div>
            ) : (
              <Row xs={1} className="g-4">
                {posts.map((post, index) => (
                  <Col key={post.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="h-100 border-0 shadow-sm"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/post/${post.id}`)}
                        as={motion.div}
                        whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                      >
                        <Card.Body>
                          <Card.Title style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                            {post.title}
                          </Card.Title>
                          <Card.Text
                            style={{
                              color: "#666",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.body}
                          </Card.Text>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} bg="secondary" style={{ fontSize: "0.75rem" }}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="d-flex justify-content-between align-items-center text-muted small">
                            <span>👁 {post.views || 0} views</span>
                            <span>
                              👍 {post.reactions?.likes || 0} • 👎{" "}
                              {post.reactions?.dislikes || 0}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </ShophubLayout>
  );
}
