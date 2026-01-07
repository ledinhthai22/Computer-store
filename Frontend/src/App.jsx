import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import {Product, Category, CategoryRecover, Brand, BrandRecover} from './pages/Admin'
import {Home,UserProduct,About,Cart,Checkout,Details,LienHe,Login,NotFound,Profile,Register,WishList,CategoryProduct,BrandProduct} from './pages/User'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Khách hàng vãng lai ROUTE --- */}


        {/* --- Khách hàng thành viên ROUTES --- */}
        <Route element={<UserLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<UserProduct />} />
          <Route path="/products/:id" element={<Details />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<LienHe />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/products/category/:id" element={<CategoryProduct />} />
          <Route path="/products/brand/:id" element={<BrandProduct />} />    
        </Route>

        {/* --- Quản lý ROUTES --- */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<AdminLayout />}>
            <Route path="/quan-ly"/>
            <Route path="/quan-ly/san-pham" element={<Product />} />
            <Route path="/quan-ly/danh-muc" element={<Category />} />
            <Route path="/quan-ly/danh-muc/khoi-phuc" element={<CategoryRecover />} />
            <Route path="/quan-ly/thuong-hieu" element={<Brand />} />
            <Route path="/quan-ly/thuong-hieu/khoi-phuc" element={<BrandRecover />} />
          </Route>
        {/* </Route> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
