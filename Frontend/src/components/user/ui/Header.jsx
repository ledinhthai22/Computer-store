import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaSyncAlt,
  FaPhoneAlt,
  FaFacebook,
  FaYoutube,
  FaTruck
} from "react-icons/fa";
import { MdStorefront, MdSecurity } from "react-icons/md";
import { WebInfoService } from "../../../services/api/webInfoService";

export default function Header() {
  const [webInfo, setWebInfo] = useState(null);

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const rawData = await WebInfoService.userGetHeader();

        // Chuẩn hóa key từ API (tiếng Việt → camelCase)
        const normalizedData = {
          tenCuaHang: rawData["Tên cửa hàng"] || "",
          soDienThoai: rawData["Số điện thoại"] || "",
          diaChi: rawData["Địa chỉ"] || "",
          chinhSachBaoMat: rawData["Chính sách bảo mật"] || "",
          chinhSachDoiTra: rawData["Chính sách đổi trả"] || "",
          chinhSachGiaoHang: rawData["Chính sách giao hàng"] || "",
          facebook: rawData["Facebook"] || "",
          youtube: rawData["Youtube"] || "",
          zalo: rawData["Zalo"] || ""
        };

        setWebInfo(normalizedData);
      } catch (error) {
        console.error("Lỗi khi tải WebInfo:", error);
      }
    };

    fetchWebInfo();
  }, []);

  const getTopBarItems = () => {
    if (!webInfo) return [];

    const items = [];

    if (webInfo.chinhSachBaoMat) {
      items.push({
        icon: MdSecurity,
        text: `<strong>Bảo mật:</strong> ${webInfo.chinhSachBaoMat}`
      });
    }

    if (webInfo.chinhSachDoiTra) {
      items.push({
        icon: FaSyncAlt,
        text: `<strong>Đổi trả:</strong> ${webInfo.chinhSachDoiTra}`
      });
    }

    if (webInfo.chinhSachGiaoHang) {
      items.push({
        icon: FaTruck,
        text: `<strong>Giao hàng:</strong> ${webInfo.chinhSachGiaoHang}`
      });
    }

    if (webInfo.diaChi) {
      items.push({
        icon: MdStorefront,
        text: `<strong>Địa chỉ:</strong> ${webInfo.diaChi}`
      });
    }

    if (webInfo.soDienThoai) {
      items.push({
        icon: FaPhoneAlt,
        text: `<strong>Hotline:</strong> ${webInfo.soDienThoai}`
      });
    }

    if (webInfo.facebook) {
      items.push({
        icon: FaFacebook,
        text: `<strong>Facebook:</strong> ${webInfo.facebook}`
      });
    }

    if (webInfo.youtube) {
      items.push({
        icon: FaYoutube,
        text: `<strong>Youtube:</strong> ${webInfo.youtube}`
      });
    }

    return items;
  };

  const topBarItems = getTopBarItems();
  if (topBarItems.length === 0) return null;

  return (
    <header>
      <div className="w-full bg-[#268082] h-8 overflow-hidden relative z-10 border-b border-white/20">
        <div className="h-full flex items-center animate-marquee whitespace-nowrap">
          {[0, 1, 2, 3].map((loop) => (
            <div key={loop} className="flex">
              {topBarItems.map((item, index) => (
                <div
                  key={`${loop}-${index}`}
                  className="flex items-center text-white text-xs px-8"
                >
                  <item.icon className="mr-1.5 text-sm" />
                  <span
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
