import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaInstagramSquare,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { useState, useEffect } from "react";

import { useToast } from "../../../contexts/ToastContext";
import { contactService, handleApiError } from "../../../services/api/contactService";
import { WebInfoService } from "../../../services/api/webInfoService";

export default function LienHe() {
  const [email, setEmail] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [webInfo, setWebInfo] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Gửi liên hệ";
  }, []);

  /* =========================
     LẤY DỮ LIỆU TỪ userGetAll
     ========================= */
  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const data = await WebInfoService.userGetAll();
        if (!Array.isArray(data)) return;

        const getValue = (key) =>
          data.find(
            (item) =>
              item.tenKhoaCaiDat === key && item.trangThaiHienThi
          )?.giaTriCaiDat || "";

        setWebInfo({
          tenTrang: getValue("Tên cửa hàng"),
          diaChi: getValue("Địa chỉ"),
          soDienThoai: getValue("Số điện thoại"),
          email: getValue("Email"),
          duongDanFacebook: getValue("Facebook"),
          duongDanYoutube: getValue("Youtube"),
          duongDanInstagram: getValue("Instagram"),
          duongDanTiktok: getValue("Tiktok"),
          duongDanZalo: getValue("Zalo"),
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin web:", error);
      }
    };

    fetchWebInfo();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !noiDung) {
      showToast("Vui lòng nhập đầy đủ thông tin", "info");
      return;
    }

    if (!emailRegex.test(email)) {
      showToast("Email không đúng định dạng", "error");
      return;
    }

    setIsLoading(true);
    try {
      await contactService.create({ email, noiDung });
      showToast("Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm!", "success");
      setEmail("");
      setNoiDung("");
    } catch (err) {
      const message = handleApiError(err, "Gửi liên hệ thất bại vui lòng thử lại");
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSocialIcons = () => {
    if (!webInfo) return null;

    const socials = [
      { key: "fb", url: webInfo.duongDanFacebook, icon: FaFacebook, color: "bg-blue-600" },
      { key: "yt", url: webInfo.duongDanYoutube, icon: FaYoutube, color: "bg-red-600" },
      { key: "ins", url: webInfo.duongDanInstagram, icon: FaInstagramSquare, color: "bg-pink-600" },
      { key: "tik", url: webInfo.duongDanTiktok, icon: FaTiktok, color: "bg-black" },
      { key: "zalo", url: webInfo.duongDanZalo, icon: SiZalo, color: "bg-blue-500" },
    ];

    return socials.map(
      (item) =>
        item.url && (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div
              className={`${item.color} text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform`}
            >
              <item.icon size={24} />
            </div>
          </a>
        )
    );
  };

  return (
    <div className="bg-stone-100 min-h-screen">
      {/* Header */}
      <div className="bg-[#2f9ea0] py-16 text-center shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Liên hệ với {webInfo?.tenTrang || "chúng tôi"}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium">
            Gửi liên hệ cho chúng tôi, chúng tôi sẽ trả lời bạn ngay.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#2f9ea0] pl-4">
              Gửi thắc mắc của bạn
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]/50 bg-gray-50 transition-all"
                  placeholder="nhapemailcuaban@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Nội dung cần hỗ trợ <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2f9ea0]/50 bg-gray-50 transition-all"
                  placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải..."
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#2f9ea0] text-white font-bold py-4 rounded-xl shadow-md transition-all 
                  ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[#258d8f] hover:shadow-lg active:scale-[0.98]"
                  }`}
              >
                {isLoading ? "Đang gửi..." : "Gửi tin nhắn ngay"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#2f9ea0] pl-4">
                Thông tin liên lạc
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {webInfo?.tenTrang || "Cửa hàng"} luôn sẵn sàng lắng nghe và hỗ trợ bạn.
              </p>

              <div className="space-y-6">
                {webInfo?.diaChi && (
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border">
                    <FaMapMarkerAlt className="text-[#2f9ea0]" />
                    <p>{webInfo.diaChi}</p>
                  </div>
                )}

                {webInfo?.soDienThoai && (
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border">
                    <FaPhoneAlt className="text-[#2f9ea0]" />
                    <a href={`tel:${webInfo.soDienThoai}`} className="font-bold text-[#2f9ea0]">
                      {webInfo.soDienThoai}
                    </a>
                  </div>
                )}

                {webInfo?.email && (
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border">
                    <FaEnvelope className="text-[#2f9ea0]" />
                    <a href={`mailto:${webInfo.email}`}>{webInfo.email}</a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#2f9ea0] pl-4">
                Kết nối mạng xã hội
              </h2>
              <div className="flex gap-6 flex-wrap">{renderSocialIcons()}</div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-md h-64 w-full border border-gray-200"> 
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.756966934177!2d106.70060596955592!3d10.771894099336052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2sus!4v1768556871481!5m2!1svi!2sus" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" 
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
