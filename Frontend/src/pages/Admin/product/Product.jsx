import { useEffect, useState } from 'react';
import ProductTable from '../../../components/admin/product/ProductTable';
import Toast from '../../../components/admin/Toast';
import { productService } from '../../../services/api/productService';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAll();
        console.log("Service:", res);
        const actualData = res && Array.isArray(res) ? res : [];
        setProducts(actualData);
      } catch (error) {
       console.error("Lỗi fetch:", error);
            showToast("Tải danh sách sản phẩm thất bại", "error");
      }finally{
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <ProductTable 
          data={products} 
          loading={loading} 
        />
      </div>
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