import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import AmazonLayout from "../../components/AmazonLayout";
import { useCart } from "../../context/CartContext";
import Toast from "../../components/Toast";
import { motion } from "framer-motion";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Spinner,
} from "react-bootstrap";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setToastMessage(`${product.title.substring(0, 30)}... added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/products/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const searchTerm = search.trim() || qFromUrl.trim();
      let url = "/products?limit=100";
      if (selectedCategory && !searchTerm) url = `/products/category/${selectedCategory}`;
      if (searchTerm) url = `/products/search?q=${encodeURIComponent(searchTerm)}`;

      const res = await axiosInstance.get(url);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search, qFromUrl]);

  return (
    <AmazonLayout searchValue={qFromUrl || search}>
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="mb-4 mb-md-0">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                position: "sticky",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "1.25rem",
                border: "1px solid #dee2e6",
              }}
            >
              <h5 style={{ marginBottom: "2rem", textAlign: "start", fontSize: "1.25rem", fontWeight: 700 }}>Shop by Category</h5>

              <ListGroup variant="flush" >
                <ListGroup.Item
                  action
                  active={selectedCategory === ""}
                  onClick={() => setSelectedCategory("")}
                  style={{
                    border: "none",
                    padding: "0.75rem 1rem",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#000",
                    backgroundColor: selectedCategory === "" ? "#febd69" : "transparent",
                  }}
                >
                  All
                </ListGroup.Item>

                {categories.map((cat) => (
                  <ListGroup.Item
                    action
                    key={cat.slug}
                    active={selectedCategory === cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    style={{
                      border: "none",
                      padding: "0.75rem 1rem",
                      borderRadius: "50px",
                      cursor: "pointer",
                      color: "#000",
                      backgroundColor: selectedCategory === cat.slug ? "#febd69" : "transparent",
                    }}
                  >
                    {cat.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          {/* Products */}
          <Col xs={12} md={9} lg={10}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-muted">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No products found</h4>
                <p>Try a different category or search term</p>
              </div>
            ) : (
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {products.map((product, index) => (
                  <Col key={product.id}>
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
                          cursor: "pointer",
                          backgroundColor: "#fff",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        as={motion.div}
                        whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                      <div
                        style={{
                          height: "220px",
                          backgroundColor: "#f1f3f5",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={product.thumbnail}
                          alt={product.title}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            padding: "15px",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                      </div>

                      <Card.Body className="d-flex flex-column p-4">
                        <Card.Title
                          style={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            marginBottom: "0.75rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "48px",
                          }}
                        >
                          {product.title}
                        </Card.Title>

                        <div style={{ marginBottom: "0.75rem" }}>
                          <span
                            style={{
                              backgroundColor: "#ffc107",
                              color: "#212529",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "12px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                            }}
                          >
                            ★ {product.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>

                        <div style={{ marginTop: "auto" }}>
                          <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                            ${product.price?.toFixed(2)}
                          </h5>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              size="sm"
                              style={{
                                width: "100%",
                                borderRadius: "6px",
                                fontWeight: 600,
                                padding: "0.6rem",
                                backgroundColor: "#ffd814",
                                borderColor: "#fcd200",
                                color: "#0f1111",
                              }}
                              onClick={(e) => handleAddToCart(product, e)}
                            >
                              Add to Cart
                            </Button>
                          </motion.div>
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
    </AmazonLayout>
  );
};

export default ProductList;