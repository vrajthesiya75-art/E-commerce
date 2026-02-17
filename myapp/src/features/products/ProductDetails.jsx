import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../../api/axiosInstance";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data);
      setMainImage(res.data.thumbnail);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  if (!product) return <h2 style={{ padding: "20px" }}>Product not found</h2>;

  return (
    <div style={styles.container}>
      {/* LEFT SIDE - IMAGES */}
      <div style={styles.imageSection}>
        <img src={mainImage} alt={product.title} style={styles.mainImage} />

        <div style={styles.thumbnailContainer}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              style={styles.thumbnail}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - DETAILS */}
      <div style={styles.detailSection}>
        <h2>{product.title}</h2>

        <div style={styles.rating}>
          ⭐ {product.rating}
        </div>

        <h3 style={styles.price}>${product.price}</h3>

        <p style={styles.description}>
          {product.description}
        </p>

        <p>
          <strong>Brand:</strong> {product.brand}
        </p>

        <p>
          <strong>Category:</strong> {product.category}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {product.stock > 0 ? (
            <span style={{ color: "green" }}>In Stock</span>
          ) : (
            <span style={{ color: "red" }}>Out of Stock</span>
          )}
        </p>

        <button style={styles.button}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

const styles = {
  container: {
    display: "flex",
    gap: "40px",
    padding: "40px",
  },
  imageSection: {
    flex: 1,
  },
  mainImage: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "contain",
    border: "1px solid #ddd",
    padding: "10px",
  },
  thumbnailContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    cursor: "pointer",
    border: "1px solid #ddd",
  },
  detailSection: {
    flex: 1,
  },
  rating: {
    color: "#f0c14b",
    margin: "10px 0",
  },
  price: {
    color: "#B12704",
    margin: "10px 0",
  },
  description: {
    margin: "20px 0",
  },
  button: {
    padding: "12px 20px",
    background: "#ffd814",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
