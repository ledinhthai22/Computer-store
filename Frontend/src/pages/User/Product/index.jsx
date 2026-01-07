import { useState, useEffect } from "react";
import ProductCard from "../../../components/user/ProductCard";
import UserPagination from "../../../components/user/UserPagination";

export default function UserProduct() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 40;

    useEffect(() => {
        fetch("https://dummyjson.com/products?limit=1000")
            .then(res => res.json())
            .then(data => setProducts(data.products));
    }, []);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(
        startIndex,
        startIndex + productsPerPage
    );

    return (
        <div className="p-6 max-w-[80%] mx-auto">
            <div className="flex items-center justify-between w-full p-4 px-6">
                <h1 className="text-3xl font-bold text-[#2f9ea0] mx-auto">
                    Danh sách sản phẩm
                </h1>
            </div>

            <div className="grid border-t-2 border-[#2f9ea0] lg:grid-cols-5">
                {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
