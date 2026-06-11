## Frontend Implementation

### Technologies

* React 18
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* Recharts
* Context API

---

## Architecture

### State Management

Sử dụng React Context API để quản lý các state dùng chung trong toàn bộ ứng dụng:

* Authentication Context
* Cart Context
* Toast Notification Context

Giỏ hàng được lưu trong LocalStorage để duy trì dữ liệu khi tải lại trang. Sau khi người dùng đăng nhập, dữ liệu giỏ hàng được đồng bộ với server.

### Routing

Sử dụng React Router để quản lý điều hướng giữa các trang.

Các trang quản trị được bảo vệ bằng cơ chế Private Route, yêu cầu người dùng đăng nhập và có quyền phù hợp trước khi truy cập.

---

## API Integration

Các API được tách riêng trong thư mục `src/api` để dễ bảo trì và tái sử dụng.

```text
src
├── api
│   ├── authApi.ts
│   ├── productApi.ts
│   ├── orderApi.ts
│   └── userApi.ts
```

Axios được cấu hình tập trung để:

* Thiết lập Base URL
* Tự động gắn Access Token
* Xử lý lỗi từ API
* Refresh Token khi cần

---

## UI Components

Các thành phần giao diện được tách thành các component tái sử dụng:

```text
src
├── components
│   ├── ui
│   │   ├── Button
│   │   ├── Input
│   │   ├── Modal
│   │   └── Pagination
```

Điều này giúp giảm lặp code và đảm bảo giao diện nhất quán giữa các màn hình.

---

## Dashboard

Trang quản trị sử dụng Recharts để hiển thị:

* Doanh thu theo thời gian
* Số lượng đơn hàng
* Thống kê sản phẩm

Dữ liệu được xử lý trước khi truyền vào biểu đồ để tách biệt logic và giao diện.

---

## User Experience

### Shopping Cart

Khi người dùng thay đổi số lượng sản phẩm trong giỏ hàng:

1. Giao diện được cập nhật ngay lập tức.
2. API được gọi ở nền để lưu dữ liệu.
3. Nếu xảy ra lỗi, trạng thái sẽ được đồng bộ lại từ server.

### Form Handling

Sử dụng TypeScript để kiểm soát dữ liệu đầu vào và giảm lỗi trong quá trình nhập liệu.

### Styling

Tailwind CSS được sử dụng để xây dựng giao diện.

Kết hợp với:

* clsx
* tailwind-merge

để quản lý class động và tránh trùng lặp CSS.

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm hoặc yarn

### Installation

Clone repository:

```bash
git clone https://github.com/your-username/ToyStoreManagementFE.git

cd ToyStoreManagementFE
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại:

```text
http://localhost:5173
```

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```
