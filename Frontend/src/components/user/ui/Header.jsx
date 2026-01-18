import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaSyncAlt, FaPhoneAlt } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";

import { WebInfoService, handleApiError } from "../../../services/api/webInfoService"; 

export default function Header() {
  const [webInfo, setWebInfo] = useState(null);

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const data = await WebInfoService.userGetAll();

        if (Array.isArray(data) && data.length > 0) {
          setWebInfo(data[0]);
        } else {
          setWebInfo(data);
        }
      } catch (error) {
        handleApiError(error, "Lỗi khi tải thông tin Web");
      }
    };

    fetchWebInfo();
  }, []);

  const getTopBarItems = () => {
    if (!webInfo) return [];

    const items = [];

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