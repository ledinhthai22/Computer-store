import { useState } from "react";
import { FaTruck, FaShieldAlt, FaExchangeAlt, FaTools, FaCheckCircle, FaClock, FaMoneyBillWave, FaUserShield } from "react-icons/fa";

export default function About() {
  const [activeTab, setActiveTab] = useState("giao-hang");

  const policies = {
    "giao-hang": {
      title: "Chính sách giao hàng",
      icon: <FaTruck className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Phạm vi giao hàng",
          items: [
            "Giao hàng toàn quốc 63 tỉnh thành",
            "Miễn phí giao hàng cho đơn hàng từ 500.000đ trong nội thành",
            "Hỗ trợ giao hàng nhanh trong 2-4 giờ tại TP.HCM và Hà Nội"
          ]
        },
        {
          subtitle: "Thời gian giao hàng",
          items: [
            "Nội thành: 1-2 ngày làm việc",
            "Ngoại thành: 2-3 ngày làm việc",
            "Tỉnh xa: 3-5 ngày làm việc",
            "Vùng sâu vùng xa: 5-7 ngày làm việc"
          ]
        },
        {
          subtitle: "Phí vận chuyển",
          items: [
            "Miễn phí với đơn hàng từ 500.000đ (nội thành)",
            "30.000đ - 50.000đ cho đơn hàng dưới 500.000đ",
            "Phí giao hàng ngoại tỉnh tính theo khoảng cách và trọng lượng"
          ]
        },
        {
          subtitle: "Lưu ý",
          items: [
            "Kiểm tra kỹ sản phẩm trước khi nhận hàng",
            "Quý khách có quyền từ chối nhận hàng nếu phát hiện sản phẩm bị hư hỏng",
            "Vui lòng giữ lại tem niêm phong và hóa đơn để được hỗ trợ bảo hành"
          ]
        }
      ]
    },
    "bao-mat": {
      title: "Chính sách bảo mật thông tin",
      icon: <FaShieldAlt className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Cam kết bảo mật",
          items: [
            "Thông tin cá nhân của khách hàng được bảo mật tuyệt đối",
            "Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý",
            "Sử dụng công nghệ mã hóa SSL để bảo vệ dữ liệu thanh toán"
          ]
        },
        {
          subtitle: "Thông tin được thu thập",
          items: [
            "Họ tên, số điện thoại, email, địa chỉ giao hàng",
            "Thông tin thanh toán và lịch sử mua hàng",
            "Địa chỉ IP, thông tin trình duyệt (để cải thiện trải nghiệm)"
          ]
        },
        {
          subtitle: "Mục đích sử dụng",
          items: [
            "Xử lý đơn hàng và giao hàng",
            "Gửi thông báo về đơn hàng, khuyến mãi",
            "Cải thiện chất lượng dịch vụ",
            "Hỗ trợ khách hàng khi cần thiết"
          ]
        },
        {
          subtitle: "Quyền của khách hàng",
          items: [
            "Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân",
            "Từ chối nhận email quảng cáo bất cứ lúc nào",
            "Khiếu nại về việc sử dụng thông tin cá nhân"
          ]
        }
      ]
    },
    "tra-hang": {
      title: "Chính sách đổi trả hàng",
      icon: <FaExchangeAlt className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Điều kiện đổi trả",
          items: [
            "Sản phẩm còn nguyên seal, tem niêm phong của nhà sản xuất",
            "Đầy đủ phụ kiện, hộp, tài liệu hướng dẫn kèm theo",
            "Không có dấu hiệu đã qua sử dụng hoặc hư hỏng do người dùng",
            "Có hóa đơn mua hàng hoặc phiếu xuất kho"
          ]
        },
        {
          subtitle: "Thời gian đổi trả",
          items: [
            "Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng",
            "Đổi trả trong vòng 15 ngày đối với sản phẩm lỗi do nhà sản xuất",
            "Sản phẩm trả bảo hành được đổi mới nếu lỗi lặp lại quá 3 lần"
          ]
        },
        {
          subtitle: "Trường hợp được đổi trả",
          items: [
            "Sản phẩm bị lỗi, hư hỏng do nhà sản xuất",
            "Giao nhầm model, nhầm màu sắc, thiếu phụ kiện",
            "Sản phẩm không đúng như mô tả trên website",
            "Khách hàng đổi ý (chịu phí vận chuyển và phí kiểm tra 10%)"
          ]
        },
        {
          subtitle: "Quy trình đổi trả",
          items: [
            "Liên hệ hotline hoặc gửi yêu cầu qua website",
            "Cung cấp thông tin đơn hàng và lý do đổi trả",
            "Đóng gói sản phẩm theo đúng quy cách ban đầu",
            "Gửi hàng về cửa hàng hoặc chờ nhân viên đến thu hồi"
          ]
        }
      ]
    },
    "bao-hanh": {
      title: "Chính sách bảo hành",
      icon: <FaTools className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Thời gian bảo hành",
          items: [
            "Laptop, PC: 12-24 tháng tùy theo nhà sản xuất",
            "Màn hình, bàn phím, chuột: 12 tháng",
            "Linh kiện máy tính: 24-36 tháng",
            "Phụ kiện: 6-12 tháng"
          ]
        },
        {
          subtitle: "Điều kiện bảo hành",
          items: [
            "Sản phẩm còn trong thời hạn bảo hành",
            "Có tem bảo hành, hóa đơn mua hàng hợp lệ",
            "Lỗi do nhà sản xuất, không do người dùng gây ra",
            "Không có dấu hiệu tác động ngoại lực, rơi vỡ, vào nước"
          ]
        },
        {
          subtitle: "Quy trình bảo hành",
          items: [
            "Mang sản phẩm đến cửa hàng hoặc trung tâm bảo hành",
            "Nhân viên kiểm tra và xác nhận tình trạng",
            "Tiếp nhận bảo hành và cấp phiếu bảo hành",
            "Thông báo khi sản phẩm hoàn tất sửa chữa",
            "Thời gian bảo hành: 7-15 ngày làm việc"
          ]
        },
        {
          subtitle: "Dịch vụ hỗ trợ thêm",
          items: [
            "Miễn phí vệ sinh máy, cài đặt phần mềm cơ bản",
            "Hỗ trợ kỹ thuật qua điện thoại 24/7",
            "Cho mượn máy thay thế trong thời gian bảo hành (đối với sản phẩm cao cấp)",
            "Bảo hành mở rộng với chi phí ưu đãi"
          ]
        }
      ]
    },
    "thanh-toan": {
      title: "Chính sách thanh toán",
      icon: <FaMoneyBillWave className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Hình thức thanh toán",
          items: [
            "Thanh toán khi nhận hàng (COD)",
            "Chuyển khoản ngân hàng",
            "Thanh toán qua thẻ ATM/Visa/Mastercard",
            "Thanh toán qua ví điện tử: MoMo, ZaloPay, VNPay",
            "Trả góp 0% qua thẻ tín dụng"
          ]
        },
        {
          subtitle: "Thanh toán COD",
          items: [
            "Áp dụng cho đơn hàng dưới 20.000.000đ",
            "Kiểm tra hàng trước khi thanh toán",
            "Phí COD: 0đ - 30.000đ tùy khu vực"
          ]
        },
        {
          subtitle: "Chuyển khoản ngân hàng",
          items: [
            "Giảm thêm 1% khi thanh toán chuyển khoản",
            "Đơn hàng được xử lý sau khi nhận được tiền",
            "Vui lòng ghi rõ: Họ tên + SĐT + Mã đơn hàng"
          ]
        },
        {
          subtitle: "Trả góp",
          items: [
            "Trả góp 0% lãi suất với đơn hàng từ 3.000.000đ",
            "Thời gian: 3, 6, 9, 12 tháng",
            "Hỗ trợ trả góp qua công ty tài chính",
            "Giấy tờ cần thiết: CMND/CCCD, sổ hộ khẩu"
          ]
        }
      ]
    },
    "khach-hang": {
      title: "Chính sách khách hàng thân thiết",
      icon: <FaUserShield className="text-4xl text-[#2f9ea0]" />,
      content: [
        {
          subtitle: "Hạng thành viên",
          items: [
            "Thành viên Bạc: Tổng giá trị đơn hàng từ 5.000.000đ - Ưu đãi 5%",
            "Thành viên Vàng: Tổng giá trị đơn hàng từ 15.000.000đ - Ưu đãi 8%",
            "Thành viên Kim Cương: Tổng giá trị đơn hàng từ 30.000.000đ - Ưu đãi 12%"
          ]
        },
        {
          subtitle: "Ưu đãi cho thành viên",
          items: [
            "Giảm giá cho mọi đơn hàng theo hạng thành viên",
            "Miễn phí giao hàng toàn quốc",
            "Ưu tiên hỗ trợ kỹ thuật và bảo hành",
            "Nhận thông báo sớm về chương trình khuyến mãi",
            "Quà tặng sinh nhật đặc biệt"
          ]
        },
        {
          subtitle: "Tích điểm thưởng",
          items: [
            "Tích 1 điểm cho mỗi 100.000đ chi tiêu",
            "1000 điểm = 100.000đ voucher giảm giá",
            "Điểm thưởng có giá trị trong 12 tháng",
            "Điểm cộng dồn khi mua hàng và giới thiệu bạn bè"
          ]
        },
        {
          subtitle: "Chương trình giới thiệu",
          items: [
            "Tặng 200.000đ khi giới thiệu bạn bè mua hàng",
            "Bạn bè được giảm 100.000đ cho đơn hàng đầu tiên",
            "Không giới hạn số lần giới thiệu",
            "Nhận thưởng ngay khi đơn hàng được xác nhận"
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2f9ea0] to-[#25797a] text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chính sách & Điều khoản</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Tìm hiểu về các chính sách mua hàng, bảo hành và dịch vụ khách hàng của chúng tôi
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.keys(policies).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-4 rounded-xl transition-all ${
                activeTab === key
                  ? "bg-[#2f9ea0] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={activeTab === key ? "text-white" : ""}>
                  {policies[key].icon}
                </div>
                <span className="text-sm font-semibold text-center">
                  {policies[key].title.replace("Chính sách ", "")}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            {policies[activeTab].icon}
            <h2 className="text-3xl font-bold text-gray-800">
              {policies[activeTab].title}
            </h2>
          </div>

          <div className="space-y-8">
            {policies[activeTab].content.map((section, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-[#2f9ea0]" />
                  {section.subtitle}
                </h3>
                <ul className="space-y-3 ml-8">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-[#2f9ea0] mt-1">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-[#2f9ea0]/10 to-[#25797a]/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <FaClock className="text-3xl text-[#2f9ea0] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    Cần hỗ trợ thêm thông tin?
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/gui-lien-he"
                      className="px-6 py-2 bg-[#2f9ea0] text-white rounded-lg font-semibold hover:bg-[#25797a] transition shadow-md"
                    >
                      Liên hệ ngay
                    </a>
                    <a
                      href="tel:0123456789"
                      className="px-6 py-2 bg-white text-[#2f9ea0] border-2 border-[#2f9ea0] rounded-lg font-semibold hover:bg-[#2f9ea0] hover:text-white transition"
                    >
                      Hotline: 0123 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}