import { useState, useEffect, use } from "react";
import { Link, useParams } from "react-router-dom";
import useAddToCart from "../../../hooks/useAddToCart";
export default function Details() {
  const [product, setProduct] = useState(null);
  const {handleAddToCart} = useAddToCart(product);
  const [ram, setRam] = useState("8GB");
  const [rom, setRom] = useState("128GB");
  const { id } = useParams();
  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-[80%] mx-auto shadow rounded-2xl bg-white scale-99">
      <div className="flex gap-6">
         <div>
              <div className="border rounded-lg p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-80 object-contain"
                />
              </div>

              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map(i => (
                  <img
                    key={i}
                    src={product.thumbnail}
                    alt=""
                    className="w-20 h-20 border rounded object-cover cursor-pointer hover:border-[#2f9ea0]"
                  />
                ))}
              </div>
          </div>
        <div className="w-1/2">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <h1 className="text-2xl mb-4">Giá: {product.price}$</h1>
          <div className="mb-4">
            <p className="font-semibold mb-2">RAM</p>
            <div className="flex gap-2">
                {["8GB", "12GB", "16GB"].map(item => (
                <button key={item} onClick={() => setRam(item)} className={`px-3 py-1 border rounded transition-colors
                    ${ram === item ? "bg-[#2f9ea0] text-white" : ""}`}>{item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-2">ROM</p>
            <div className="flex gap-2">
              {["128GB", "256GB", "512GB"].map(item => (
                <button key={item} onClick={() => setRom(item)} className={`px-3 py-1 border rounded transition-colors
                    ${rom === item ? "bg-[#2f9ea0] text-white" : ""}`}> {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex text-center">
          <button onClick={handleAddToCart} className="bg-[#2f9ea0] p-2 w-40 rounded mt-4 text-white hover:bg-blue-600 transition-colors">Thêm vào giỏ hàng</button>
          <Link to={`/checkout`} className="bg-[#2f9ea0] p-2 hover:bg-blue-600 text-white rounded w-40 mt-4 ml-2 transition-colors">Mua ngay</Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Thông số sản phẩm</h2>

        <table className="w-full border">
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-semibold">Thương hiệu</td>
              <td className="p-2">{product.brand}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold">Danh mục</td>
              <td className="p-2">{product.category}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold">Đánh giá</td>
              <td className="p-2">{product.rating} ⭐</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Mô tả</td>
              <td className="p-2">{product.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
