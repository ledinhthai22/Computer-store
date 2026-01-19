import axiosClient from "../api/axiosClient";

export const cartService = {
  getByUser(maNguoiDung) {
    return axiosClient
      .get(`/Cart/${maNguoiDung}`)
      .then((res) => res.data);
  },

  add(data) {
    return axiosClient.post("/Cart", data);
  },

  update(data) {
    return axiosClient.put("/Cart", data);
  },

  remove(data) {
    return axiosClient.delete("/Cart", { data });
  },
};
