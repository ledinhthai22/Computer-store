import axiosClient from "./axiosClient";

export const WishListService = {
  getByUser: (userId) =>
    axiosClient.get(`/WishList/${userId}`).then((res) => res.data),

  create: (data) => axiosClient.post("/WishList", data).then((res) => res.data),

  delete: (yeuThichId) =>
    axiosClient.delete(`/WishList/${yeuThichId}`).then((res) => res.data),
};
