import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Slideshow() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`https://dummyjson.com/products?limit=10`)
      .then(res => res.json())
      .then(data => {
        const newestProducts = data.products
          .sort((a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt))
          .slice(0, 5);
        setProducts(newestProducts);
      });
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [products]);

  if (products.length === 0)
    return <div className="w-full h-[400px] flex items-center justify-center bg-stone-50 rounded-2xl animate-pulse">Loading...</div>;

  return (
    <div className="relative w-full mx-auto overflow-hidden shadow-sm h-[350px] lg:h-[450px] rounded-2xl bg-white group border border-stone-100">
      <Link to={`/products/${products[index].id}`} className="block w-full h-full">
        <img
            src={products[index].thumbnail}
            alt={products[index].title}
            className="w-full h-full object-contain bg-stone-50"
        />
      </Link>
      
      {/* Nút nằm giữa ảnh */}
      <button
        onClick={() => setIndex((index - 1 + products.length) % products.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-white/80 hover:bg-[#2f9ea0] hover:text-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
      >
        <MdNavigateBefore size={24} />
      </button>
      
      <button
        onClick={() => setIndex((index + 1) % products.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center cursor-pointer justify-center rounded-full bg-white/80 hover:bg-[#2f9ea0] hover:text-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
      >
        <MdNavigateNext size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {products.map((_, i) => (
          <div
            key={i}
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