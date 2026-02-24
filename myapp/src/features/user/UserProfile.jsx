import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import { getAuthUser } from "../../api/dummyjsonAPI";
import ShophubLayout from "../../components/ShophubLayout";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Get logged-in user from auth token
      const data = await getAuthUser();
      setUser(data);
    } catch (error) {
      console.error("User fetch error:", error);
      // Fallback: try to get user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <ShophubLayout>
         <Container className="py-5">
      <Card className="shadow-sm border-0 p-4">
        <Row>
          <Col md={4} className="text-center">
            <img
              src={user.image}
              alt={user.firstName}
              className="img-fluid rounded-circle mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <h4>{user.firstName} {user.lastName}</h4>
          </Col>

          <Col md={8}>
            <h5 className="mb-3">Profile Details</h5>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Address:</strong> {user.address?.address}, {user.address?.city}</p>
          </Col>
        </Row>
      </Card>
    </Container>
    </ShophubLayout>
   
  );
}