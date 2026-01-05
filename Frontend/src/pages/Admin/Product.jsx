import { useEffect, useState } from 'react';
import ProductTable from '../../components/admin/product/ProductTable';


const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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