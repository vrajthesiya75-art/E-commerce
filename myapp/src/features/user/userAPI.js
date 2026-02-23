import axiosInstance from "../../api/axiosInstance";

export const getUserProfileAPI = (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};