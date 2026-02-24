const BASE = "https://dummyjson.com";

export const createOrder = async (cartItems) => {
  const res = await fetch(`${BASE}/carts/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: 1,
      products: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }),
  });

  return res.json();
};