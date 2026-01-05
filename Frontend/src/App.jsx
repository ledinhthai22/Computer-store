import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Product from './pages/Admin/Product'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Khách hàng vãng lai ROUTE --- */}


        {/* --- Khách hàng thành viên ROUTES --- */}


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
