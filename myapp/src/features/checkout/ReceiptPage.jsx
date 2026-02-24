import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const ReceiptPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    return <h4>No receipt found</h4>;
  }

  const { order } = state;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow">
        <h3>Order Receipt</h3>
        <hr />

        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Total Products:</strong> {order.totalProducts}</p>
        <p><strong>Total Quantity:</strong> {order.totalQuantity}</p>
        <p><strong>Total Price:</strong> ${order.total}</p>

        <Button
          variant="warning"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Card>
    </Container>
  );
};

export default ReceiptPage;