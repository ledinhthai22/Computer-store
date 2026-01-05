export default function LienHe(){
    return(
        <div>
            <div className="max-w-[80%] mx-auto place-items-center-safe m-10">
                <div>
                    <h3 className="font-bold text-2xl text-center mb-2">LIÊN HỆ VỚI CHÚNG TÔI</h3>
                    <h4>Nhập Email:</h4>
                    <input className="p-2 w-80 border rounded mt-2 mb-2" type="text" placeholder="Nhập email"/>
                    <h4>Nhập Số Điện Thoại:</h4>
                    <input className="p-2 w-80 border rounded mt-2 mb-2" type="text" placeholder="Nhập số điện thoại"/>
                    <h4>Nhập Họ Tên:</h4>
                    <input className="p-2 w-80 border rounded mt-2 mb-2" type="text" placeholder="Nhập họ tên"/>
                    <h4>Nhập thông tin cần liên hệ:</h4>
                    <textarea className="border p-2 w-80 rounded h-40 mt-2" placeholder="Nhập thông tin cần liên hệ"/><br/>
                    <button className="bg-[#2f9ea0] p-2 w-80 rounded mt-4 text-white hover:bg-blue-600">Đăng ký</button>
                </div>
            </div>
        </div>
    );
}