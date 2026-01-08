import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function TopNew() {
    const [products, setProducts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_PER_VIEW = 5;
    const TOTAL_ITEMS = 30;

    useEffect(() => {
        fetch(`https://dummyjson.com/products?limit=${TOTAL_ITEMS}`)
            .then(res => res.json())
            .then(data => {
                const newestProducts = data.products
                    .sort(
                        (a, b) =>
                            new Date(b.meta.createdAt) -
                            new Date(a.meta.createdAt)
                    )
                    .slice(0, TOTAL_ITEMS);

                setProducts(newestProducts);
            });
    }, []);

    const visibleProducts = products.slice(
        startIndex,
        startIndex + ITEMS_PER_VIEW
    );

    const handleNext = () => {
        if (startIndex + ITEMS_PER_VIEW < products.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    return (
        <div className="relative mt-1 scale-99 rounded-2xl bg-stone-50">
            <div className="flex items-center justify-between w-full p-4 px-6">
                <h1 className="text-3xl font-bold text-[#2f9ea0] mx-auto">Sản phẩm mới nhất</h1>
            </div>
            <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow bg-white hover:bg-[#2f9ea0] hover:text-white transition ${
                    startIndex === 0 ? "opacity-40 cursor-default" : ""
                }`}
            >
                <MdNavigateBefore size={32} />
            </button>
            <button
                onClick={handleNext}
                disabled={startIndex + ITEMS_PER_VIEW >= products.length}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow bg-white hover:bg-[#2f9ea0] hover:text-white transition ${
                    startIndex + ITEMS_PER_VIEW >= products.length
                        ? "opacity-40 cursor-default"
                        : ""
                }`}
            >
                <MdNavigateNext size={32} />
            </button>
            <div className="relative px-10 overflow-hidden">
                <div className="grid transition-all duration-300 border-t-2 border-[#2f9ea0] lg:grid-cols-5">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
