import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import AmazonLayout from "../../components/AmazonLayout";
import { useCart } from "../../context/CartContext";
import Toast from "../../components/Toast";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setToastMessage(`${product.title.substring(0, 30)}... added to cart!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate("/checkout");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.thumbnail || "");
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <AmazonLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-5 my-5"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Spinner animation="border" style={{ width: "4rem", height: "4rem", color: "#ff9900" }} />
          </motion.div>
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted"
          >
            Loading product details...
          </motion.h4>
        </motion.div>
      </AmazonLayout>
    );
  }

  if (error || !product) {
    return (
      <AmazonLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-5 my-5"
        >
          <h3 className="text-danger">Product not found</h3>
          <p className="text-muted">The product may have been removed or is unavailable.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button style={{ backgroundColor: "#ffd814", borderColor: "#fcd200", color: "#0f1111" }} onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </motion.div>
        </motion.div>
      </AmazonLayout>
    );
  }

  return (
    <AmazonLayout>
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      <Container fluid className="py-3 py-md-4" style={{ backgroundColor: "#eaeded" }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
          style={{ fontSize: "0.875rem" }}
        >
          <Link to="/products" className="text-muted text-decoration-none">Home</Link>
          <span className="mx-2 text-muted">›</span>
          <Link to="/products" className="text-muted text-decoration-none text-capitalize">{product.category}</Link>
          <span className="mx-2 text-muted">›</span>
          <span className="text-dark">{product.title.substring(0, 50)}...</span>
        </motion.div>

        <Row className="g-4">
          {/* Images Section */}
          <Col xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3 p-md-4">
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      height: "500px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <motion.img
                      src={mainImage}
                      alt={product.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        padding: "20px",
                      }}
                    />
                  </div>

                  {/* Thumbnails */}
                  {product.images?.length > 0 && (
                    <div
                      className="mt-3 d-flex gap-2 flex-wrap justify-content-center"
                      style={{ maxHeight: "100px", overflowY: "auto" }}
                    >
                      {product.images.slice(0, 5).map((img, index) => (
                        <motion.img
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          src={img}
                          alt={`${product.title} - ${index + 1}`}
                          onClick={() => setMainImage(img)}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: mainImage === img ? "3px solid #ff9900" : "2px solid #dee2e6",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Product Info & Buy Box */}
          <Col xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="p-4">
                  <h1 className="fw-bold mb-2" style={{ fontSize: "1.75rem", lineHeight: 1.3 }}>
                    {product.title}
                  </h1>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
                      ★ {product.rating?.toFixed(1) || "N/A"}
                    </Badge>
                    <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                      ({product.reviews?.length || 0} ratings)
                    </span>
                    <Link to="/products" className="text-primary text-decoration-none small">
                      See all reviews
                    </Link>
                  </div>

                  <div className="mb-3">
                    <span className="text-danger fw-bold me-2" style={{ fontSize: "2rem" }}>
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-success fw-bold">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-muted mb-0" style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
                      {product.description}
                    </p>
                  </div>

                  <hr />

                  <div className="mb-4">
                    <p className="mb-2">
                      <strong>Brand:</strong> <span className="text-capitalize">{product.brand || "N/A"}</span>
                    </p>
                    <p className="mb-2">
                      <strong>Category:</strong> <span className="text-capitalize">{product.category}</span>
                    </p>
                    <p className="mb-0">
                      <strong>Availability:</strong>{" "}
                      {product.stock > 0 ? (
                        <span className="text-success fw-bold">In Stock ({product.stock} left)</span>
                      ) : (
                        <span className="text-danger fw-bold">Out of Stock</span>
                      )}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Buy Box */}
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "#fff" }}>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Quantity:</label>
                    <select
                      className="form-select"
                      style={{ maxWidth: "120px" }}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        size="lg"
                        className="w-100 fw-bold py-3 mb-2"
                        style={{
                          fontSize: "1rem",
                          backgroundColor: "#ffd814",
                          borderColor: "#fcd200",
                          color: "#0f1111",
                          borderRadius: "20px",
                        }}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                      >
                        Add to Cart
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        size="lg"
                        variant="warning"
                        className="w-100 fw-bold py-3"
                        style={{
                          fontSize: "1rem",
                          backgroundColor: "#ff9900",
                          borderColor: "#ff9900",
                          borderRadius: "20px",
                        }}
                        onClick={handleBuyNow}
                        disabled={product.stock === 0}
                      >
                        Buy Now
                      </Button>
                    </motion.div>
                  </div>

                  <div className="border-top pt-3">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: "1.2rem" }}>🚚</span>
                      <div>
                        <strong className="d-block">FREE delivery</strong>
                        <small className="text-muted">Order within 2 days for free delivery</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: "1.2rem" }}>↩️</span>
                      <div>
                        <strong className="d-block">Easy returns</strong>
                        <small className="text-muted">30-day return policy</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <span style={{ fontSize: "1.2rem" }}>🔒</span>
                      <div>
                        <strong className="d-block">Secure payment</strong>
                        <small className="text-muted">Your payment information is safe</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </AmazonLayout>
  );
};

export default ProductDetail;
