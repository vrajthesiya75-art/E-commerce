import axiosInstance from "../../api/axiosInstance";

export const addCartAPI = (product) => {
  return axiosInstance.post("/carts/add", {
    userId: 1, // static for now
    products: [
      {
        id: product.id,
        quantity: 1,
      },
    ],
  });
};