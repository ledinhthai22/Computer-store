import { Link } from "react-router-dom";
import { FaFacebook,FaYoutube,FaInstagramSquare,FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
export default function Footer(){
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
            const res = await fetch("https://localhost:7012/api/Contact/SendContact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, noiDung })
            });

            if (!res.ok) throw new Error("Gửi liên hệ thất bại");

            showToast("Gửi liên hệ thành công", "success");

            setEmail("");
            setNoiDung("");
        } catch (err) {
            console.error(err);
            showToast("Có lỗi xảy ra vui lòng thử lại", "error");
        }
    };
    return(
        <footer className="bg-stone-100">
            <div className="max-w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-lg mb-4 text-gray-700">
                    Liên hệ với chúng tôi
                </h3>

                <div className="flex flex-col gap-2">
                    <input
                    type="email"
                    className="
                        w-full p-3 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]
                        placeholder-gray-400
                    "
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <textarea
                    className="
                        w-full h-32 p-3 border rounded-lg resize-none
                        focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]
                        placeholder-gray-400
                    "
                    placeholder="Nhập nội dung liên hệ"
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                    />

                    <button
                    onClick={handleSubmit}
                    className="
                        bg-[#2f9ea0] text-white font-semibold py-3 rounded-lg
                        hover:bg-blue-500 transition cursor-pointer
                    "
                    >
                    Gửi liên hệ
                    </button>
                </div>
                </div>

                {/* POLICY */}
                <div>
                <h3 className="font-bold text-lg mb-4 text-gray-700">
                    Chính sách
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    {[1,2,3,4,5].map(i => (
                    <li key={i}>
                        <Link
                        to="/about"
                        className="hover:text-[#2f9ea0] hover:underline transition"
                        >
                        Lorem ipsum dolor sit amet
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>

                {/* SUPPORT */}
                <div>
                <h3 className="font-bold text-lg mb-4 text-gray-700">
                    Hỗ trợ khách hàng
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    {[1,2,3,4,5].map(i => (
                    <li key={i}>
                        <Link
                        to="/about"
                        className="hover:text-[#2f9ea0] hover:underline transition"
                        >
                        Hướng dẫn & điều khoản
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>

                {/* SOCIAL */}
                <div>
                <h3 className="font-bold text-lg mb-4 text-gray-700">
                    Kết nối với chúng tôi
                </h3>

                <div className="flex gap-7">
                    <Link title="Facebook" className="social-icon text-blue-600"><FaFacebook /></Link>
                    <Link title="Youtube" className="social-icon text-red-500"><FaYoutube /></Link>
                    <Link title="Instagram" className="social-icon text-pink-500"><FaInstagramSquare /></Link>
                    <Link title="Tiktok" className="social-icon text-stone-600"><FaTiktok /></Link>
                    <Link title="Zalo" className="social-icon text-blue-500"><SiZalo /></Link>
                </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="border-t border-stone-300 py-6">
                <div className="max-w-[85%] mx-auto text-center text-sm text-stone-600">
                <p>
                    Công ty TNHH Thương Mại và Dịch Vụ Kỹ Thuật DIỆU PHÚC – GPĐKKD: 0316172372 –
                    350-352 Võ Văn Kiệt, TP.HCM – 028.7108.9666
                </p>

                <div className="flex justify-center gap-4 mt-3">
                    <img
                    className="h-10 object-contain"
                    src="https://cdn2.cellphones.com.vn/80x,webp/media/logo/logoSaleNoti.png"
                    alt="bocongthuong"
                    />
                    <img
                    className="h-10 object-contain"
                    src="https://images.dmca.com/Badges/dmca_copyright_protected150c.png"
                    alt="dmca"
                    />
                </div>
                </div>
            </div>
        </footer>
    );
}