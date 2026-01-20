import { Link } from "react-router-dom";

export default function SuccessCheckout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-green-600 mb-2">
                    Thanh toán thành công!
                </h1>

                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
                </p>

                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-[#2f9ea0] text-white font-semibold rounded-lg hover:[#258d8f] transition"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}
