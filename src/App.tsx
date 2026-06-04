import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import Index from './pages/Index';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ Shop */}
        <Route path="/" element={<Index />} />
        
        {/* Trang Dashboard Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Trang Quản lý Sản phẩm */}
        <Route path="/admin/products" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
