import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaSyncAlt, FaPhoneAlt } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";
import { WebInfoService } from "../../../services/api/webInfoService"; 

export default function Header() {
  const [webInfo, setWebInfo] = useState(null);

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const response = await WebInfoService.userGetAll();
        let rawData = response;

        // Xử lý trường hợp API trả về mảng (List) hoặc Object (Dictionary)
        // Nếu là mảng 1 phần tử bọc trong object
        if (Array.isArray(response) && response.length > 0) {
           rawData = response[0];
        }

        /* BƯỚC QUAN TRỌNG: CHUẨN HÓA DỮ LIỆU 
           Chuyển từ Key Tiếng Việt/SQL sang Key camelCase dùng cho React
        */
        const normalizedData = {
            // Ưu tiên lấy key tiếng Việt (từ DB), fallback sang key tiếng Anh nếu có
            soDienThoai: rawData["Số điện thoại"] || rawData.soDienThoai || "",
            diaChi: rawData["Địa chỉ"] || rawData.diaChi || "",
            chinhSachBaoMat: rawData["Chính sách bảo mật"] || rawData.chinhSachBaoMat || "",
            chinhSachDoiTra: rawData["Chính sách đổi trả"] || rawData.chinhSachDoiTra || "",
            tenTrang: rawData["Tên cửa hàng"] || rawData.tenTrang || ""
        };

        setWebInfo(normalizedData);

      } catch (error) {
        console.error("Lỗi khi tải thông tin WebInfo:", error);
      }
    };

    fetchWebInfo();
  }, []);

  const getTopBarItems = () => {
    if (!webInfo) return [];

    const items = [];

    // Kiểm tra dữ liệu và push vào mảng hiển thị
    if (webInfo.chinhSachBaoMat) {
      items.push({
        icon: FaCheckCircle,
        text: `<strong>Chính sách bảo mật:</strong> ${webInfo.chinhSachBaoMat}`
      });
    }

    if (webInfo.chinhSachDoiTra) {
      items.push({
        icon: FaSyncAlt,
        text: `<strong>Chính sách đổi trả:</strong> ${webInfo.chinhSachDoiTra}`
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

    return items;
  };

  const topBarItems = getTopBarItems();

  if (topBarItems.length === 0) return null;

  return (
    <header>
      <div className="w-full bg-[#268082] h-8 overflow-hidden relative z-10 border-b border-[#ffffff20]">
        <div className="h-full flex items-center animate-marquee whitespace-nowrap">
          {/* Lặp lại để tạo hiệu ứng chạy chữ vô tận */}
          {[0, 1, 2, 3].map((loopKey) => (
            <div key={loopKey} className="flex">
                {topBarItems.map((item, index) => (
                <div key={`${loopKey}-${index}`} className="flex items-center text-white text-xs px-8">
                    <item.icon className="mr-1.5 text-sm" />
                    <span dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}