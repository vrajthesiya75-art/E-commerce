import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import ShophubLayout from "../../components/ShophubLayout";
import { getAllUsers } from "../../api/dummyjsonAPI";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data.users || []);
        setError(null);
      } catch (err) {
        console.error("Users error:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ShophubLayout>
      <Container className="py-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          style={{ fontSize: "1.75rem", fontWeight: 700 }}
        >
          Users List
        </motion.h1>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <p className="text-danger">{error}</p>
              </Card.Body>
            </Card>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No users found</h4>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {users.map((user, index) => (
              <Col key={user.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Card
                    className="h-100 border-0"
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      backgroundColor: "#fff",
                    }}
                    as={motion.div}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      style={{
                        height: "200px",
                        backgroundColor: "#f1f3f5",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <img
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    <Card.Body className="p-4">
                      <Card.Title
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Card.Title>

                      <div className="mb-2">
                        <Badge
                          bg="secondary"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                          }}
                        >
                          {user.gender}
                        </Badge>
                        {user.age && (
                          <Badge
                            bg="info"
                            className="ms-2"
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            Age: {user.age}
                          </Badge>
                        )}
                      </div>

                      <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                        <p className="mb-1">
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p className="mb-1">
                          <strong>Phone:</strong> {user.phone}
                        </p>
                        {user.address && (
                          <p className="mb-0">
                            <strong>Location:</strong> {user.address.city},{" "}
                            {user.address.state}
                          </p>
                        )}
                        {user.company && (
                          <p className="mb-0 mt-1">
                            <strong>Company:</strong> {user.company.name}
                          </p>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </ShophubLayout>
  );
}
