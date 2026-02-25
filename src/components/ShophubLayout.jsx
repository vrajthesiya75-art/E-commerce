import ShophubHeader from "./ShophubHeader";
import { useNavigate } from "react-router-dom";

export default function ShophubLayout({ children, searchValue, onSearchSubmit }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded" }}>
      <ShophubHeader searchValue={searchValue} onSearchSubmit={onSearchSubmit} />
      <main>{children}</main>
    </div>
  );
}
