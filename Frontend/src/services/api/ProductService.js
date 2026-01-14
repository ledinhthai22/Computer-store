import axiosClient from "./axiosClient";

export const productService = {
    getAdminList: async () => {
        const res = await axiosClient.get("/admin/products");
        return res.data; // API trả mảng
    },
    getDetailProduct: async (id) => {
        const res = await axiosClient.get(`/admin/products/${id}`)
        return res.data;
    },
    // services/api/ProductService.js
    updateProduct: async (id, formData) => {
        const res = await axiosClient.put(`/admin/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    AddProduct: async (formData) => {
        const res = await axiosClient.post(`/admin/products`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    deleteProduct: async (id) => {
        const res = await axiosClient.delete(`/admin/products/${id}`)
        return res.data;
    }
};


// Xử lý lỗi
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
    const message =
        error.response?.data?.message || error.message || defaultMessage;
    console.error("API Error:", error);
    return message;
};
