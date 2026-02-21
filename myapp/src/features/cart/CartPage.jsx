import { Link } from "react-router-dom";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import AmazonLayout from "../../components/AmazonLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, cartSubtotal, removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <AmazonLayout>
      <Container className="py-5">
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                style={{ fontSize: "4rem", marginBottom: "20px" }}
              >
                🛒
              </motion.div>
              <h2 className="mb-3">Your ShopHub Cart is empty</h2>
            </motion.div>
            <p className="text-muted mb-4">
              Shop today’s deals and add items to your cart.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button as={Link} to="/products" className="rounded-pill px-4" style={{ backgroundColor: "#ffd814", borderColor: "#fcd200", color: "#0f1111" }}>
                Shop now
              </Button>
            </motion.div>
          </Card.Body>
        </Card>
      </Container>
      </AmazonLayout>
    );
  }

  return (
    <AmazonLayout>
      <Container className="py-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          style={{ fontSize: "1.75rem", fontWeight: 700 }}
        >
          Shopping Cart
        </motion.h1>
        <Row>
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="d-flex flex-column flex-md-row align-items-start align-items-md-center border-bottom p-3 p-md-4 gap-3"
                      style={{ backgroundColor: "#fff" }}
                    >
                  <Link to={`/product/${item.id}`} className="text-decoration-none flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    />
                  </Link>
                  <div className="flex-grow-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-dark text-decoration-none fw-bold d-block mb-1"
                      style={{ fontSize: "1rem" }}
                    >
                      {item.title}
                    </Link>
                    <p className="text-success mb-2 fw-bold">In Stock</p>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <Form.Select
                        size="sm"
                        style={{ width: "auto" }}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value, 10))
                        }
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            Qty: {n}
                          </option>
                        ))}
                      </Form.Select>
                      <span className="text-muted">|</span>
                      <Button
                        variant="link"
                        className="p-0 text-danger text-decoration-none"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                      <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm sticky-top">
            <Card.Body>
              <p className="text-success small mb-2">
                Your order qualifies for FREE delivery.
              </p>
              <p className="mb-3">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{" "}
                <span className="fw-bold">${cartSubtotal.toFixed(2)}</span>
              </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    as={Link}
                    to="/checkout"
                    className="w-100 rounded-pill py-2 fw-bold"
                    style={{ backgroundColor: "#ffd814", borderColor: "#fcd200", color: "#0f1111" }}
                  >
                    Proceed to checkout
                  </Button>
                </motion.div>
              </Card.Body>
            </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </AmazonLayout>
  );
}
