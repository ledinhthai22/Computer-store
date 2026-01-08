import { FaShippingFast, FaCheckCircle, FaSyncAlt } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";

const topBarItems = [
    { icon: FaCheckCircle, text: "Sản phẩm <strong>Chính hãng - Xuất VAT</strong> đầy đủ" },
    { icon: FaShippingFast, text: "<strong>Giao nhanh - Miễn phí</strong> cho đơn 300k" },
    { icon: FaSyncAlt, text: "<strong>Thu cũ</strong> giá ngon - <strong>Lên đời</strong> tiết kiệm" },
    { icon: MdStorefront, text: "<strong>Cửa hàng</strong> gần bạn" },
];
export default function Header(){
    return(
        <header>
            <div className="w-full bg-[#268082] h-8 overflow-hidden relative z-10 border-b border-[#ffffff20]">
                <div className="h-full flex items-center animate-marquee whitespace-nowrap">
                {[0, 1, 2].map((loopKey) => (
                    topBarItems.map((item, index) => (
                        <div key={`${loopKey}-${index}`} className="flex items-center text-white text-xs px-8">
                            <item.icon className="mr-1.5 text-sm" />
                            <span dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                    ))
                ))}
                </div>
            </div>
        </header>
    );
}