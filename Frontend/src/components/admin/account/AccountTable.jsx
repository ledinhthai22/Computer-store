import { Edit, Trash2 } from "lucide-react";

const AccountTable = ({ data, loading, onEdit, onDelete }) => {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">STT</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Họ tên</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Email</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Mật khẩu</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Ngày tạo</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((data, index) => (
                                <tr key={data.maNguoiDung} className="hover:bg-gray-50 transition-colors">
                                  <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{index + 1}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{data.hoTen}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{data.email}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{data.password}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{data.created_at}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => onEdit(data)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(data.maNguoiDung)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="p-8 text-center text-gray-500">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountTable;