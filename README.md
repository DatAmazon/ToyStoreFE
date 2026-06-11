  💻 Technical Implementation (Chi tiết kỹ thuật)

  Dự án tập trung vào việc xây dựng một hệ thống Frontend có khả năng mở rộng, quản lý state phức tạp và tối ưu hóa luồng dữ liệu giữa Client - Server.

  1. Kiến trúc hệ thống & Quản lý State
   * Core Stack: React 18 + TypeScript + Vite. Sử dụng TypeScript để định nghĩa chặt chẽ các Interfaces cho Model (Product, Order, User), giảm thiểu lỗi ép kiểu và tăng tốc độ phát triển.
   * State Management: Sử dụng React Context API để quản lý Global State (Cart, Authentication, Toast). 
       * Cart Logic: Implement logic đồng bộ 2 chiều (LocalStorage <-> Server API). Giỏ hàng được khởi tạo từ LocalStorage để đảm bảo tốc độ load trang, sau đó sẽ re-validate với Server sau khi người dùng Login.
   * Routing: React Router v7 với cơ chế phân quyền (Private Routes) để bảo vệ các tài nguyên phía Admin, ngăn chặn truy cập trái phép từ phía Client.

  2. Xử lý API & Data Flow
   * Axios Base: Đóng gói các API call vào thư mục src/api/ để quản lý tập trung. 
   * Admin Dashboard: Tích hợp Recharts để xử lý dữ liệu thô từ API và mapping thành các biểu đồ doanh thu/đơn hàng. Logic xử lý dữ liệu được tách rời khỏi UI component để đảm bảo tính Single Responsibility.
   * UI Component Architecture: Áp dụng mô hình Atomic Design thu nhỏ. Các thành phần UI cơ bản (Button, Modal, Input) được viết dưới dạng Generic Components trong thư mục src/components/ui/, giúp tái sử dụng cho cả
     giao diện Shop và Admin Dashboard.

  3. Tối ưu hóa & UX
   * Form Handling: Sử dụng uncontrolled/controlled components linh hoạt tùy theo độ phức tạp của form (ví dụ: Product Modal dùng để Create/Update sản phẩm).
   * Optimistic UI: Trong phần cập nhật giỏ hàng, hệ thống ưu tiên cập nhật UI trước (tăng/giảm số lượng) và thực hiện API call ngầm để tạo trải nghiệm "zero-latency" cho người dùng.
   * Styling: Tailwind CSS kết hợp với tailwind-merge và clsx để quản lý các class động, giúp code CSS sạch và dễ bảo trì.

  ---

  🚀 Hướng dẫn chạy dự án (Getting Started)

  1. Yêu cầu hệ thống
   * Node.js (phiên bản 18.x trở lên)
   * npm hoặc yarn

  2. Cài đặt
   1. Clone project:
    git clone https://github.com/your-username/ToyStoreManagementFE.git
    cd ToyStoreManagementFE

   3. Cài đặt dependencies:
    npm install
    
   4. Cấu hình môi trường: Tạo file .env ở thư mục gốc và cấu hình API URL (nếu có):
    VITE_API_BASE_URL=http://your-api-url.com

  3. Chạy dự án
   * Chế độ phát triển (Development):
     npm run dev
     Mở trình duyệt tại: http://localhost:5173

   * Build sản phẩm (Production):
     npm run build
