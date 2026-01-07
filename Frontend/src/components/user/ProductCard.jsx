import React from "react";
import { Link } from "react-router-dom";
import Wishlist from "../user/Wishlist";

export default function ProductCard({ product }) {

    return (
        <div className="relative m-2 group">
            <div className="absolute top-2 right-2 z-10">
                <Wishlist productId={product.id} />
            </div>

            <div className="bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:border-[#2f9ea0] transition duration-300 flex flex-col h-full overflow-hidden">
                <Link to={`/products/${product.id}`} className="block relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center p-4">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {product.brand || "Computer Store"}
                    </span>
                    <Link to={`/products/${product.id}`}>
                        <h2 className="font-bold text-gray-800 line-clamp-2 text-sm mb-2 hover:text-[#2f9ea0] transition-colors" title={product.title}>
                            {product.title}
                        </h2>
                    </Link>
                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <span className="text-red-600 font-bold text-lg">${product.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}