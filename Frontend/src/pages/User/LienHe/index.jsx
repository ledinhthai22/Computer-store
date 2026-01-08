import { useState } from "react";
import UserToast from "../../../components/user/UserToast";

export default function LienHe() {
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

    return (
        <div className="max-w-[80%] mx-auto m-10">
            <h3 className="font-bold text-2xl text-center mb-4">
                LIÊN HỆ VỚI CHÚNG TÔI
            </h3>

            <div className="flex flex-col items-center gap-3">
                <input
                    type="email"
                    className="p-2 w-80 border rounded"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <textarea
                    className="border p-2 w-80 rounded h-40"
                    placeholder="Nhập thông tin cần liên hệ"
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="bg-[#2f9ea0] p-2 w-80 rounded text-white hover:bg-blue-600"
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
    );
}
