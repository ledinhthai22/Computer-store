import {Link, useNavigate} from "react-router-dom"
import { useAuth } from "../../../contexts/AuthProvider";
import { useState } from "react";

export default function Login(){
    const { login } = useAuth();  
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password || username.trim() === "") {
      setErrorMessage("Vui lòng nhập Tên người dùng và Mật khẩu.");
      return;
    }

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate("/");
      }else {
        setErrorMessage(result.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối mạng. Vui lòng kiểm tra console.");
    }
  };
    return(
        <div>
              <div className="flex m-8">
                  <div>
                      <img className="p-30 w-3xl" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s" alt="Login"/>
                  </div>
                  <div className="">
                      <h2 className="text-3xl font-bold text-[#2f9ea0]">CHÀO MỪNG TRỞ LẠI !</h2>
                      <h4 className="mt-2 text-stone-400">Đăng nhập để tiếp tục</h4>
                      {errorMessage && (
                          <p className="mt-4 font-medium text-red-600">{errorMessage}</p>
                      )}
                      <form onSubmit={handleSubmit}>
                      <p className="mt-4">Nhập Email:</p>
                      <input type="text" name="username" className="p-2 mt-2 border-2 rounded-xl w-140 border-stone-300" placeholder="Hãy nhập email"/>
                      <p className="mt-4">Mật Khẩu:</p>
                      <input type="password" name="password" className="p-2 mt-2 border-2 w-140 rounded-xl border-stone-300" placeholder="Hãy nhập mật khẩu"/><br/>
                      <Link className="text-stone-400" to={`/forgetpassword`}>Quên mật khẩu?</Link><br/>
                      <button type="submit" className="btn mt-8 p-3 w-40 text-stone-50 rounded-xl bg-[#2f9ea0] hover:bg-blue-600">ĐĂNG NHẬP</button>
                      </form>
                      <p className="mt-2 text-stone-400">Bạn là người mới ?<Link className="text-[#2f9ea0]" to={`/register`}> ĐĂNG KÝ NGAY</Link></p>
                  </div>
              </div>
        </div>
    )
}