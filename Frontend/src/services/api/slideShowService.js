import axiosClient from "./axiosClient";


export const slideShowService = {


  // Lấy slideshow hiển thị ngoài client
  userGetAll: () =>
    axiosClient
      .get("/SlideShow")
      .then((res) => res.data || []),


  // Lấy tất cả slideshow (admin)
  getAll: () =>
    axiosClient
      .get("/admin/SlideShow")
      .then((res) => res.data || []),

  // Lấy chi tiết slideshow theo id
  getById: (id) =>
    axiosClient
      .get(`/admin/SlideShow/${id}`)
      .then((res) => res.data),

  // Thêm slideshow
  create: (formData) =>
    axiosClient
      .post("/admin/SlideShow", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  // Cập nhật slideshow
  update: (id, formData) =>
    axiosClient
      .put(`/admin/SlideShow/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  // Xóa slideshow
  delete: (id) =>
    axiosClient
      .delete(`/admin/SlideShow/${id}`)
      .then((res) => res.data),
};


export const handleApiError = (
  error,
  defaultMessage = "Có lỗi xảy ra"
) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    defaultMessage;

  console.error("API Error:", error);
  return message;
};
