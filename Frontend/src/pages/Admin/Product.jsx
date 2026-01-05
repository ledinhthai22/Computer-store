import { useEffect, useState } from 'react';
import ProductTable from '../../components/admin/product/ProductTable';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then(response => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <ProductTable 
          data={products}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Product;