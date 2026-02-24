import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShophubLayout from "../../components/ShophubLayout";
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
  Modal,
  Badge,
  InputGroup,
} from "react-bootstrap";
import {
  getAllProducts,
  searchProducts,
  getProductCategories,
  getProductsByCategory,
  addProduct,
  deleteProduct,
} from "../../api/dummyjsonAPI";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(30);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setToastMessage(`${product.title.substring(0, 30)}... added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setToastMessage("Product deleted successfully!");
        setShowToast(true);
        fetchProducts();
      } catch (err) {
        setToastMessage("Failed to delete product");
        setShowToast(true);
      }
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        brand: newProduct.brand,
        stock: parseInt(newProduct.stock),
      });
      setToastMessage("Product added successfully!");
      setShowToast(true);
      setShowAddModal(false);
      setNewProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
      });
      fetchProducts();
    } catch (err) {
      setToastMessage("Failed to add product");
      setShowToast(true);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        setCategories(data || []);
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
      let data;

      if (searchTerm) {
        data = await searchProducts(searchTerm);
      } else if (selectedCategory) {
        data = await getProductsByCategory(selectedCategory);
      } else {
        data = await getAllProducts({
          limit,
          skip,
          sortBy,
          order: sortOrder,
        });
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
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
  }, [selectedCategory, search, qFromUrl, sortBy, sortOrder, limit, skip]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <ShophubLayout searchValue={qFromUrl || search}>
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Container fluid className="py-4">
        {/* Controls Bar */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Body className="p-3">
                <Row className="align-items-center g-3">
                  <Col xs={12} md={3}>
                    <Form.Select
                      size="sm"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setSkip(0);
                      }}
                    >
                      <option value="title">Sort by Title</option>
                      <option value="price">Sort by Price</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="stock">Sort by Stock</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={2}>
                    <Form.Select
                      size="sm"
                      value={sortOrder}
                      onChange={(e) => {
                        setSortOrder(e.target.value);
                        setSkip(0);
                      }}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={2}>
                    <Form.Select
                      size="sm"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setSkip(0);
                      }}
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={30}>30 per page</option>
                      <option value={50}>50 per page</option>
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={5} className="text-end">
                    <Button
                      variant="warning"
                      onClick={() => setShowAddModal(true)}
                      className="me-2"
                    >
                      + Add Product
                    </Button>
                    <Badge bg="secondary" className="ms-2">
                      Total: {total} products
                    </Badge>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
              <h5
                style={{
                  marginBottom: "2rem",
                  textAlign: "start",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                Shop by Category
              </h5>

              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  active={selectedCategory === ""}
                  onClick={() => {
                    setSelectedCategory("");
                    setSkip(0);
                  }}
                  style={{
                    border: "none",
                    padding: "0.75rem 1rem",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#000",
                    backgroundColor:
                      selectedCategory === "" ? "#febd69" : "transparent",
                  }}
                >
                  All
                </ListGroup.Item>

                {categories.map((cat) => (
                  <ListGroup.Item
                    action
                    key={cat.slug}
                    active={selectedCategory === cat.slug}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSkip(0);
                    }}
                    style={{
                      border: "none",
                      padding: "0.75rem 1rem",
                      borderRadius: "50px",
                      cursor: "pointer",
                      color: "#000",
                      backgroundColor:
                        selectedCategory === cat.slug
                          ? "#febd69"
                          : "transparent",
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
              <>
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
                            position: "relative",
                          }}
                          onClick={() => navigate(`/product/${product.id}`)}
                          as={motion.div}
                          whileHover={{
                            y: -8,
                            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute"
                            style={{
                              top: "10px",
                              right: "10px",
                              zIndex: 10,
                            }}
                            onClick={(e) => handleDeleteProduct(product.id, e)}
                          >
                            ×
                          </Button>
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
                              <h5
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: "1rem",
                                }}
                              >
                                ${product.price?.toFixed(2)}
                              </h5>

                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  size="sm"
                                  style={{
                                    width: "100%",
                                    borderRadius: "50px",
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

                {/* Pagination */}
                {!search && !selectedCategory && totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={skip === 0}
                      onClick={() => setSkip(Math.max(0, skip - limit))}
                    >
                      Previous
                    </Button>
                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={skip + limit >= total}
                      onClick={() => setSkip(skip + limit)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                required
                value={newProduct.brand}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button variant="warning" type="submit">
              Add Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ShophubLayout>
  );
};

export default ProductList;
