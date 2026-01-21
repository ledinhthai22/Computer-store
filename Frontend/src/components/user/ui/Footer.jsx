import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaInstagramSquare,
  FaTiktok
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { WebInfoService } from "../../../services/api/webInfoService";

export default function Footer() {
  const [webInfo, setWebInfo] = useState(null);

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const rawData = await WebInfoService.userGetHeader();

        const normalizedData = {
          tenTrang: rawData["Tên cửa hàng"] || "",
          diaChi: rawData["Địa chỉ"] || "",
          soDienThoai: rawData["Số điện thoại"] || "",

          facebook: rawData["Facebook"] || "",
          youtube: rawData["Youtube"] || "",
          zalo: rawData["Zalo"] || "",
          tiktok: rawData["Tiktok"] || "",
          instagram: rawData["Instagram"] || ""
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
        key: "facebook",
        url: webInfo.facebook,
        icon: FaFacebook,
        color: "text-blue-600"
      },
      {
        key: "youtube",
        url: webInfo.youtube,
        icon: FaYoutube,
        color: "text-red-600"
      },
      {
        key: "instagram",
        url: webInfo.instagram,
        icon: FaInstagramSquare,
        color: "text-pink-600"
      },
      {
        key: "tiktok",
        url: webInfo.tiktok,
        icon: FaTiktok,
        color: "text-black"
      },
      {
        key: "zalo",
        url: webInfo.zalo,
        icon: SiZalo,
        color: "text-blue-500"
      }
    ];

    return socials.map(
      (social) =>
        social.url && (
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
        )
    );
  };

  return (
    <footer className="bg-stone-50 text-gray-700 mt-auto border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
        {/* Cột 1 */}
        <div>
          <h3 className="font-bold mb-4 text-gray-800 uppercase text-sm tracking-wide">
            Chính sách hỗ trợ
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/warranty-policy" className="hover:text-[#2f9ea0]">Chính sách bảo hành</Link></li>
            <li><Link to="/return-policy" className="hover:text-[#2f9ea0]">Chính sách đổi trả</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-[#2f9ea0]">Giao hàng & Lắp đặt</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#2f9ea0]">Bảo mật thông tin</Link></li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-bold mb-4 text-gray-800 uppercase text-sm tracking-wide">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/payment-guide" className="hover:text-[#2f9ea0]">Hướng dẫn thanh toán</Link></li>
            <li><Link to="/installment" className="hover:text-[#2f9ea0]">Hướng dẫn trả góp</Link></li>
            <li><Link to="/check-order" className="hover:text-[#2f9ea0]">Tra cứu đơn hàng</Link></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-bold mb-4 text-gray-800 uppercase text-sm tracking-wide">
            Về chúng tôi
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/about-us" className="hover:text-[#2f9ea0]">Giới thiệu công ty</Link></li>
            <li><Link to="/store-system" className="hover:text-[#2f9ea0]">Hệ thống cửa hàng</Link></li>
            <li><Link to="/careers" className="hover:text-[#2f9ea0]">Tuyển dụng</Link></li>

            {webInfo?.soDienThoai && (
              <li className="pt-4 border-t border-gray-200">
                <span className="block font-semibold">Tổng đài hỗ trợ</span>
                <a
                  href={`tel:${webInfo.soDienThoai}`}
                  className="text-xl font-bold text-[#2f9ea0]"
                >
                  {webInfo.soDienThoai}
                </a>
                <span className="block text-xs text-gray-400">(8:00 - 21:00)</span>
              </li>
            )}
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h3 className="font-bold mb-4 text-gray-800 uppercase text-sm tracking-wide">
            Kết nối cộng đồng
          </h3>

          <div className="flex gap-4 mb-6">
            {renderSocialIcons()}
          </div>

          <h3 className="font-bold mb-2 text-gray-800 uppercase text-sm tracking-wide">
            Chứng nhận
          </h3>
          <div className="flex gap-2">
            <img className="h-8" src="https://cdn2.cellphones.com.vn/80x,webp/media/logo/logoSaleNoti.png" alt="bct" />
            <img className="h-8" src="https://images.dmca.com/Badges/dmca_copyright_protected150c.png" alt="dmca" />
          </div>
        </div>
      </div>

      <div className="border-t bg-stone-200/50 py-4">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {webInfo?.tenTrang}</p>
          {webInfo?.diaChi && <p>Địa chỉ: {webInfo.diaChi}</p>}
        </div>
      </div>
    </footer>
  );
}
