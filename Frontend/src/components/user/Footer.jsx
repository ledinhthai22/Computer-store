import { Link } from "react-router-dom";
import { FaFacebook,FaYoutube,FaInstagramSquare,FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { useState } from "react";
import UserToast from "./UserToast";
export default function Footer(){
    const [email, setEmail] = useState("");
    const [noiDung, setNoiDung] = useState("");
    const [toast, setToast] = useState(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSubmit = async () => {
        if (!email || !noiDung) {
            setToast({
                message: "Vui lòng nhập đầy đủ thông tin",
                type: "info"
            });
            return;
        }
        if (!emailRegex.test(email)) {
            setToast({
                message: "Email không đúng định dạng",
                type: "error"
            });
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

            setToast({
                message: "Gửi liên hệ thành công ",
                type: "success"
            });

            setEmail("");
            setNoiDung("");
        } catch (err) {
            console.error(err);
            setToast({
                message: "Có lỗi xảy ra, vui lòng thử lại ",
                type: "error"
            });
        }
    };
    return(
        <footer>
            <div className="max-w-[85%] mx-auto mt-5 ">
                <div className="flex justify-center">
                <div className="max-w-[80%] mx-auto m-2">
                    <h3 className="font-bold text-2xl text-center mb-4">
                        LIÊN HỆ VỚI CHÚNG TÔI
                    </h3>

                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            className="p-2 w-60 border rounded"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <textarea
                            className="border p-2 w-60 rounded h-40"
                            placeholder="Nhập thông tin cần liên hệ"
                            value={noiDung}
                            onChange={(e) => setNoiDung(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            className="bg-[#2f9ea0] p-2 w-60 rounded text-white hover:bg-blue-600"
                        >
                            Gửi liên hệ
                        </button>
                    </div>

                    {toast && (
                        <UserToast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </div>
                    {/* <div className="m-2">   
                        <h3 className="font-bold">Đăng ký nhận khuyến mãi</h3>
                        <p>Email: </p>
                        <input className="p-2 w-60 border-1 rounded" type="email" placeholder="Nhập email của bạn" /> <br/>
                        <p>Số điện thoại: </p>
                        <input className="p-2 w-60 border-1 rounded" type="text" placeholder="Nhập số điện thoại của bạn" /><br/>
                        <button className="bg-[#2f9ea0] p-2 w-60 rounded mt-4 text-white hover:bg-blue-600">Đăng ký</button>
                    </div> */}
                    <div className="m-2">
                        <h3 className="font-bold">Thông tin về chính sách</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div className="m-2">
                        <h3 className="font-bold">Dịch vụ và thông tin khác</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div className="m-1">
                        <h3 className="font-bold">Thông tin kết nối</h3>
                        <div className="flex m-2">
                            <Link title="Facebook" className="mr-2 hover:text-blue-500 transition-colors" to={`/`}><FaFacebook className="size-8" /></Link>
                            <Link title="Youtube" className="mr-2 hover:text-red-500 transition-colors" to={`/`}><FaYoutube className="size-8" /></Link>
                            <Link title="Instagram" className="mr-2 hover:text-stone-500 transition-colors" to={`/`}><FaInstagramSquare className="size-8" /></Link>
                            <Link title="TikTok" className="mr-2 hover:text-stone-500 transition-colors" to={`/`}><FaTiktok className="size-8" /></Link>
                            <Link title="Zalo" className="mr-2 hover:text-blue-500 transition-colors" to={`/`}><SiZalo className="size-8" /></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center w-[70%] mx-auto text-sm text-stone-600 mb-5">
                <p>Công ty TNHH Thương Mại và Dịch Vụ Kỹ Thuật DIỆU PHÚC - GPĐKKD: 0316172372 cấp tại Sở KH & ĐT TP. HCM. Địa chỉ văn phòng: 350-352 Võ Văn Kiệt,
             Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh, Việt Nam. Điện thoại: 028.7108.9666.</p>
                <div className="flex justify-center mt-2">
                <img src="https://cdn2.cellphones.com.vn/80x,webp/media/logo/logoSaleNoti.png" alt="bocongthuong"/>
                <img src="https://images.dmca.com/Badges/dmca_copyright_protected150c.png?ID=158f5667-cce3-4a18-b2d1-826225e6b022" alt="bocongthuong"/>
                </div>
            </div>
        </footer>
    );
}