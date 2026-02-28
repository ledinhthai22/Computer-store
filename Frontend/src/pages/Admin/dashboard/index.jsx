import { useState, useEffect } from 'react';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';
import { userService } from "../../../services/api/userService";
import { statisticsService } from "../../../services/api/statisticsService";
import { WebInfoService } from "../../../services/api/webInfoService";
import StatCard from '../../../components/admin/dashboard/StatCard';
import WebInfoTable from '../../../components/admin/webinfo/WebInfoTable';
import WebInfoModal from '../../../components/admin/webinfo/WebInfoModal';
import WebInfoViewModal from '../../../components/admin/webinfo/WebInfoViewModal';
import Toast from '../../../components/admin/Toast';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // WebInfo states
    const [webinfo, setWebinfo] = useState([]);
    const [webinfoLoading, setWebinfoLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [selectedWebInfo, setSelectedWebInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [sales, setSales] = useState([]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getAllUnlock();
                setTotalUsers(response.length || 0);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await statisticsService.getSales();
                setSales(response);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    // Fetch WebInfo data
    const fetchWebInfo = async () => {
        try {
            setWebinfoLoading(true);
            const res = await WebInfoService.getAll();
            const data = Array.isArray(res) ? res : [];
            setWebinfo(data);
        } catch (error) {
            console.error("Lỗi khi fetch WebInfo:", error);
            showToast("Tải danh sách cấu hình thất bại", "error");
            setWebinfo([]);
        } finally {
            setWebinfoLoading(false);
        }
    };

    useEffect(() => {
        fetchWebInfo();
    }, []);

    // WebInfo handlers
    const handleOpenAddModal = () => {
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingData(item);
        setIsModalOpen(true);
    };

    const handleView = (item) => {
        setSelectedWebInfo(item);
        setIsViewModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            setIsSubmitting(true);
            
            if (editingData) {
                await WebInfoService.update(editingData.maThongTinTrang, formData);
                showToast("Cập nhật cấu hình thành công!", "success");
            } else {
                await WebInfoService.create(formData);
                showToast("Thêm cấu hình mới thành công!", "success");
            }
            
            setIsModalOpen(false);
            setEditingData(null);
            await fetchWebInfo();
        } catch (err) {
            console.error("Lỗi lưu:", err);
            showToast(
                err.response?.data?.message || "Lưu cấu hình thất bại", 
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await WebInfoService.delete(id);
            showToast("Xóa cấu hình thành công!", "success");
            await fetchWebInfo();
        } catch (err) {
            console.error("Lỗi xóa:", err);
            showToast(
                err.response?.data?.message || "Xóa cấu hình thất bại", 
                "error"
            );
        }
    };

    return (
        <div className="bg-gray-50">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard 
                    title="Người dùng" 
                    value={loading ? "..." : totalUsers} 
                    icon={<Users size={18} className="text-blue-600" />}
                />
                <StatCard 
                    title="Đơn hàng" 
                    value={sales?.tongDonHang || 0} 
                    icon={<ShoppingCart size={18} className="text-orange-600" />}
                />
                <StatCard 
                    title="Doanh thu" 
                    value={`${(sales?.tongDoanhThu || 0).toLocaleString('vi-VN')} đ`} 
                    icon={<DollarSign size={18}  className="text-green-600" />}
                />
            </div>

            {/* WebInfo Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                <h2 className="text-xl font-bold text-gray-800 px-4 py-3">
                    Cấu hình Website
                </h2>
                <WebInfoTable
                    data={webinfo}
                    loading={webinfoLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    showToast={showToast}
                    onOpenAddModal={handleOpenAddModal}
                />
            </div>

            {/* Modals */}
            <WebInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingData(null);
                }}
                onSave={handleSave}
                editingData={editingData}
                isSubmitting={isSubmitting}
            />

            <WebInfoViewModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedWebInfo(null);
                }}
                data={selectedWebInfo}
            />

            {/* Toast Notification */}
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

export default Dashboard;