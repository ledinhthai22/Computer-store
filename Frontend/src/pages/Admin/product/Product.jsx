import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from '../../../components/admin/product/ProductTable';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://localhost:7012/all');
        const actualData = res.data && Array.isArray(res.data.data) ? res.data.data : [];
        setProducts(actualData);
      } catch (error) {
        console.error("Lỗi khi fetch data:", error);
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
    </div>
  );
};

export default Product;