import { useState, useEffect } from "react";
import axiosClient from "../../../services/api/axiosClient";
import ProductCard from "./ProductCard"; 

export default function Suggestion() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosClient.get('/products?limit=100');
                
                const actualData = res.data && Array.isArray(res.data.items) ? res.data.items : [];

                setProducts(actualData.slice(0, 10)); 
            } catch (error) {
                console.error("Lỗi fetch sản phẩm gợi ý:", error);
            }
        };
        fetchProducts();
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="w-full rounded-2xl bg-stone-50 p-6 shadow-sm border border-stone-100">
            <div className="flex items-center justify-center mb-8">
                <div className="relative">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#2f9ea0] uppercase tracking-tight text-center relative z-10 px-4 bg-stone-50">
                        Sản phẩm gợi ý hôm nay
                    </h1>
                    <div className="absolute w-full h-[2px] bg-gray-200 top-1/2 left-0 -z-0"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">   
                {products.map((product) => (
                    <ProductCard key={product.maSanPham} product={product} />
                ))}
            </div>
        </div>
    );
}