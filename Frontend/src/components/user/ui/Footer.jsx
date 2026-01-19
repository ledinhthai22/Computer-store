import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaInstagramSquare, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { WebInfoService } from "../../../services/api/webInfoService";

export default function Footer() {
    const [webInfo, setWebInfo] = useState(null);

    useEffect(() => {
        const fetchWebInfo = async () => {
            try {
                const response = await WebInfoService.userGetAll();
                let rawData = response;

                if (Array.isArray(response) && response.length > 0) {
                    rawData = response[0];
                }

                /* BƯỚC QUAN TRỌNG: CHUẨN HÓA DỮ LIỆU
                   Map các key Mạng xã hội từ DB SQL (hình ảnh 3) 
                */
                const normalizedData = {
                    tenTrang: rawData["Tên cửa hàng"] || rawData.tenTrang || "Công ty",
                    diaChi: rawData["Địa chỉ"] || rawData.diaChi || "",
                    soDienThoai: rawData["Số điện thoại"] || rawData.soDienThoai || "",
                    
                    // Map Social Media Links
                    duongDanFacebook: rawData["Facebook"] || rawData.duongDanFacebook || "",
                    duongDanYoutube: rawData["Youtube"] || rawData.duongDanYoutube || "",
                    duongDanZalo: rawData["Zalo"] || rawData.duongDanZalo || "",
                    duongDanTiktok: rawData["Tiktok"] || rawData.duongDanTiktok || "",
                    duongDanInstagram: rawData["Instagram"] || rawData.duongDanInstagram || ""
                };

                setWebInfo(normalizedData);
            } catch (error) {
                console.error("Lỗi tải thông tin footer:", error);
            }
        };

        fetchWebInfo();
    }, []);

    const renderSocialIcons = () => {
        if (!webInfo) return null;
        
        const socials = [
            { 
                key: 'facebook', 
                url: webInfo.duongDanFacebook, 
                icon: FaFacebook, 
                color: 'text-blue-600' 
            },
            { 
                key: 'youtube', 
                url: webInfo.duongDanYoutube, 
                icon: FaYoutube, 
                color: 'text-red-600' 
            },
            { 
                key: 'instagram', 
                url: webInfo.duongDanInstagram, 
                icon: FaInstagramSquare, 
                color: 'text-pink-600' 
            },
            { 
                key: 'tiktok', 
                url: webInfo.duongDanTiktok, 
                icon: FaTiktok, 
                color: 'text-black' 
            },
            { 
                key: 'zalo', 
                url: webInfo.duongDanZalo, 
                icon: SiZalo, 
                color: 'text-blue-500' 
            },
        ];

        return socials.map((social) => {
            if (!social.url) return null;

            return (
                <a 
                    key={social.key}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={social.key} 
                    className={`text-3xl ${social.color} hover:scale-110 transition-transform`}
                >
                    <social.icon />
                </a>
            );
        });
    };

    return (
        <footer className="bg-stone-50 text-gray-700 mt-auto border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
                
                {/* Cột 1: Thông tin về chính sách */}
                <div className="md:pt-2"> 
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Chính sách hỗ trợ
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><Link to="/warranty-policy" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Chính sách bảo hành</Link></li>
                        <li><Link to="/return-policy" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Chính sách đổi trả</Link></li>
                        <li><Link to="/shipping-policy" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Giao hàng & Lắp đặt</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Bảo mật thông tin</Link></li>
                    </ul>
                </div>

                {/* Cột 2: Hướng dẫn */}
                <div className="md:pt-2"> 
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Hỗ trợ khách hàng
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><Link to="/payment-guide" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Hướng dẫn thanh toán</Link></li>
                        <li><Link to="/installment" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Hướng dẫn trả góp</Link></li>
                        <li><Link to="/check-order" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Tra cứu đơn hàng</Link></li>
                    </ul>
                </div>

                {/* Cột 3: Về công ty */}
                <div className="md:pt-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Về chúng tôi
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><Link to="/about-us" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Giới thiệu công ty</Link></li>
                        <li><Link to="/store-system" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Hệ thống cửa hàng</Link></li>
                        <li><Link to="/careers" className="hover:text-[#2f9ea0] hover:pl-1 transition-all">Tuyển dụng nhân tài</Link></li>
                        
                        {webInfo?.soDienThoai && (
                            <li className="mt-4 pt-2 border-t border-gray-200">
                                <span className="block font-semibold text-gray-700">Tổng đài hỗ trợ:</span>
                                <a href={`tel:${webInfo.soDienThoai}`} className="text-xl font-bold text-[#2f9ea0] hover:text-[#268082]">
                                    {webInfo.soDienThoai}
                                </a>
                                <span className="text-xs block text-gray-400 mt-1">(8:00 - 21:00)</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Cột 4: Kết nối */}
                <div className="md:pt-2">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 uppercase text-sm tracking-wide">
                        Kết nối cộng đồng
                    </h3>
                    
                    {/* Render icon động */}
                    <div className="flex gap-4 mb-6">
                        {renderSocialIcons()}
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
                        © {new Date().getFullYear()} {webInfo?.tenTrang}. GPĐKKD: 0316172372.
                    </p>
                    {webInfo?.diaChi && (
                        <p className="mt-2 md:mt-0 max-w-lg text-right">
                            Địa chỉ: {webInfo.diaChi}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}