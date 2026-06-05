import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import Index from './pages/Index';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './api/CartContext';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <Routes>
            {/* Trang chủ Shop */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Trang Dashboard Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Trang Quản lý Sản phẩm */}
            <Route path="/admin/products" element={<ProductManagement />} />

            {/* Trang Quản lý Danh mục */}
            <Route path="/admin/categories" element={<CategoryManagement />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
