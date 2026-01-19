import { Link } from "react-router-dom";
import { useEffect } from "react";
export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Trang không tồn tại";
  }, []);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Trang bạn tìm không tồn tại
      </p>

      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Quay về trang chủ</Link>
    </div>
  );
}
