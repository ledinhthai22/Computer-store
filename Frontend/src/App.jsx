import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import Product from './pages/Admin/Product'
import {Home,UserProduct,About,Cart,Checkout,Details,LienHe,Login,NotFound,Profile,Register,WishList} from './pages/User'
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
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* --- Quản lý ROUTES --- */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route element={<AdminLayout />}>
            <Route path="/admin"/>
            <Route path="/admin/products" element={<Product />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
