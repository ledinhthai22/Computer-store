import axios from "axios";
import { useEffect, useState } from "react";
import CategoryTable from '../../components/admin/category/CategoryTable';
import CategoryToolbar from '../../components/admin/category/CategoryToolbar';
import Pagination from '../../components/admin/Pagination';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('name-asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://dummyjson.com/products/categories');
        setCategories(res.data);
        setFiltered(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
    useEffect(() => {
        let result = [...categories];

        if (search) {
        const lowerSearch = search.toLowerCase();
        result = result.filter(c => 
            c.name.toLowerCase().includes(lowerSearch) ||
            c.slug.toLowerCase().includes(lowerSearch)
        );
        }

        // Sắp xếp
        result.sort((a, b) => {
        if (sortOrder === 'name-asc') {
            return a.name.localeCompare(b.name);
        } 
        if (sortOrder === 'name-desc') {
            return b.name.localeCompare(a.name);
        }
        return 0;
        });

        setFiltered(result);
        setCurrentPage(1);
    }, [search, categories, sortOrder]);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <>
        <div className="space-y-6">
        <CategoryToolbar 
            search={search}
            onSearchChange={setSearch}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
        />

            <div className="flex flex-col gap-4">
                <CategoryTable 
                data={currentItems} 
                loading={loading} 
                isCategoryPage={true}
                />
                <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                />
            </div>
        </div>
        </>
    )
}

export default Category;