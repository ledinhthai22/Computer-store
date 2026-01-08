import { useState,useEffect } from "react";
import ProductCard from "./ProductCard";

export default function Suggestion(){
    const [products,setProducts]=useState([]);
    useEffect(()=>{
        fetch(`https://dummyjson.com/products`)
        .then(res=>res.json())
        .then(data => setProducts(data.products));
    },[])
    return(
        <div className=" scale-99 rounded-2xl bg-stone-50 ">
            <div className="flex items-center justify-between w-full p-4 px-6">
                <h1 className="text-3xl font-bold text-[#2f9ea0] mx-auto">Sản phẩm gợi ý hôm nay</h1>
            </div>
            <div className="grid border-t-2 border-[#2f9ea0] lg:grid-cols-5">   
            {products.map((product)=>(
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
    )
}