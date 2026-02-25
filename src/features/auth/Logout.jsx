import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Logout = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    onClose();
    navigate("/login");
  };

  return (
  <AnimatePresence>
  {isOpen && (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={modalStyle}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={logoutBtn} onClick={handleConfirm}>Logout</button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  maxWidth: "90%",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const iconCircle = {
  width: "60px",
  height: "60px",
  margin: "0 auto",
  borderRadius: "50%",
  background: "#fff3cd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};

const logoutBtn = {
  flex: 1,
  padding: "12px",
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s",
};

const cancelBtn = {
  flex: 1,
  padding: "12px",
  background: "#f1f1f1",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Logout;