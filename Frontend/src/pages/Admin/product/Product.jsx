import { useEffect, useState } from "react";
import { productService } from "../../../services/api/ProductService";
import ProductTable from "../../../components/admin/product/ProductTable";
import Toast from "../../../components/admin/Toast";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAdminList();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setToast({
          show: true,
          message: "Tải danh sách sản phẩm thất bại",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <ProductTable data={products} loading={loading} />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Product;
