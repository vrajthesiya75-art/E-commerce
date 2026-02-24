import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Badge, Button, Form, ListGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import ShophubLayout from "../../components/ShophubLayout";
import { getSinglePost, getCommentsByPost } from "../../api/dummyjsonAPI";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getSinglePost(id);
      setPost(data);
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentLoading(true);
    try {
      const data = await getCommentsByPost(id);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Comments error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // Note: DummyJSON doesn't actually save comments, but simulates it
      const mockComment = {
        id: comments.length + 1,
        body: newComment,
        postId: parseInt(id),
        likes: 0,
        user: {
          id: 1,
          username: "current_user",
          fullName: "Current User",
        },
      };
      setComments([mockComment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ShophubLayout>
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">Loading post...</p>
          </div>
        </Container>
      </ShophubLayout>
    );
  }

  if (!post) {
    return (
      <ShophubLayout>
        <Container className="py-5">
          <div className="text-center">
            <h4 className="text-muted">Post not found</h4>
            <Button variant="warning" onClick={() => navigate("/posts")}>
              Back to Posts
            </Button>
          </div>
        </Container>
      </ShophubLayout>
    );
  }

  return (
    <ShophubLayout>
      <Container className="py-4">
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate("/posts")}>
          ← Back to Posts
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {post.tags?.map((tag) => (
                  <Badge key={tag} bg="secondary" style={{ fontSize: "0.85rem" }}>
                    {tag}
                  </Badge>
                ))}
              </div>
              <Card.Title style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
                {post.title}
              </Card.Title>
              <Card.Text style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#333" }}>
                {post.body}
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <div className="text-muted">
                  <span className="me-3">👁 {post.views || 0} views</span>
                  <span>
                    👍 {post.reactions?.likes || 0} • 👎 {post.reactions?.dislikes || 0}
                  </span>
                </div>
                <Badge bg="info">User ID: {post.userId}</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-dark text-white">
              <strong>Comments ({comments.length})</strong>
            </Card.Header>
            <Card.Body>
              {/* Add Comment Form */}
              <Form onSubmit={handleAddComment} className="mb-4">
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="warning" type="submit" disabled={submitting || !newComment.trim()}>
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </Form>

              {/* Comments List */}
              {commentLoading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" variant="warning" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-muted text-center py-3">No comments yet. Be the first to comment!</p>
              ) : (
                <ListGroup variant="flush">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListGroup.Item className="px-0 py-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <strong>{comment.user?.fullName || comment.user?.username || "Anonymous"}</strong>
                          <Badge bg="secondary" style={{ fontSize: "0.75rem" }}>
                            👍 {comment.likes || 0}
                          </Badge>
                        </div>
                        <p className="mb-0" style={{ color: "#555" }}>
                          {comment.body}
                        </p>
                      </ListGroup.Item>
                    </motion.div>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </ShophubLayout>
  );
}
