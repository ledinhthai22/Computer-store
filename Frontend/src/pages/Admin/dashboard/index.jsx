import { useState, useEffect } from 'react';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';
import { userService } from "../../../services/api/userService";
import StatCard from '../../../components/admin/dashboard/StatCard';
import DashboardChart from '../../../components/admin/dashboard/DashboardChart';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    // Dữ liệu mẫu (sau này có thể fetch từ API)
    const getOrderStats = () => 150;
    const getRevenueStats = () => 45000000;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getAll();
                setTotalUsers(response.length || 0);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const chartData = [
        { name: 'Tháng 1', users: totalUsers, orders: 24, revenue: 2400 },
        { name: 'Tháng 2', users: totalUsers, orders: 13, revenue: 2210 },
        { name: 'Tháng 3', users: totalUsers, orders: 98, revenue: 2290 },
        { name: 'Tháng 4', users: totalUsers, orders: 39, revenue: 2000 },
        { name: 'Tháng 5', users: totalUsers, orders: 48, revenue: 2181 },
        { name: 'Tháng 6', users: totalUsers, orders: 38, revenue: 2500 },
    ];
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Người dùng" 
                    value={loading ? "..." : totalUsers} 
                    icon={<Users className="text-blue-600" />}
                    trend="Tăng"
                    trendColor="text-green-500"
                />
                <StatCard 
                    title="Đơn hàng" 
                    value={getOrderStats()} 
                    icon={<ShoppingCart className="text-orange-600" />}
                    trend="Giảm"
                    trendColor="text-red-500"
                />
                <StatCard 
                    title="Doanh thu" 
                    value={`${getRevenueStats().toLocaleString()} VNĐ`} 
                    icon={<DollarSign className="text-green-600" />}
                    trend="Ổn định"
                    trendColor="text-blue-500"
                />
            </div>
            <DashboardChart data={chartData} />
        </div>
    );
};

export default Dashboard;