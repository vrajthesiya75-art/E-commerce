import AmazonHeader from "./AmazonHeader";

export default function AmazonLayout({ children, searchValue, onSearchSubmit }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded" }}>
      <AmazonHeader searchValue={searchValue} onSearchSubmit={onSearchSubmit} />
      <main>{children}</main>
    </div>
  );
}
