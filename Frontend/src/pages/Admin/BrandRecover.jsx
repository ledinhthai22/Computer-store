import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from '../../components/admin/Pagination';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/RecoverConfirmModal';
import BrandRecoverTable from '../../components/admin/brand/BrandRecoverTable';
import BrandRecoverToolbar from '../../components/admin/brand/BrandRecoverToolbar';

const BrandRecover = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('tenDanhMuc-asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecover, setIsRecover] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchDataRecover = async () => {
        try {
            setLoading(false);
            const res = await axios.get('https://localhost:7012/api/Brand');
            const data = Array.isArray(res.data) ? res.data : [];
            setBrands(data);
            setFiltered(data);
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            showToast("Không thể tải danh sách thương hiệu!", "error");
        }finally{
            setLoading(false);}
    };

    useEffect(() => { fetchDataRecover(); }, []);

    useEffect(() => {
        let result = [...brands];
        if (search) {
            result = result.filter(c => c.tenDanhMuc?.toLowerCase().includes(search.toLowerCase()));
        }
        result.sort((a, b) => {
            if (sortOrder === 'tenDanhMuc-asc') return a.tenDanhMuc?.localeCompare(b.tenDanhMuc);
            if (sortOrder === 'tenDanhMuc-desc') return b.tenDanhMuc?.localeCompare(a.tenDanhMuc);
            return 0;
        });
        setFiltered(result);
        setCurrentPage(1);
    }, [search, brands, sortOrder]);

    // Phân trang
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // MODAL Recover
    const handleRecover = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmRecover = async () => {
    try {
        setIsRecover(true);
        await axios.post(`https://localhost:7012/api/Brand/recover/${recoverId}`);
        
        showToast("Khôi phục thành công!", "success");
        await fetchDataRecover();
    } catch (err) {
        console.error(err);
        showToast("Lỗi khi khôi phục dữ liệu!", "error");
    } finally {
        setIsRecover(false);
        setIsConfirmOpen(false);
        setRecoverId(null);
    }
};

    return (
        <div className="space-y-6">
            <BrandRecoverToolbar
                search={search}
                onSearchChange={setSearch}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
            />

            <div className="flex flex-col gap-4">
                <BrandRecoverTable 
                    data={currentItems} 
                    loading={loading}
                    onRecover={handleRecover}
                />
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            
            {/* Hiển thị Toast */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                title="Xác nhận khôi phục thương hiệu"
                message="Bạn có muốn khôi phục thương hiệu này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isRecover}
            />
        </div>
    );
}

export default BrandRecover;