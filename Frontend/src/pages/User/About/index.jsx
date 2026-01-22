import { useEffect, useState } from "react";
import { WebInfoService } from "../../../services/api/webInfoService";

export default function About() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Chính Sách";

    const fetchData = async () => {
      try {
        const response = await WebInfoService.userGetAll();
        const list = Array.isArray(response) ? response : [];

        // Chỉ lấy các mục có tên chứa "chính sách" (không phân biệt hoa thường)
        // và đang hiển thị (trangThaiHienThi === true)
        const policyItems = list.filter(
          item =>
            item.trangThaiHienThi === true &&
            item.tenKhoaCaiDat.toLowerCase().includes("chính sách")
        );

        setData(policyItems);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang About:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Đang tải dữ liệu...
      </div>
    );
  }

  // Nếu không có dữ liệu chính sách nào thì hiển thị thông báo
  if (data.length === 0) {
    return (
      <section className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <header className="mb-14 text-center">
            <h1 className="text-4xl font-bold text-gray-800">Chính sách</h1>
            <div className="mt-4 h-1 w-20 bg-teal-600 mx-auto rounded-full" />
          </header>
          <div className="text-center text-gray-600 text-lg">
            Hiện tại chưa có chính sách nào được hiển thị.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-14">
        {/* Header */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Chính sách</h1>
          <div className="mt-4 h-1 w-20 bg-teal-600 mx-auto rounded-full" />
        </header>

        {/* Content - chỉ hiển thị các mục chính sách */}
        <div className="space-y-10">
          {data.map(item => (
            <article
              key={item.maThongTinTrang}
              className="
                bg-white
                border border-gray-200
                rounded-2xl
                p-8
                shadow-sm
              "
            >
              {/* Tên chính sách */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                {item.tenKhoaCaiDat}
              </h2>

              {/* Nội dung chính sách */}
              <div
                className="
                  text-gray-600
                  leading-8
                  text-justify
                  whitespace-pre-line
                "
              >
                {item.giaTriCaiDat}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}