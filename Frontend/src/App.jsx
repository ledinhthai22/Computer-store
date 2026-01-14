import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import {Product, Category, CategoryRecover, Brand, BrandRecover, Contact, AddProduct, UpdateProduct, ProductDetail,
  WebInfo, WebInfoRecover, User, UserRecover
} from './pages/Admin'
import {Home,UserProduct,About,Cart,Checkout,Details,LienHe,Login,NotFound,Profile,Register,
  WishList,CategoryProduct,BrandProduct} from './pages/User'
import ProtectedRoute from './components/user/ui/ProtectedRoute'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Khách hàng vãng lai ROUTE --- */}


        {/* --- Khách hàng thành viên ROUTES --- */}
        <Route element={<UserLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham" element={<UserProduct />} />
          <Route path="/chi-tiet-san-pham/:slug" element={<Details />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<LienHe />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/thong-tin-ca-nhan" element={<Profile />} />
          <Route path="/yeu-thich" element={<WishList />} />
          <Route path="/san-pham/danh-muc/:id" element={<CategoryProduct />} />
          <Route path="/san-pham/thuong-hieu/:id" element={<BrandProduct />} />    
        </Route>

        {/* --- Quản lý ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/quan-ly"/>
            <Route path="/quan-ly/san-pham" element={<Product />} />
            <Route path="/quan-ly/san-pham/:maSanPham" element={<ProductDetail />} />
            <Route path="/quan-ly/san-pham/them-san-pham" element={<AddProduct />} />
            <Route path="/quan-ly/san-pham/cap-nhat-san-pham/:maSanPham" element={<UpdateProduct />} />

            <Route path="/quan-ly/danh-muc" element={<Category />} />
            <Route path="/quan-ly/danh-muc/khoi-phuc" element={<CategoryRecover />} />

            <Route path="/quan-ly/thuong-hieu" element={<Brand />} />
            <Route path="/quan-ly/thuong-hieu/khoi-phuc" element={<BrandRecover />} />

            <Route path="/quan-ly/lien-he" element={<Contact />} />

            <Route path="/quan-ly/thong-tin-trang" element={<WebInfo />} />
            <Route path="/quan-ly/thong-tin-trang/khoi-phuc" element={<WebInfoRecover />} />

            <Route path="/quan-ly/nguoi-dung" element={<User />} />
            <Route path="/quan-ly/nguoi-dung/khoi-phuc" element={<UserRecover />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
