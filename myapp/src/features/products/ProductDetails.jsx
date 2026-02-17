import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Carousel, // optional if you want full gallery carousel later
} from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState(null);

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
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="warning" style={{ width: "4rem", height: "4rem" }} />
        <h4 className="mt-4 text-muted">Loading product details...</h4>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-5 my-5">
        <h3 className="text-danger">Product not found</h3>
        <p className="text-muted">The product may have been removed or is unavailable.</p>
        <Button variant="warning" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <Container fluid className="py-4 py-md-5 bg-light min-vh-100">
      <Row className="g-5">
        {/* Images Section */}
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4 text-center">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={mainImage}
                  alt={product.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>

              {/* Thumbnails */}
              {product.images?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title} - ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: mainImage === img ? "3px solid #ffc107" : "2px solid #dee2e6",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: mainImage === img ? "0 0 10px rgba(255,193,7,0.5)" : "none",
                      }}
                      onClick={() => setMainImage(img)}
                      onMouseEnter={(e) => {
                        if (mainImage !== img) e.target.style.border = "2px solid #ffc107";
                      }}
                      onMouseLeave={(e) => {
                        if (mainImage !== img) e.target.style.border = "2px solid #dee2e6";
                      }}
                    />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Details Section */}
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4 p-md-5 d-flex flex-column">
              <h2 className="fw-bold mb-3">{product.title}</h2>

              <div className="mb-3">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
                  ★ {product.rating?.toFixed(1) || "N/A"} • {product.reviews?.length || 0} reviews
                </Badge>
              </div>

              <h3 className="text-danger fw-bold mb-4" style={{ fontSize: "2.2rem" }}>
                ${product.price?.toFixed(2)}
                {product.discountPercentage && (
                  <small className="text-success ms-3">
                    {product.discountPercentage}% OFF
                  </small>
                )}
              </h3>

              <p className="text-muted mb-4" style={{ lineHeight: "1.7" }}>
                {product.description}
              </p>

              <div className="mb-4">
                <p className="mb-2">
                  <strong>Brand:</strong> {product.brand || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Category:</strong>{" "}
                  <span className="text-capitalize">{product.category}</span>
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

              <div className="mt-auto">
                <Button
                  variant="warning"
                  size="lg"
                  className="w-100 rounded-pill fw-bold py-3"
                  style={{ fontSize: "1.1rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Added to cart! (demo functionality)");
                  }}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;