 > Quy ước chung:
  >    Các API đánh dấu [Auth]* yêu cầu truyền Header: Authorization: Bearer
  <your_jwt_token>.
  > *   {id} hoặc {productId} trong URL là các giá trị UUID (GUID), ví dụ:
  123e4567-e89b-12d3-a456-426614174000.

  ---

  PHẦN 1: API KHÁCH HÀNG & MUA SẮM

  1. Tìm kiếm & Lọc Sản phẩm nâng cao (Mới)
   * Endpoint: /api/Sales/search
   * Method: GET
   * Auth: Không yêu cầu
   * Tham số truyền trên URL (Query Parameters): Truyền tùy ý, không bắt buộc
     phải có tất cả.
       * keyword (string): Tìm theo tên sản phẩm.
       * categoryId (guid): Lọc theo ID danh mục.
       * minPrice (decimal): Giá tối thiểu.
       * maxPrice (decimal): Giá tối đa.
       * minAge (int): Tìm đồ chơi cho độ tuổi từ minAge trở lên.
       * sortBy (string): Sắp xếp. Hỗ trợ các giá trị: "price_asc", "price_desc",
         "newest" (mặc định).
   * Ví dụ gọi: /api/Sales/search?keyword=lego&minPrice=100000&sortBy=price_asc

  2. Đặt hàng (Checkout) - Có hỗ trợ Mã giảm giá
   * Endpoint: /api/Sales/checkout
   * Method: POST
   * Auth: Tùy chọn (Khách vãng lai truyền null, khách đăng nhập thì truyền ID
     hoặc để BE tự lấy từ Token).
   * Body (JSON):

    1 {
    2   "customerId": null,
    3   "customerName": "Nguyễn Văn A",
    4   "customerPhone": "0901234567",
    5   "shippingAddress": "123 Đường XYZ, TP.HCM",
    6   "discountCode": "SUMMER2026",  // Truyền mã giảm giá vào đây (nếu không
      có thì để null hoặc "")
    7   "items": [
    8     { "productId": "guid-1", "quantity": 2 },
    9     { "productId": "guid-2", "quantity": 1 }
   10   ]
   11 }

  3. Hồ sơ cá nhân (Profile)
  A. Lấy thông tin cá nhân
   * Endpoint: /api/Profile
   * Method: GET
   * Auth: [Auth]
   * Response: Trả về FullName, Email, PhoneNumber, Address. Tiện lợi để FE tự
     điền (Auto-fill) vào form Checkout.

  B. Cập nhật thông tin cá nhân
   * Endpoint: /api/Profile
   * Method: PUT
   * Auth: [Auth]
   * Body (JSON):

   1 {
   2   "fullName": "Nguyễn Văn A Mới",
   3   "phoneNumber": "0988888888",
   4   "address": "456 Đường ABC, Hà Nội"
   5 }

  4. Danh sách Yêu thích (Wishlist)
   * Thêm vào Yêu thích: POST /api/Wishlist/add/{productId} [Auth] (Body rỗng)
   * Xóa khỏi Yêu thích: DELETE /api/Wishlist/remove/{productId} [Auth]
   * Lấy danh sách đã lưu: GET /api/Wishlist [Auth] (Trả về list ProductDto).
   * Kiểm tra xem SP đã thả tim chưa (Để đổi màu icon tim): GET
     /api/Wishlist/check/{productId} [Auth] -> Trả về JSON: { "isInWishlist":
     true/false }

  5. Đánh giá Sản phẩm (Reviews)
  A. Lấy danh sách đánh giá của 1 sản phẩm
   * Endpoint: /api/ProductReviews/product/{productId}
   * Method: GET
   * Auth: Không yêu cầu
   * Response: Trả về danh sách các review và điểm trung bình (AverageRating).

  B. Gửi đánh giá mới
   * Endpoint: /api/ProductReviews/add
   * Method: POST
   * Auth: [Auth]
   * Body (JSON): (Không cần truyền CustomerId hay CustomerName, Backend sẽ tự
     lấy từ Token).

   1 {
   2   "productId": "guid-san-pham",
   3   "rating": 5,           // Bắt buộc từ 1 đến 5
   4   "comment": "Đồ chơi rất đẹp, bé nhà mình rất thích!" // Tùy chọn
   5 }

  ---

  PHẦN 2: API QUẢN TRỊ (ADMIN)
  (Tất cả API dưới đây đều yêu cầu Header: Authorization: Bearer
  <token_cua_admin>)

  6. Bảng điều khiển (Dashboard Statistics)
   * Endpoint: /api/admin/Dashboard/statistics
   * Method: GET
   * Mô tả: Dùng để vẽ biểu đồ và hiển thị thẻ tổng quan ở trang chủ Admin.
   * Response (JSON):

   1 {
   2   "todayRevenue": 1500000,
   3   "newOrders": 5,
   4   "totalCustomers": 120,
   5   "lowStockAlerts": [
   6     { "productId": "guid-1", "name": "Lego City", "stockQuantity": 2 }
   7   ]
   8 }

  7. Quản lý trạng thái Đơn hàng
  A. Lấy toàn bộ đơn hàng của cửa hàng
   * Endpoint: /api/admin/orders
   * Method: GET
   * Response: List các đơn hàng xếp theo thứ tự mới nhất.

  B. Cập nhật trạng thái đơn hàng
   * Endpoint: /api/admin/orders/{id}/status
   * Method: PUT
   * Body (RAW chuỗi, CÓ DẤU NGOẶC KÉP): "Confirmed" hoặc "Shipping" hoặc
     "Delivered" hoặc "Cancelled" hoặc "Completed".
   * Lưu ý FE: Body gửi lên chỉ là một chuỗi (String) có bọc trong ngoặc kép,
     không phải object.
   * Ví dụ Body: "Shipping"

  8. Xuất báo cáo Tồn kho (Export Reports)
  Khi FE gọi các API này, Backend sẽ trả về luồng dữ liệu nhị phân (Binary File).
  FE cần thiết lập responseType: 'blob' (nếu dùng Axios) để tải file xuống.
   * Xuất Excel: GET /api/admin/Reports/inventory/excel
   * Xuất PDF: GET /api/admin/Reports/inventory/pdf

  9. Nhật ký hệ thống (Audit Logs)
   * Endpoint: /api/admin/audit-logs?count=50
   * Method: GET
   * Mô tả: Trả về lịch sử ai vừa thêm/sửa/xóa bảng dữ liệu nào, lúc mấy giờ. Mặc
     định trả về 50 dòng mới nhất.