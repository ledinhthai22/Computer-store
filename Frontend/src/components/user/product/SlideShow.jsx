import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Link } from "react-router-dom";
import { slideShowService } from "../../../services/api/slideShowService"; 

const API_IMAGE_BASE_URL = "https://localhost:7012"; 

export default function Slideshow() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await slideShowService.userGetAll();
        
        const activeSlides = response
          .filter(item => item.trangThai === true)
          .sort((a, b) => a.soThuTu - b.soThuTu);

        setSlides(activeSlides);
      } catch (error) {
        console.error("Lỗi khi tải slideshow:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading)
    return (
      <div className="w-full h-[350px] lg:h-[450px] flex items-center justify-center bg-stone-50 animate-pulse">
        Loading...
      </div>
    );

  if (slides.length === 0) return null;

  const currentSlide = slides[index];

  const imageUrl = currentSlide.duongDanHinh.startsWith("http") 
    ? currentSlide.duongDanHinh 
    : `${API_IMAGE_BASE_URL}${currentSlide.duongDanHinh}`;

  return (
    <div className="relative w-full mx-auto overflow-hidden shadow-sm h-[350px] lg:h-[450px] bg-white group border border-stone-100">
      
      <Link to={currentSlide.duongDanSanPham} className="block w-full h-full">
        <img
          src={imageUrl}
          alt={`Slide ${currentSlide.soThuTu}`}
          className="w-full h-full object-contain bg-gray-50" 
        />
      </Link>
      
      {/* Nút Previous */}
      <button
        onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-white/80 hover:bg-[#2f9ea0] hover:text-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
      >
        <MdNavigateBefore size={24} />
      </button>
      
      {/* Nút Next */}
      <button
        onClick={() => setIndex((index + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-white/80 hover:bg-[#2f9ea0] hover:text-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
      >
        <MdNavigateNext size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((slide, i) => (
          <div
            key={slide.maTrinhChieu}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm ${
              i === index ? "w-6 bg-[#2f9ea0]" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}