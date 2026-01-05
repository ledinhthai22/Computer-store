import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductTable from '../../components/admin/product/ProductTable';
import ProductToolbar from '../../components/admin/product/ProductToolbar';
import Pagination from '../../components/admin/Pagination';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('title-asc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://dummyjson.com/products?limit=100');
        setProducts(res.data.products);
        setFiltered(res.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) ||
        p.brand?.toLowerCase().includes(lowerSearch) ||
        p.category.toLowerCase().includes(lowerSearch) ||
        p.price.toString().includes(lowerSearch)
      );
    }

    // Sắp xếp
    result.sort((a, b) => {
      if (sortOrder === 'title-asc') {
        return a.title.localeCompare(b.title);
      } 
      if (sortOrder === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      if(sortOrder === 'category-asc') {
        return a.category.localeCompare(b.category);
      }
      if(sortOrder === 'category-desc') {
        return b.category.localeCompare(a.category);
      }
      if(sortOrder === 'price-asc') {
        return a.price - b.price;
      }
      if(sortOrder === 'price-desc') {
        return b.price - a.price;
      }
      if(sortOrder === 'discount-asc') {
        return a.discountPercentage - b.discountPercentage;
      }
      if(sortOrder === 'discount-desc') {
        return b.discountPercentage - a.discountPercentage;
      }
      if(sortOrder === 'stock-asc') {
        return a.stock - b.stock;
      }
      if(sortOrder === 'stock-desc') {
        return b.stock - a.stock;
      }
    });

    setFiltered(result);
    setCurrentPage(1);
  }, [search, products, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <ProductToolbar 
        search={search}
        onSearchChange={setSearch}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <div className="flex flex-col gap-4">
        <ProductTable 
          data={currentItems} 
          loading={loading} 
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Product;