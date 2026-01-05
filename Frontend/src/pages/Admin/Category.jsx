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
        const res = await axios.get('https://localhost:7012/api/Category');
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
            c.TenDanhMuc.toLowerCase().includes(lowerSearch)
        );
        }

        // Sắp xếp
        result.sort((a, b) => {
        if (sortOrder === 'tenDanhMuc-asc') {
            return a.tenDanhMuc.localeCompare(b.tenDanhMuc);
        } 
        if (sortOrder === 'tenDanhMuc-desc') {
            return b.tenDanhMuc.localeCompare(a.tenDanhMuc);
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