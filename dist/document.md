 1. API Sản phẩm (Dành cho trang Bán hàng & Admin)

  1.1. Danh sách & Tìm kiếm sản phẩm
   * Endpoint: GET /api/Sales/search hoặc GET /api/Products
   * Response trả về:

    1 {
    2   "success": true,
    3   "data": [
    4     {
    5       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    6       "name": "Siêu nhân Gao",
    7       "price": 500000.0,          // Giá gốc
    8       "discountPrice": 400000.0,   // Giá thực bán (FE hiện màu đỏ)
    9       "discountPercentage": 20,    // % giảm (FE hiện nhãn -20%)
   10       "stockQuantity": 50,
   11       "imageUrl": "https://...",
   12       "categoryName": "Đồ chơi"
   13     }
   14   ],
   15   "message": "Success"
   16 }

  1.2. Thêm/Cập nhật sản phẩm (Admin)
   * Endpoint: POST /api/Products hoặc PUT /api/Products/{id}
   * Payload gửi lên (Request): Giống hệt cấu trúc trả về ở trên (trừ categoryName).

  ---

  2. API Đặt hàng (Checkout)
   * Endpoint: POST /api/Sales/checkout
   * Payload gửi lên (FE không gửi giá tiền):

   1 {
   2   "customerName": "Nguyễn Văn A",
   3   "customerPhone": "0987654321",
   4   "shippingAddress": "123 Lê Lợi, TP.HCM",
   5   "discountCode": "SUMMER20",
   6   "items": [
   7     { "productId": "guid-id-1", "quantity": 2 }
   8   ]
   9 }
   * Response trả về:

   1 {
   2   "success": true,
   3   "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Trả về ID đơn hàng vừa tạo
   4   "message": "Đặt hàng thành công"
   5 }

  ---

  3. API Quản lý Đơn hàng

  3.1. Danh sách đơn hàng (Admin & Khách hàng)
   * Endpoint Admin: GET /api/admin/orders
   * Endpoint Khách: GET /api/Sales/my-orders
   * Response trả về:

    1 {
    2   "success": true,
    3   "data": [
    4     {
    5       "orderId": "3fa85f64-...",
    6       "customerName": "Nguyễn Văn A",
    7       "customerPhone": "0987654321",
    8       "totalAmount": 1000000.0, // Tổng tiền hàng (trước coupon)
    9       "discount": 100000.0,      // Tiền giảm từ mã coupon
   10       "finalAmount": 900000.0,   // TIỀN KHÁCH PHẢI TRẢ
   11       "status": "Chờ xác nhận",
   12       "orderDate": "2026-06-09T10:00:00Z"
   13     }
   14   ]
   15 }

  3.2. Xem chi tiết 1 đơn hàng
   * Endpoint: GET /api/admin/orders/{id}
   * Response trả về:

    1 {
    2   "success": true,
    3   "data": {
    4     "orderId": "3fa85f64-...",
    5     "customerName": "Nguyễn Văn A",
    6     "shippingAddress": "123 Lê Lợi...",
    7     "totalAmount": 1000000.0,
    8     "discount": 100000.0,
    9     "finalAmount": 900000.0,
   10     "status": "Chờ xác nhận",
   11     "details": [
   12       {
   13         "productName": "Siêu nhân Gao",
   14         "quantity": 2,
   15         "price": 400000.0 // Giá lúc mua (đã tính giá giảm của sp)
   16       }
   17     ]
   18   }
   19 }

  ---

  4. API Thay đổi trạng thái (Admin)
   * Endpoint: PUT /api/admin/orders/{id}/status
   * Payload gửi lên (Dạng chuỗi raw): "Đang giao hàng" hoặc "Đã hủy".
   * Response:

   1 {
   2   "success": true,
   3   "data": null,
   4   "message": "Cập nhật trạng thái đơn hàng thành: Đang giao hàng"
   5 }

  ---

  5. API Xuất báo cáo (File)
   * Hóa đơn PDF: GET /api/admin/Reports/invoice/{id}/pdf
   * Doanh thu Excel: GET /api/SalesReport/excel?fromDate=...&toDate=...
   * Đặc điểm: API này trả về Binary File. FE chỉ cần mở link trong tab mới (window.open) là trình duyệt tự tải file về.