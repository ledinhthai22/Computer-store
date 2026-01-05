import { Link } from "react-router-dom";
import { FaFacebook,FaYoutube,FaInstagramSquare,FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
export default function Footer(){
    return(
        <footer>
            <div className="max-w-[85%] mx-auto mt-5 ">
                <div className="flex justify-center">
                    {/* <div className="m-2">   
                        <h3 className="font-bold">Đăng ký nhận khuyến mãi</h3>
                        <p>Email: </p>
                        <input className="p-2 w-60 border-1 rounded" type="email" placeholder="Nhập email của bạn" /> <br/>
                        <p>Số điện thoại: </p>
                        <input className="p-2 w-60 border-1 rounded" type="text" placeholder="Nhập số điện thoại của bạn" /><br/>
                        <button className="bg-[#2f9ea0] p-2 w-60 rounded mt-4 text-white hover:bg-blue-600">Đăng ký</button>
                    </div> */}
                    <div className="m-2">
                        <h3 className="font-bold">Danh Mục</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div className="m-2">
                        <h3 className="font-bold">Thông tin về chính sách</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div className="m-2">
                        <h3 className="font-bold">Dịch vụ và thông tin khác</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div className="m-1">
                        <h3 className="font-bold">Thông tin kết nối</h3>
                        <div className="flex m-2">
                            <Link title="Facebook" className="mr-2 hover:text-blue-500" to={`/`}><FaFacebook className="size-8" /></Link>
                            <Link title="Youtube" className="mr-2 hover:text-red-500" to={`/`}><FaYoutube className="size-8" /></Link>
                            <Link title="Instagram" className="mr-2 hover:text-stone-500" to={`/`}><FaInstagramSquare className="size-8" /></Link>
                            <Link title="TikTok" className="mr-2 hover:text-stone-500" to={`/`}><FaTiktok className="size-8" /></Link>
                            <Link title="Zalo" className="mr-2 hover:text-blue-500" to={`/`}><SiZalo className="size-8" /></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center w-[70%] mx-auto text-sm text-stone-600 mb-5">
                <p>Công ty TNHH Thương Mại và Dịch Vụ Kỹ Thuật DIỆU PHÚC - GPĐKKD: 0316172372 cấp tại Sở KH & ĐT TP. HCM. Địa chỉ văn phòng: 350-352 Võ Văn Kiệt,
             Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh, Việt Nam. Điện thoại: 028.7108.9666.</p>
                <div className="flex justify-center mt-2">
                <img src="https://cdn2.cellphones.com.vn/80x,webp/media/logo/logoSaleNoti.png" alt="bocongthuong"/>
                <img src="https://images.dmca.com/Badges/dmca_copyright_protected150c.png?ID=158f5667-cce3-4a18-b2d1-826225e6b022" alt="bocongthuong"/>
                </div>
            </div>
        </footer>
    );
}