import { Edit, Trash2, Star } from "lucide-react";

const ProductTable = ({data, loading}) => {
    if(loading){
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">STT</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Sản phẩm</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Danh mục</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Thương hiệu</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Giá</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Tồn kho</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Khuyến mãi</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Lượt xem</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Lượt mua</th>
              <th className="p-4 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors"> 
                  
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">{index+1}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">{p.title}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">{p.category}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">{p.brand || 'N/A'}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">
                        {p.price?.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">{p.stock}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-medium text-green-600 capitalize">
                        {p.discountPercentage ? `-${p.discountPercentage}%` : 'Không'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">0</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-800 capitalize">0</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  Không tìm thấy dữ liệu phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;