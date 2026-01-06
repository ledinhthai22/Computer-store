import { Edit, Trash2 } from "lucide-react";

const CategoryTable = ({ data, loading, onEdit, onDelete }) => {
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
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Danh mục</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Slug</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((c, index) => (
                                <tr key={c.maDanhMuc} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{index + 1}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{c.tenDanhMuc}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{c.slug}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-center gap-2 cursor-pointer">
                                            {/* Nút Sửa */}
                                            <button 
                                                onClick={() => onEdit(c)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center flex items-center gap-1 white-space-nowrap cursor-pointer"
                                            >
                                                <Edit size={20} /> Sửa
                                            </button>
                                            {/* Nút Xóa */}
                                            <button 
                                                onClick={() => onDelete(c.maDanhMuc)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-center flex items-center gap-1 white-space-nowrap cursor-pointer"
                                            >
                                                <Trash2 size={20} /> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
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

export default CategoryTable;