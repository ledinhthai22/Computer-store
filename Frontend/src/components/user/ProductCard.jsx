import React from "react";
import { Link } from "react-router-dom";
import Wishlist from "../user/Wishlist";

export default function ProductCard({ product }) {
    return (
        <div className="relative m-2">
            <Wishlist productId={product.id} />

            <Link to={`/products/${product.id}`}>
                <div title={product.title} className="p-6 cursor-pointer transition  hover:border hover:border-[#2f9ea0] hover:shadow-sm">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover mb-2"/>
                    <h2 className="font-bold text-black line-clamp-2 text-sm">{product.title}</h2>
                    <p className="text-red-600 font-semibold">${product.price}</p>
                </div>
            </Link>
        </div>
    );
}
