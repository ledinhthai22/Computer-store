import { History } from "lucide-react";

const BrandRecoverTable = ({ data, loading, onRecover }) => {
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
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Tên thương hiệu</th>
                            <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((data, index) => (
                                <tr key={data.brandID} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{index + 1}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 capitalize">{data.brandName}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Nút Khôi phục */}
                                            <button 
                                                onClick={() => onRecover(data.brandID)}
                                                className="p-2 bg-green-400 hover:bg-green-500 rounded-lg transition-colors text-center flex items-center gap-1 white-space-nowrap cursor-pointer"
                                            >
                                                <History size={20} /> Khôi phục
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">
                                    Không tìm thấy thương hiệu nào trong danh sách xóa.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrandRecoverTable;