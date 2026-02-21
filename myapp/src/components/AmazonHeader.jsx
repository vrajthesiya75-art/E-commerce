import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Navbar, Container, Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const headerStyle = {
  backgroundColor: "#131921",
  minHeight: "60px",
};

const logoStyle = {
  color: "#fff",
  fontSize: "1.5rem",
  fontWeight: 700,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
};

const deliverStyle = {
  color: "#fff",
  fontSize: "0.7rem",
  lineHeight: 1.2,
  textDecoration: "none",
};
const deliverLabelStyle = { color: "#ccc", fontSize: "0.7rem" };

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "0.5rem 0",
  display: "flex",
  alignItems: "center",
};

export default function AmazonHeader({ searchValue, onSearchSubmit, searchPlaceholder = "Search ShopHub" }) {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState(searchValue ?? "");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q != null) setLocalSearch(q);
    if (searchValue !== undefined) setLocalSearch(searchValue);
  }, [location.search, searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (e.target.search?.value || localSearch || "").trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    if (onSearchSubmit) onSearchSubmit(q);
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <Navbar expand="lg" style={headerStyle} variant="dark">
        <Container fluid className="px-3">
          <Navbar.Brand as={Link} to="/products" style={logoStyle}>
            <motion.span whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
              ShopHub
            </motion.span>
          </Navbar.Brand>

          <Nav className="flex-row align-items-center gap-2 gap-lg-3 me-2">
            <Link to="/products" style={deliverStyle} className="d-none d-md-flex flex-column text-start">
              <span style={deliverLabelStyle}>Deliver to</span>
              <span className="text-white fw-bold">India</span>
            </Link>
          </Nav>

          <Form className="d-flex flex-grow-1 mx-2 mx-lg-4" style={{ maxWidth: "700px" }} onSubmit={handleSearch}>
            <Form.Control
              name="search"
              type="search"
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="rounded-0"
              style={{ borderRadius: "4px 0 0 4px" }}
            />
            <button
              type="submit"
              className="btn rounded-0"
              style={{
                backgroundColor: "#febd69",
                color: "#131921",
                borderRadius: "0 4px 4px 0",
                border: "none",
              }}
            >
              🔍
            </button>
          </Form>

          <Nav className="flex-row align-items-center gap-2">
            <Link
              to="/products"
              className="text-white text-decoration-none d-none d-md-flex flex-column text-start"
              style={{ fontSize: "0.8rem" }}
            >
              <span style={deliverLabelStyle}>Returns</span>
              <span className="fw-bold">& Orders</span>
            </Link>
            <Link
              to="/cart"
              className="text-white text-decoration-none d-flex align-items-center gap-1"
              style={{ fontSize: "0.9rem" }}
            >
              <span className="position-relative">
                <span style={{ fontSize: "1.6rem" }}>🛒</span>
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="fw-bold">Cart</span>
            </Link>
            <button
              type="button"
              className="btn btn-link text-white text-decoration-none p-0 ms-2 d-none d-md-inline"
              style={{ fontSize: "0.85rem" }}
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                window.location.href = "/";
              }}
            >
              Sign out
            </button>
          </Nav>
        </Container>
      </Navbar>
      <Navbar style={{ backgroundColor: "#232f3e", minHeight: "39px" }} variant="dark" className="py-0">
        <Container fluid className="px-3">
          <Nav className="flex-row gap-3 align-items-center flex-wrap" style={{ fontSize: "0.875rem" }}>
            <Link to="/products" style={navLinkStyle} className="py-2">
              <span className="me-2">☰</span> All
            </Link>
            <Link to="/products" style={navLinkStyle} className="py-2">Today's Deals</Link>
            <Link to="/products" style={navLinkStyle} className="py-2">Customer Service</Link>
            <Link to="/products" style={navLinkStyle} className="py-2">Registry</Link>
            <Link to="/products" style={navLinkStyle} className="py-2">Gift Cards</Link>
            <Link to="/products" style={navLinkStyle} className="py-2">Sell</Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
