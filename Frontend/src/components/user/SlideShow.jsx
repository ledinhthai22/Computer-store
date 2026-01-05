import { useState, useEffect } from "react";
import { MdNavigateNext,MdNavigateBefore } from "react-icons/md";
import {Link} from "react-router-dom";
export default function Slideshow() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`https://dummyjson.com/products?limit=10`)
      .then(res => res.json())
      .then(data => {
        const newestProducts = data.products
          .sort(
            (a, b) =>
              new Date(b.meta.createdAt) - new Date(a.meta.createdAt)
          )
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
    return <p className="py-10 text-center">Loading...</p>;

  return (
    <div className="relative w-full max-w-full mx-auto mt-2 overflow-hidden shadow h-120 rounded-2xl scale-99 bg-stone-100">
      <Link to={`/products/${products[index].id}`}>
        <img
            src={products[index].thumbnail}
            alt={products[index].title}
            className="items-center object-cover mx-auto w-100 h-100"/>
      </Link>
      <button
        onClick={() => setIndex((index - 1 + products.length) % products.length)}
        className="absolute px-4 py-4 -translate-y-1/2 rounded top-1/2 left-4 bg-stone-300 hover:bg-stone-500">
        <MdNavigateBefore />
      </button>
      <button
        onClick={() => setIndex((index + 1) % products.length)}
        className="absolute px-4 py-4 -translate-y-1/2 rounded top-1/2 right-4 bg-stone-300 hover:bg-stone-500">
        <MdNavigateNext />
      </button>
      <div className="absolute flex justify-center w-full gap-2 bottom-4">
        {products.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === index ? "bg-stone-500" : "bg-stone-300"}`}></div>
        ))}
      </div>
    </div>
  );
}
