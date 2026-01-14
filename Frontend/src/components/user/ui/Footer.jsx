import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaInstagramSquare, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { contactService, handleApiError } from "../../../services/api/contactService";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [noiDung, setNoiDung] = useState("");
    const { showToast } = useToast();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async () => {
        if (!email || !noiDung) {
            showToast("Vui lòng nhập đầy đủ thông tin", "info");
            return;
        }
        if (!emailRegex.test(email)) {
            showToast("Email không đúng định dạng", "error");
            return;
        }

        try {
            await contactService.create({ email, noiDung });
            showToast("Gửi liên hệ thành công", "success");
            setEmail("");
            setNoiDung("");
        } catch (err) {
            const message = handleApiError(err, "Gửi liên hệ thất bại vui lòng thử lại");
            showToast(message, "error");
        }
    };

    return (
        <footer className="bg-stone-50 text-gray-700 mt-auto border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                    <h3 className="font-bold text-lg mb-4 text-[#2f9ea0]">
                        Liên hệ hỗ trợ
                    </h3>

                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]/50 text-sm transition-shadow"
                            placeholder="Email của bạn..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <textarea
                            className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]/50 text-sm transition-shadow"
                            placeholder="Nội dung cần hỗ trợ..."
                            value={noiDung}
                            onChange={(e) => setNoiDung(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            className="bg-[#2f9ea0] text-white font-semibold py-2.5 rounded-lg hover:bg-[#258d8f] active:scale-95 transition-all shadow-md hover:shadow-lg"
                        >
                            Gửi ngay
                        </button>
                    </div>
                </div>

                <div className="md:pt-2"> 
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Chính sách mua hàng
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Chính sách bảo hành </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Chính sách đổi trả</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Giao hàng & Lắp đặt</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Bảo mật thông tin</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Hướng dẫn thanh toán</Link>
                        </li>
                    </ul>
                </div>

                <div className="md:pt-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Về chúng tôi
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Giới thiệu công ty</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Hệ thống cửa hàng</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Tuyển dụng nhân tài</Link>
                        </li>
                        <li>
                            <span className="block font-semibold mt-2">Tổng đài hỗ trợ:</span>
                            <a href="tel:18006601" className="text-lg font-bold text-[#2f9ea0]">1800.6601</a>
                            <span className="text-xs block text-gray-400">(8:00 - 21:00)</span>
                        </li>
                    </ul>
                </div>

                <div className="md:pt-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Kết nối cộng đồng
                    </h3>
                    
                    <div className="flex gap-4 mb-6">
                        <Link title="Facebook" className="text-3xl text-blue-600 hover:scale-110 transition-transform"><FaFacebook /></Link>
                        <Link title="Youtube" className="text-3xl text-red-600 hover:scale-110 transition-transform"><FaYoutube /></Link>
                        <Link title="Instagram" className="text-3xl text-pink-600 hover:scale-110 transition-transform"><FaInstagramSquare /></Link>
                        <Link title="Tiktok" className="text-3xl text-black hover:scale-110 transition-transform"><FaTiktok /></Link>
                        <Link title="Zalo" className="text-3xl text-blue-500 hover:scale-110 transition-transform"><SiZalo /></Link>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-800 uppercase text-sm tracking-wide">
                        Chứng nhận
                    </h3>
                    <div className="flex gap-2">
                        <img className="h-8 object-contain cursor-pointer hover:opacity-80" src="https://cdn2.cellphones.com.vn/80x,webp/media/logo/logoSaleNoti.png" alt="bocongthuong" />
                        <img className="h-8 object-contain cursor-pointer hover:opacity-80" src="https://images.dmca.com/Badges/dmca_copyright_protected150c.png" alt="dmca" />
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-200 bg-stone-200/50 py-4">
                <div className="container mx-auto px-4 max-w-7xl text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
                    <p>
                        © 2024 Công ty TNHH Computer Store. GPĐKKD: 0316172372 do Sở KH & ĐT TP.HCM cấp.
                    </p>
                    <p className="mt-2 md:mt-0">
                        Địa chỉ: 350-352 Võ Văn Kiệt, TP.HCM
                    </p>
                </div>
            </div>
        </footer>
    );
}