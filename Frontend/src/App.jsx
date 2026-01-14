import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./components/user/ui/ProtectedRoute";

import {
  Product,
  Category,
  CategoryRecover,
  Brand,
  BrandRecover,
  Contact,
  AddProduct,
  ProductDetail,
  WebInfo,
  WebInfoRecover,
  User,
  UserRecover,
} from "./pages/Admin";

import {
  Home,
  UserProduct,
  About,
  Cart,
  Checkout,
  Details,
  LienHe,
  Login,
  Profile,
  Register,
  WishList,
  CategoryProduct,
  BrandProduct,
  NotFound,
} from "./pages/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- USER ROUTES ---------- */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham" element={<UserProduct />} />
          <Route path="/chi-tiet-san-pham/:slug" element={<Details />} />
          <Route path="/san-pham/danh-muc/:id" element={<CategoryProduct />} />
          <Route path="/san-pham/thuong-hieu/:id" element={<BrandProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<LienHe />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/thong-tin-ca-nhan" element={<Profile />} />
          <Route path="/yeu-thich" element={<WishList />} />
        </Route>

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quan-ly" element={<AdminLayout />}>
            <Route index element={<Product />} /> {/* /quan-ly */}
            <Route path="san-pham" element={<Product />} />
            <Route path="san-pham/them-san-pham" element={<AddProduct />} />
            <Route path="san-pham/:maSanPham" element={<ProductDetail />} />

            <Route path="danh-muc" element={<Category />} />
            <Route path="danh-muc/khoi-phuc" element={<CategoryRecover />} />

            <Route path="thuong-hieu" element={<Brand />} />
            <Route path="thuong-hieu/khoi-phuc" element={<BrandRecover />} />

            <Route path="lien-he" element={<Contact />} />

            <Route path="thong-tin-trang" element={<WebInfo />} />
            <Route
              path="thong-tin-trang/khoi-phuc"
              element={<WebInfoRecover />}
            />

            <Route path="nguoi-dung" element={<User />} />
            <Route path="nguoi-dung/khoi-phuc" element={<UserRecover />} />
          </Route>
        </Route>

        {/* ---------- NOT FOUND ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
