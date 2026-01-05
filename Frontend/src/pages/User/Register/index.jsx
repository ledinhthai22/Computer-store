import {Link} from "react-router-dom"
export default function Register(){
    return(
        <div>
            <div className="flex m-8">
                <div>
                    <img className="p-30 w-3xl" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s" alt="Login"/>
                </div>
                <div className="">
                    <h2 className="text-3xl font-bold text-[#2f9ea0]">ĐĂNG KÝ TÀI KHOẢN</h2>
                    <h4 className="mt-2 text-stone-400">Điền đầy đủ các thông tin để đăng ký</h4>
                    <p className="mt-4">Họ và tên</p>
                    <input className="p-2 mt-2 border-2 rounded-xl w-140 border-stone-300" placeholder="Họ và tên"/>
                    <p className="mt-4">Email: </p>
                    <input className="p-2 mt-2 border-2 rounded-xl w-140 border-stone-300" placeholder="Example@gmail.com"/>
                    <p className="mt-4">Mật khẩu: </p>
                    <input className="p-2 mt-2 border-2 w-140 rounded-xl border-stone-300" placeholder="Nhập mật khẩu của bạn"/><br/>
                    <p className="mt-4">Xác nhận mật khẩu</p>
                    <input className="p-2 mt-2 border-2 w-140 rounded-xl border-stone-300" placeholder="Xác nhận mật khẩu"/><br/>
                    <button className="mt-8 p-3 w-40 text-stone-50 rounded-xl bg-[#2f9ea0] hover:bg-blue-600">ĐĂNG KÝ</button>
                    <p className="mt-2 text-stone-400">Bạn đã có tài khoản?<Link className="text-[#2f9ea0]" to={`/login`}> ĐĂNG NHẬP</Link></p>
                </div>
            </div>
        </div>
    )
}