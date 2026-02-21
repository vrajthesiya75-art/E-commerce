import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import AmazonLayout from "../../components/AmazonLayout";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
  { id: 4, label: "Confirmation" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, cartSubtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: "",
  });
  const [orderId] = useState(() => "SH" + Date.now());

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0 && step < 4) {
    return (
      <AmazonLayout>
        <Container className="py-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <h2 className="mb-3">Your cart is empty</h2>
              <p className="text-muted mb-4">Add items to your cart to checkout.</p>
              <Button as={Link} to="/products" variant="warning">
                Continue shopping
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </AmazonLayout>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    setStep(4);
    clearCart();
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/cart");
  };

  return (
    <AmazonLayout>
      <Container className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="mb-2" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            Checkout
          </h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {STEPS.map((s) => (
              <span
                key={s.id}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: step >= s.id ? 600 : 400,
                  backgroundColor: step === s.id ? "#ffd814" : step > s.id ? "#e6f3e6" : "#f0f0f0",
                  color: step >= s.id ? "#0f1111" : "#666",
                }}
              >
                {s.id}. {s.label}
              </span>
            ))}
          </div>
        </motion.div>

        <Row>
          <Col lg={8} className="mb-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom py-3">
                      <h5 className="mb-0 fw-bold">Shipping address</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleShippingSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full name</Form.Label>
                          <Form.Control
                            required
                            value={shipping.fullName}
                            onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                            placeholder="John Doe"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address line 1</Form.Label>
                          <Form.Control
                            required
                            value={shipping.addressLine1}
                            onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                            placeholder="123 Main St"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address line 2 (optional)</Form.Label>
                          <Form.Control
                            value={shipping.addressLine2}
                            onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                            placeholder="Apt, suite, etc."
                          />
                        </Form.Group>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>City</Form.Label>
                              <Form.Control
                                required
                                value={shipping.city}
                                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                placeholder="Mumbai"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>State</Form.Label>
                              <Form.Control
                                required
                                value={shipping.state}
                                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                                placeholder="Maharashtra"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>ZIP</Form.Label>
                              <Form.Control
                                required
                                value={shipping.zip}
                                onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                                placeholder="400001"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            required
                            type="tel"
                            value={shipping.phone}
                            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                            placeholder="10-digit mobile number"
                          />
                        </Form.Group>
                        <div className="d-flex gap-2">
                          <Button type="button" variant="outline-secondary" onClick={goBack}>
                            Back to cart
                          </Button>
                          <Button type="submit" style={{ backgroundColor: "#ff9900", borderColor: "#ff9900" }}>
                            Continue to payment
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom py-3">
                      <h5 className="mb-0 fw-bold">Payment method</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handlePaymentSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Card number</Form.Label>
                          <Form.Control
                            required
                            placeholder="1234 5678 9012 3456"
                            value={payment.cardNumber}
                            onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                            maxLength={19}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Name on card</Form.Label>
                          <Form.Control
                            required
                            placeholder="John Doe"
                            value={payment.nameOnCard}
                            onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                          />
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Expiry (MM/YY)</Form.Label>
                              <Form.Control
                                required
                                placeholder="12/25"
                                value={payment.expiry}
                                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>CVV</Form.Label>
                              <Form.Control
                                required
                                type="password"
                                placeholder="123"
                                value={payment.cvv}
                                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                                maxLength={4}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="d-flex gap-2">
                          <Button type="button" variant="outline-secondary" onClick={goBack}>
                            Back
                          </Button>
                          <Button type="submit" style={{ backgroundColor: "#ff9900", borderColor: "#ff9900" }}>
                            Continue to review
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom py-3">
                      <h5 className="mb-0 fw-bold">Review your order</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">Shipping to</h6>
                        <p className="mb-0">
                          {shipping.fullName}<br />
                          {shipping.addressLine1}
                          {shipping.addressLine2 && `, ${shipping.addressLine2}`}<br />
                          {shipping.city}, {shipping.state} {shipping.zip}<br />
                          {shipping.phone}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">Payment</h6>
                        <p className="mb-0">
                          Card ending in ***{payment.cardNumber.replace(/\s/g, "").slice(-4) || "----"}<br />
                          {payment.nameOnCard}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button type="button" variant="outline-secondary" onClick={goBack}>
                          Back
                        </Button>
                        <Button
                          onClick={handlePlaceOrder}
                          style={{ backgroundColor: "#ff9900", borderColor: "#ff9900" }}
                        >
                          Place order
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        style={{ fontSize: "4rem", marginBottom: "1rem" }}
                      >
                        ✅
                      </motion.div>
                      <h2 className="mb-2">Thank you for your order!</h2>
                      <p className="text-muted mb-2">Order ID: <strong>{orderId}</strong></p>
                      <p className="text-muted small mb-4">
                        A confirmation email would be sent to your email (demo).
                      </p>
                      <Button as={Link} to="/products" style={{ backgroundColor: "#ff9900", borderColor: "#ff9900" }}>
                        Continue shopping
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm sticky-top">
                <Card.Header className="bg-white border-bottom py-2">
                  <h6 className="mb-0 fw-bold">Order summary</h6>
                </Card.Header>
                <Card.Body>
                  {step < 4 && (
                    <>
                      <p className="mb-2">
                        Subtotal ({totalItems} items): <strong>${cartSubtotal.toFixed(2)}</strong>
                      </p>
                      <p className="text-success small mb-3">FREE delivery</p>
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="d-flex gap-2 small mb-2">
                          <img
                            src={item.thumbnail}
                            alt=""
                            style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
                          />
                          <span className="text-truncate flex-grow-1">{item.title}</span>
                          <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-muted small">+{items.length - 3} more item(s)</p>
                      )}
                      <hr />
                      <p className="mb-0 fw-bold">
                        Total: ${cartSubtotal.toFixed(2)}
                      </p>
                    </>
                  )}
                  {step === 4 && (
                    <p className="mb-0 text-muted small">Your order has been placed successfully.</p>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </AmazonLayout>
  );
}
