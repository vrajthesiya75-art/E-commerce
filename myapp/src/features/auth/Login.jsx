import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Min 3 characters";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Min 6 characters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        ...formData,
        expiresInMins: 30,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div style={styles.container}>
      {/* Animated Background Particles */}
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        {particles.map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={styles.card}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                style={{ fontSize: "4rem", marginBottom: "20px" }}
              >
                ✅
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ color: "#131921", marginBottom: "10px" }}
              >
                Welcome!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ color: "#666" }}
              >
                Redirecting to ShopHub...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={styles.title}
              >
                Welcome to <span style={{ color: "#ff9900" }}>ShopHub</span> 🛍️
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={styles.subtitle}
              >
                Sign in to start shopping
              </motion.p>

              <form onSubmit={handleSubmit}>
                {/* Username */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.input
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(255,153,0,0.2)" }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    placeholder="Username"
                    style={styles.input}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -10, height: 0 }}
                        style={styles.error}
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.input
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(255,153,0,0.2)" }}
                    transition={{ duration: 0.2 }}
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -10, height: 0 }}
                        style={styles.error}
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* API Error */}
                <AnimatePresence>
                  {apiError && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={styles.error}
                    >
                      {apiError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05, boxShadow: "0 8px 20px rgba(255,153,0,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.button}
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Logging in...
                    </motion.span>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={styles.demo}
                >
                  <p><strong>Demo Credentials</strong></p>
                  <p>Username: emilys</p>
                  <p>Password: emilyspass</p>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #131921 0%, #232f3e 50%, #ff9900 100%)",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "#fff",
    padding: "48px 40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  title: {
    marginBottom: "8px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#131921",
  },
  subtitle: {
    marginBottom: "28px",
    color: "#666",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "8px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    marginTop: "16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ff9900 0%, #ffaa00 100%)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "left",
    fontWeight: 500,
  },
  demo: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#666",
  },
};

export default Login;
