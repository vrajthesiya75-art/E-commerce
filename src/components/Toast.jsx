import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "#131921",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "280px",
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            style={{ fontSize: "1.5rem" }}
          >
            ✅
          </motion.span>
          <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "0",
              lineHeight: 1,
            }}
          >
            ×
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
