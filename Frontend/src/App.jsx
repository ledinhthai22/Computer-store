import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ProfileLayout from "./layouts/ProfileLayout";
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
  Order,
  Dashboard
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
  UpdatePassword,
  PriceProduct,
  ChipProduct,
  ScreenProduct,
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
          <Route path="/san-pham/danh-muc/:maDanhMuc" element={<CategoryProduct />} />
          <Route path="/san-pham/thuong-hieu/:maThuongHieu" element={<BrandProduct />} />
          <Route path="/san-pham/dong-chip/:slug" element={<ChipProduct />} />
          <Route path="/san-pham/man-hinh/:slug" element={<ScreenProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/gui-lien-he" element={<LienHe />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} /> */}
          <Route path="/yeu-thich" element={<WishList />} />
          <Route path="/san-pham/loc-theo-gia" element={<PriceProduct />} />
          <Route element={<ProfileLayout/>}>
            <Route path="/thong-tin-ca-nhan" element={<Profile />} />
            <Route path="/doi-mat-khau" element={<UpdatePassword />} />
          </Route>
        </Route>

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quan-ly" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="thong-ke" element={<Dashboard />} />
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
            <Route path="don-hang" element={<Order />} />
          </Route>
        </Route>

        {/* ---------- NOT FOUND ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
