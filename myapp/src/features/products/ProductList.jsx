import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import {
  Container,
  Row,
  Col,
  Navbar,
  Form,
  Button,
  Card,
  ListGroup,
  Spinner,
} from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      let url = "/products?limit=100";
      if (selectedCategory) url = `/products/category/${selectedCategory}`;
      if (search.trim()) url = `/products/search?q=${encodeURIComponent(search.trim())}`;

      const res = await axiosInstance.get(url);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <Navbar expand="lg" bg="dark" variant="dark" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
        <Container fluid>
          <Navbar.Brand href="#" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            MyShop
          </Navbar.Brand>

          <Form
            className="d-flex mx-auto"
            style={{ maxWidth: "500px" }}
            onSubmit={handleSearch}
          >
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "50px 0 0 50px",
                padding: "0.6rem 1.2rem",
              }}
            />
            <Button
              variant="warning"
              type="submit"
              style={{
                borderRadius: "0 50px 50px 0",
                padding: "0.6rem 1.5rem",
              }}
            >
              Search
            </Button>
          </Form>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="mb-4 mb-md-0">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                position:"sticky",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "1.25rem",
                border: "1px solid #dee2e6",
              }}
            >
              <h5 style={{ marginBottom: "2rem",textAlign:"start",fontsize:"1.5rem", fontWeight: 900 }}>Categories</h5>

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
                    backgroundColor: selectedCategory === "" ? "#ffc107" : "transparent",
                  }}
                >
                  All Products
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
                      backgroundColor: selectedCategory === cat.slug ? "#ffc107" : "transparent",
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
                {products.map((product) => (
                  <Col key={product.id}>
                    <Card
                      className="h-100 border-0"
                      style={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.25s ease",
                        cursor: "pointer",
                        transform: "translateY(0)",
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-10px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                      }}
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

                          <Button
                            variant="warning"
                            size="sm"
                            style={{
                              width: "100%",
                              borderRadius: "50px",
                              fontWeight: 500,
                              padding: "0.6rem",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Added to cart! (demo)");
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductList;