# KNOWLEDGE BASE: TOY STORE MANAGEMENT FE (Gia Đình Thỏ Xinh)

Bộ câu hỏi và câu trả lời giúp nắm vững toàn bộ kiến trúc, tư duy thiết kế cũng như luồng hoạt động của dự án Front-end.

---

## LUỒNG CHƯƠNG TRÌNH (PROGRAM FLOW)

Dưới đây là sơ đồ luồng chạy chính của ứng dụng từ lúc khởi tạo đến khi hiển thị giao diện:

1.  **Entry Point (HTML) - `index.html`**: 
    - Là file đầu tiên trình duyệt đọc.
    - Chứa thẻ `<div id="root"></div>` nơi ứng dụng React sẽ được "gắn" vào.
    - Gọi file `src/main.tsx` để bắt đầu thực thi code JavaScript.

2.  **Main Entry (TypeScript) - `src/main.tsx`**: 
    - Là điểm vào của mã nguồn TypeScript.
    - Khởi tạo React DOM và render Component gốc là `<App />` vào phần tử `#root` trong HTML.
    - Nạp các file CSS toàn cục (`index.css`).

3.  **App Root & Routing - `src/App.tsx`**: 
    - Đóng vai trò là "Tổng đài điều hướng".
    - Sử dụng `react-router-dom` để định nghĩa các đường dẫn (Routes) như `/`, `/products`, `/admin`, v.v.
    - Bọc toàn bộ ứng dụng trong các **Providers** (`CartProvider`, `ToastProvider`) để quản lý trạng thái giỏ hàng và thông báo toàn cục.

4.  **Pages (Trang giao diện) - `src/pages/`**: 
    - Dựa vào URL trên trình duyệt, Router sẽ quyết định hiển thị trang nào (ví dụ: `Index.tsx` cho trang chủ, `ProductsPage.tsx` cho danh sách sản phẩm).
    - Mỗi trang trong thư mục này sẽ gọi các Components và API tương ứng.

5.  **Components (Thành phần UI) - `src/components/`**: 
    - Các mảnh giao diện nhỏ (Header, Footer, ProductCard, v.v.) được tổ chức trong thư mục này.
    - Được chia thành `shop` (cho khách hàng), `admin` (cho quản trị viên) và `ui` (các thành phần dùng chung).

6.  **Data & State Management - `src/api/` & `src/lib/`**: 
    - `api.ts`: Chứa cấu hình Axios để gọi dữ liệu từ Backend.
    - `CartContext.tsx`: Quản lý logic giỏ hàng (thêm/xóa/sửa sản phẩm) xuyên suốt toàn bộ ứng dụng.
    - `utils.ts`: Chứa các hàm hỗ trợ như định dạng tiền tệ, xử lý class CSS.

---

## PHẦN 1: TỔNG QUAN & KIẾN TRÚC DỰ ÁN (1-10)

**1. Dự án được xây dựng dựa trên công nghệ cốt lõi nào?**
> ReactJS, TypeScript (đảm bảo type-safe), Vite (Build tool siêu tốc), và Tailwind CSS (để thiết kế UI).

**2. Cấu trúc thư mục `src` được tổ chức ra sao?**
> Gồm các thư mục chính: `api` (xử lý gọi mạng và Context), `assets` (ảnh/font), `components` (các mảnh UI dùng lại), `lib` (hàm tiện ích), và `pages` (các trang hiển thị như Home, About, ProductDetail).

**3. Tại sao lại chia thư mục `components/shop` và `components/admin`?**
> Để tách biệt hoàn toàn giao diện dành cho Khách hàng (Shop) và giao diện Quản trị viên (Admin), giúp code dễ bảo trì, không bị lẫn lộn các logic quyền hạn.

**4. Điểm vào (Entry point) của ứng dụng nằm ở đâu?**
> File `main.tsx` render `<App />` vào DOM. File `App.tsx` đóng vai trò là "Tổng đài định tuyến" chứa cấu hình React Router và các Provider (Cart, Toast).

**5. Thư viện icon nào đang được sử dụng?**
> `lucide-react`. Ưu điểm của nó là icon dạng SVG rất nhẹ, dễ đổi màu và kích thước bằng class của Tailwind.

**6. Cú pháp import `@/components/...` có ý nghĩa gì?**
> Đây là Path Alias được cấu hình trong `tsconfig.json` và `vite.config.ts`. `@` đại diện cho thư mục `src`, giúp tránh việc import đường dẫn tương đối rườm rà (vd: `../../components`).

**7. File `tailwind.config.js` trong dự án này có gì đặc biệt?**
> Nó mở rộng `theme` bằng cách định nghĩa các màu thương hiệu (`primary`, `secondary`) dựa trên CSS variables, đồng thời cấu hình các keyframes animation (fade-in, slide-in) để dùng được với directive `@apply`.

**8. Hàm `cn` trong `src/lib/utils.ts` có tác dụng gì?**
> Kết hợp giữa `clsx` và `tailwind-merge` để nối các class Tailwind lại với nhau một cách thông minh, tự động loại bỏ các class bị xung đột (ví dụ truyền `p-4` và `p-2` sẽ lấy cái sau).

**9. File `index.css` chứa những gì?**
> Chứa các directive của Tailwind (`@tailwind base...`), định nghĩa các biến màu sắc (CSS Variables dạng HSL) và các cấu hình CSS toàn cục như `scroll-behavior: smooth`.

**10. Dự án có responsive không? Làm thế nào?**
> Có, dự án responsive theo chuẩn Mobile-first của Tailwind, sử dụng các prefix như `sm:` (tablet), `md:`, `lg:` (desktop) để thay đổi layout (vd: lưới 2 cột trên mobile, 4 cột trên desktop).

---

## PHẦN 2: QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT) (11-20)

**11. Giỏ hàng được quản lý state bằng công nghệ gì?**
> Dùng **React Context API** (`CartContext.tsx`) kết hợp với custom hook `useCart`.

**12. Tại sao không dùng Redux cho dự án này?**
> Vì cấu trúc state của giỏ hàng khá đơn giản, Context API tích hợp sẵn trong React là đủ dùng, giúp project nhẹ và code dễ hiểu hơn thay vì setup Redux cồng kềnh.

**13. Làm sao để hiển thị số lượng trên Icon Giỏ hàng ở Header?**
> Header gọi hook `useCart()`, lấy mảng `cartItems` và dùng hàm `.reduce()` để tính tổng `quantity` của tất cả sản phẩm.

**14. State tìm kiếm trên Trang chủ (`Index.tsx`) hoạt động ra sao?**
> State `searchKeyword` nằm ở `Index.tsx`. Nó được Header cập nhật thông qua prop `onSearch`, sau đó truyền xuống `FeaturedProducts` dưới dạng prop `keyword` để fetch API.

**15. Tại sao các State bộ lọc (Giá, Sắp xếp) ở trang ProductsPage lại được đồng bộ với URL?**
> Thông qua hook `useSearchParams`. Việc này giúp người dùng có thể copy link URL gửi cho người khác mà vẫn giữ nguyên trạng thái bộ lọc (ví dụ: `?minPrice=100k`).

**16. Logic cập nhật số lượng trong `CartDrawer` hoạt động như thế nào?**
> Khi nhấn nút (+) hoặc (-), nó gọi hàm `updateQuantity(id, change)` từ `CartContext`. Nếu số lượng <= 0, (có thể) gọi hàm `removeFromCart`.

**17. Biến `loading` trong các component có tác dụng gì?**
> Được set thành `true` khi bắt đầu gọi API và `false` trong block `finally`. Dùng để hiển thị hiệu ứng xoay (spinner) hoặc Skeleton UI, giúp người dùng biết hệ thống đang xử lý.

**18. `useToast` hoạt động ra sao?**
> Là một Context cung cấp hàm `showToast(message, type)`. Bất kỳ component nào cũng có thể gọi nó để hiển thị thông báo popup ở góc màn hình (vd: "Thêm vào giỏ thành công").

**19. Việc chuyển đổi các bước (Step) trong Giỏ hàng dùng cơ chế nào?**
> Dùng Local State `step` trong `CartDrawer.tsx` với các giá trị: `'cart'` (Giỏ hàng) -> `'checkout'` (Thanh toán) -> `'success'` (Thành công). Dùng điều kiện `if` để render UI tương ứng.

**20. Form điền thông tin thanh toán quản lý dữ liệu bằng cách nào?**
> Dùng một State Object `formData` chứa `{name, phone, address}`. Khi gõ vào input, hàm `handleInputChange` sử dụng cú pháp spread `...prev` để cập nhật đúng trường (name) đó.

---

## PHẦN 3: API & KẾT NỐI BACKEND (21-30)

**21. Dự án gọi API thông qua thư viện nào?**
> Dùng **Axios**, được cấu hình sẵn tại `src/api/api.ts` (thường sẽ gắn baseURL và các interceptor để xử lý token).

**22. API lấy danh sách sản phẩm có định dạng (Endpoint) như thế nào?**
> `GET /api/Products?keyword=...&minPrice=...&maxPrice=...&sortOrder=...&pageNumber=...&pageSize=...`

**23. Tính năng Phân trang (Pagination) do Frontend hay Backend xử lý?**
> **Backend xử lý chính**. Frontend chỉ gửi lên trang cần xem (`pageNumber`) và số lượng (`pageSize`). Backend trả về danh sách của trang đó và `totalCount` (tổng số sản phẩm) để Frontend tính ra tổng số trang (`totalPages = Math.ceil(totalCount / pageSize)`).

**24. Khi gọi API Tìm kiếm, tại sao lại bọc keyword bằng `encodeURIComponent`?**
> Vì từ khóa có thể chứa dấu cách hoặc dấu tiếng Việt (vd: "búp bê"). Nếu không encode, URL có thể bị lỗi cú pháp khi gửi qua HTTP.

**25. Tại sao cần mảng `mappedProducts` sau khi gọi API?**
> Để đảm bảo an toàn dữ liệu. Nếu Backend trả về key bị thiếu hoặc null, Frontend sẽ gán dữ liệu dự phòng (vd: `img: p.imageUrl || defaultImage`) tránh bị crash (lỗi) UI.

**26. Khi lọc sản phẩm bị rỗng, hệ thống xử lý thế nào?**
> Mảng `products` trả về rỗng (`length === 0`). UI sẽ render ra một khối thông báo "Không tìm thấy sản phẩm" kèm nút "Xóa bộ lọc".

**27. Làm sao để xem thông tin Chi tiết một sản phẩm?**
> Ở `ProductDetail.tsx`, lấy `id` trên URL qua hook `useParams()`, sau đó gọi API `GET /api/Products/{id}` trong `useEffect` để lấy dữ liệu chi tiết hiển thị.

**28. Tại sao API gọi lại 2 lần khi trang vừa load (ở chế độ Dev)?**
> Do React Strict Mode trong quá trình Development tự động render 2 lần để phát hiện các side effects không an toàn. Khi build lên Production sẽ chỉ chạy 1 lần.

**29. Hình ảnh QR Code thanh toán được tạo ra bằng cách nào?**
> Sử dụng API miễn phí từ `vietqr.io`. Gắn thẳng các tham số tài khoản, số tiền (`subtotal`) và nội dung thanh toán vào chuỗi URL của thẻ `<img>`.

**30. Hàm `fetchProducts` trong `ProductsPage.tsx` được trigger khi nào?**
> Nằm trong `useEffect` và theo dõi mảng dependencies: `[pageNumber, pageSize, keyword, minPrice, maxPrice, sortOrder]`. Cứ một trong số này thay đổi, API tự động được gọi lại.

---

## PHẦN 4: UI/UX & ANIMATION (31-40)

**31. Hiệu ứng "Bay vào giỏ hàng" (Fly-to-cart) được code như thế nào?**
> Viết bằng JavaScript thuần (`utils.ts`). Khi click, nó tạo ra một thẻ `img` tạm thời (clone), dùng `getBoundingClientRect` để lấy tọa độ nút bấm (start) và icon giỏ hàng (end), sau đó gán CSS `transition` để ép bức ảnh di chuyển, cuối cùng xóa thẻ `img` đó đi.

**32. Làm sao để icon giỏ hàng "nhún" lên khi nhận sản phẩm?**
> Kết hợp trong hàm Fly-to-cart: Dùng `setTimeout` chờ đúng thời gian ảnh bay tới, rồi thêm CSS `transform: scale(1.2)` cho icon giỏ hàng trong 200ms.

**33. Thanh tiến trình (Progress bar) màu hồng khi nhấn tìm kiếm làm bằng gì?**
> Là một thẻ `div` cực mỏng dưới thanh search. Khi đang tìm (`isSearching`), thẻ này được gắn class `animate-progress-loading` (chạy keyframe translateX từ -100% đến 0%) để giả lập đang loading dữ liệu.

**34. Lỗi `The class animate-fade-in does not exist` được fix như thế nào?**
> Ban đầu định nghĩa CSS tĩnh bị lỗi khi dùng với `@apply`. Cách fix chuẩn là đưa định nghĩa keyframes và animation vào cấu hình `theme.extend` trong `tailwind.config.js`.

**35. Class `group` và `group-hover` hoạt động thế nào trong ProductCard?**
> Bọc class `group` ở thẻ Card ngoài cùng. Ở nút Add to Cart bên trong dùng `group-hover:translate-y-0`. Khi di chuột vào *bất kỳ đâu* trong Card, nút bấm sẽ tự động trượt lên.

**36. Bố cục giới thiệu "Gia Đình Thỏ Xinh" dùng kỹ thuật gì để xếp ảnh đan xen?**
> Dùng CSS Grid chia thành 2 cột, kết hợp các khoảng padding/margin khác nhau (`space-y`, `pt-12`) cho mỗi cột để tạo hiệu ứng xếp gạch (Masonry Layout) không đối xứng.

**37. Tại sao UI giỏ hàng (CartDrawer) lại dùng `fixed inset-0`?**
> Để tạo một Overlay (màn đen mờ) phủ toàn bộ màn hình. Bản thân Drawer thì dùng absolute đính về bên phải (`right-0`), kết hợp animation trượt vào.

**38. `line-clamp-2` trong tên sản phẩm có ý nghĩa gì?**
> Dùng để ngắt dòng chữ. Nếu tên sản phẩm quá dài, nó sẽ chỉ hiện tối đa 2 dòng và thêm dấu `...` ở cuối, giúp các Card luôn bằng nhau về chiều cao.

**39. Việc format giá tiền VNĐ (100.000₫) thực hiện ra sao?**
> Dùng hàm mặc định của trình duyệt: `price.toLocaleString('vi-VN')`.

**40. Các huy hiệu (Badge) giảm giá dùng CSS gì để nổi bật?**
> Dùng `absolute top-2 left-2` để đè lên trên bức ảnh, kết hợp màu nền `bg-accent` (đỏ/cam) và font chữ đậm.

---

## PHẦN 5: ĐỊNH TUYẾN (ROUTING) & LUỒNG NGƯỜI DÙNG (41-50)

**41. Thư viện nào đảm nhận việc điều hướng không tải lại trang?**
> `react-router-dom` với thẻ `<Link to="...">` thay vì thẻ `<a>` truyền thống.

**42. Trang "Sản phẩm" (`/products`) và "Trang chủ" (`/`) khác nhau điểm gì lớn nhất?**
> Trang chủ (`Index.tsx`) có thêm Banner, AboutUs và phân tách sản phẩm theo section cứng. Màn Sản phẩm (`ProductsPage.tsx`) chuyên dụng để Lọc, có Sidebar khoảng giá chi tiết, phân trang đầy đủ.

**43. Tại sao click "Giới thiệu" trên menu nó lại trượt xuống dưới trang About?**
> Nhờ đặt `id="about-us"` ở phần giới thiệu và Link trỏ tới `/#about-us`. Kết hợp với CSS `scroll-behavior: smooth` tạo hiệu ứng lướt mượt mà.

**44. Class `scroll-mt-24` gắn ở ID đích đến có vai trò gì?**
> (Scroll Margin Top) Vì Header của website dùng `sticky top-0` (cố định trên cùng), nếu cuộn thẳng tới ID thì Header sẽ che mất tiêu đề. `scroll-mt-24` tạo khoảng hở ảo giúp cuộn xuống vừa đúng mép dưới Header.

**45. Làm sao để biết một link trên menu đang được Active (ví dụ đang ở trang /products thì menu Products sáng màu)?**
> Dùng hook `useLocation()` để lấy `location.pathname` hiện tại, sau đó so sánh với `link.href`. Nếu trùng, gắn thêm class màu `text-primary border-primary`.

**46. Nếu truy cập một URL sản phẩm không tồn tại, App xử lý thế nào?**
> Trong `ProductDetail.tsx`, block `catch (error)` của API sẽ bắt lỗi, hiển thị Toast "Không tìm thấy sản phẩm" và dùng `navigate('/products')` đẩy người dùng về trang danh sách.

**47. Lệnh `window.scrollTo(0, 0)` trong `ProductDetail.tsx` để làm gì?**
> Trong Single Page Application (SPA), khi chuyển từ trang này sang trang khác, vị trí cuộn bị giữ nguyên. Hàm này ép trình duyệt cuộn lên trên cùng khi vừa load xong trang chi tiết.

**48. Luồng "Mua ngay" trong Product Detail khác gì "Thêm vào giỏ"?**
> Hiện tại nút "Mua ngay" có thể được thiết lập để: Gọi hàm `addToCart`, sau đó dùng `navigate('/cart')` hoặc mở `CartDrawer` ra ngay lập tức và tự động nhảy sang step `checkout`.

**49. Nút "Quay lại" trong Product Detail dùng lệnh gì?**
> `navigate(-1)` của React Router, tương đương việc ấn nút Back trên trình duyệt, đưa người dùng về đúng màn hình trước đó kèm theo nguyên trạng thái URL (bộ lọc).

**50. Trong tương lai, làm sao để kết nối Module Authentication (Đăng nhập) với Giỏ hàng?**
> File `AuthModal.tsx` sẽ quản lý login/token. State user lưu vào Context. Lúc này, API `addToCart` thay vì lưu Local State sẽ gọi API backend POST `api/cart`, truyền Token lên để đồng bộ giỏ hàng vào Database thực.

---

## PHẦN 6: REACT NÂNG CAO (51-60)

**51. Hàm `useEffect` trong `ProductsPage.tsx` có mảng dependency `[pageNumber, pageSize, ...]` nhằm mục đích gì?**
> Để yêu cầu React tự động chạy lại hàm bên trong (gọi lại API fetchProducts) mỗi khi bất kỳ biến nào trong mảng dependency thay đổi giá trị.

**52. Nếu quên truyền mảng dependency vào `useEffect`, điều gì sẽ xảy ra?**
> Hàm bên trong sẽ chạy lại sau mỗi lần component render, gây ra vòng lặp vô hạn (infinite loop) gọi API liên tục làm sập trình duyệt và máy chủ.

**53. Tại sao trong `CartDrawer.tsx` lại dùng `setTimeout` khi xử lý hiệu ứng nháy nút?**
> Để đẩy tác vụ tắt hiệu ứng ra khỏi luồng thực thi chính (call stack) ngay lúc đó, giúp browser có thời gian render màu nút bấm bị "nháy" trong 200ms trước khi reset.

**54. React Strict Mode giúp gì cho dự án?**
> Cảnh báo về việc sử dụng các API cũ (deprecated), phát hiện các side-effect không mong muốn bằng cách double-render ở chế độ Dev, và kiểm tra các vấn đề về memory leak.

**55. Trong dự án có dùng `useCallback` hay `useMemo` không? Khi nào nên dùng?**
> Hiện tại dự án chưa dùng nhiều vì component chưa quá phức tạp. Tuy nhiên nên dùng `useCallback` cho các hàm truyền xuống component con dưới dạng prop để tránh component con bị re-render không cần thiết.

**56. State `products` được cập nhật bất đồng bộ (asynchronous). Làm sao để đảm bảo UI luôn đồng bộ với dữ liệu mới?**
> React sẽ tự động lên lịch (schedule) một lần re-render ngay sau khi hàm `setProducts` được gọi với dữ liệu mới từ API.

**57. Thẻ `<></>` (Fragment) có tác dụng gì?**
> Giúp gom nhóm nhiều component lại với nhau mà không tạo ra thêm một thẻ `div` thừa thãi trên cây DOM, giúp tối ưu hiệu năng và tránh phá vỡ bố cục CSS.

**58. Khi nào nên đưa một State lên component cha (Lifting State Up)?**
> Khi có từ 2 component con trở lên cần đọc hoặc thay đổi chung một dữ liệu. Ví dụ: `searchKeyword` được đưa lên `Index.tsx` để truyền cho cả `Header` (nhập từ khóa) và `FeaturedProducts` (hiển thị kết quả).

**59. Cơ chế Context API giải quyết bài toán gì so với Lifting State Up?**
> Giải quyết bài toán Prop Drilling (truyền prop qua nhiều tầng trung gian). Context giúp một component sâu bên dưới (như `ProductCard`) truy cập thẳng vào `cartItems` mà không cần truyền qua `FeaturedProducts`.

**60. Sự khác biệt giữa Component Function và Component Class là gì?**
> Component Function (như `ProductDetail`) ngắn gọn hơn, sử dụng Hooks (`useState`, `useEffect`) để quản lý vòng đời và state, trong khi Class dùng `this.state` và các hàm lifecycle (`componentDidMount`). Dự án này hoàn toàn dùng Function Component theo chuẩn hiện đại.

---

## PHẦN 7: TYPESCRIPT TRONG DỰ ÁN (61-70)

**61. Lợi ích lớn nhất của TypeScript trong dự án ToyStore là gì?**
> Bắt lỗi ngay trong lúc gõ code (compile time) thay vì lúc chạy (runtime), đặc biệt với dữ liệu API (như đảm bảo `product.price` luôn là số). 

**62. Interface `Product` đóng vai trò gì?**
> Định nghĩa cấu trúc khung xương (shape) của một đối tượng sản phẩm, bao gồm kiểu dữ liệu bắt buộc (id, name) và tùy chọn (như `originalPrice?: number`).

**63. Sự khác biệt giữa `interface` và `type` trong dự án này?**
> Cả hai đều dùng để định nghĩa kiểu dữ liệu. Tuy nhiên, `interface` phù hợp hơn để định nghĩa các Object có tính kế thừa và mở rộng, còn `type` mạnh hơn khi làm việc với Union types (vd: `type Step = 'cart' | 'checkout'`).

**64. Khi gõ `<Step>` cho `useState<Step>('cart')`, cú pháp này gọi là gì?**
> Gọi là Generics. Nó báo cho React biết rằng state `step` chỉ được phép nhận một trong các giá trị đã định nghĩa trong type `Step`, nếu truyền chữ khác sẽ báo lỗi đỏ.

**65. `React.FC` hay `React.ReactNode` dùng để làm gì?**
> `React.FC` (Functional Component) định nghĩa kiểu cho một component, giúp TypeScript hiểu nó sẽ nhận `props` và trả về một JSX element. `ReactNode` là kiểu dữ liệu bao hàm mọi thứ có thể render được trong React.

**66. Type assertion (`as any`) được dùng ở đâu và có rủi ro gì?**
> Dùng trong `handleInputChange as any` ở CartDrawer khi kiểu của sự kiện từ `textarea` không khớp hoàn toàn. Rủi ro là nó bỏ qua kiểm tra của TypeScript, có thể gây lỗi runtime nếu lạm dụng.

**67. Dấu chấm hỏi trong `product.id?.toString()` có nghĩa là gì?**
> Là Optional Chaining. Nó kiểm tra xem `product.id` có tồn tại (không null/undefined) không. Nếu có mới gọi hàm `.toString()`, nếu không thì trả về `undefined` thay vì báo lỗi "Cannot read properties of undefined".

**68. Dấu hỏi chấm kép `??` (Nullish Coalescing) khác gì dấu `||` (Logical OR)?**
> `??` chỉ lấy giá trị bên phải nếu bên trái là `null` hoặc `undefined`. Còn `||` lấy giá trị bên phải nếu bên trái là falsy (bao gồm cả `0`, `""`, `false`). Ví dụ: `stockQuantity ?? 10` sẽ lấy đúng số 0 nếu stock = 0, còn dùng `||` sẽ bị đè thành 10.

**69. Làm sao để định nghĩa Props cho component?**
> Khai báo một Interface (vd: `HeaderProps`) và truyền nó vào tham số của hàm: `const Header = ({ onSearch }: HeaderProps) => ...`

**70. `Record<K, V>` trong TypeScript là gì?**
> Là một utility type để tạo một object mà các key có kiểu là K và value có kiểu là V. (Tuy chưa xuất hiện trực tiếp trong code nhưng hữu ích khi tạo object cấu hình/map màu sắc).

---

## PHẦN 8: TAILWIND CSS & STYLING (71-80)

**71. Tailwind CSS theo chuẩn tư duy nào?**
> Utility-first. Cung cấp các class nhỏ lẻ (như `flex`, `pt-4`, `text-center`) để ghép lại thành UI thay vì phải viết CSS file riêng biệt.

**72. `@apply` trong file CSS có tác dụng gì?**
> Cho phép gom nhiều class của Tailwind (utility classes) vào một class CSS truyền thống để tái sử dụng, giúp code HTML ngắn gọn hơn (vd: tạo class `.modern-input`).

**73. Làm sao để Tailwind áp dụng Theme (sáng/tối)?**
> Bằng cách sử dụng CSS Variables (như `--background`, `--primary`) trong file `index.css` và cấu hình chúng trong `tailwind.config.js`. 

**74. Cú pháp `md:flex` hay `lg:col-span-8` có ý nghĩa gì?**
> Đây là các Responsive Modifiers. Giao diện sẽ mặc định chạy cấu hình ban đầu (mobile), đến màn hình `md` (tablet) thì đổi sang `flex`, lên màn `lg` thì chiếm 8 cột.

**75. Class `aspect-square` có tác dụng gì ở thư viện ảnh?**
> Ép thẻ div luôn giữ tỉ lệ khung hình là hình vuông (chiều rộng = chiều cao), giúp danh sách ảnh luôn đều đặn dù kích thước gốc của ảnh tải lên khác nhau.

**76. `hover:`, `focus:`, `active:` thuộc nhóm gì?**
> Gọi là State Modifiers. Cho phép thay đổi kiểu dáng ngay khi người dùng tương tác (di chuột, click, gõ phím) mà không cần viết JS.

**77. Class `backdrop-blur-sm` dùng làm gì?**
> Tạo hiệu ứng kính mờ (kính frosted) đằng sau phần tử. Rất hay dùng cho nền của Modal hoặc Header sticky để nội dung trượt bên dưới nhìn mờ mờ.

**78. Khi dùng class tùy chỉnh dạng `bg-[#F8F9FA]`, điều này gọi là gì?**
> Arbitrary values (Giá trị tùy ý). Tailwind sẽ tự động sinh ra một class CSS on-the-fly với mã màu hex này mà không cần khai báo trong file config.

**79. `transition-all duration-300` khác gì việc viết CSS animation keyframes?**
> `transition` dùng để làm mượt quá trình chuyển đổi giữa hai trạng thái (ví dụ từ không hover sang có hover). Còn animation keyframes (như `animate-fade-in`) dùng để chạy một chuỗi chuyển động phức tạp tự động.

**80. Cấu trúc `container mx-auto px-4` giúp giải quyết bài toán gì?**
> Tạo một vùng chứa nội dung nằm giữa màn hình. `container` giới hạn độ rộng tối đa theo từng breakpoint, `mx-auto` căn giữa, `px-4` tạo lề an toàn 2 bên trên mobile để không bị dính sát viền máy.

---

## PHẦN 9: VITE & QUẢN LÝ ASSET (81-90)

**81. Vite có ưu điểm gì so với Create React App (Webpack) cũ?**
> Khởi động server (HMR) cực nhanh do tận dụng tính năng ES modules gốc của trình duyệt, không cần bundle toàn bộ ứng dụng mỗi lần lưu file.

**82. File `vite.config.ts` dùng làm gì?**
> Chứa cấu hình cho Vite như: đăng ký plugin React, cài đặt alias path (chữ `@` trỏ tới `src`), hoặc cấu hình cổng proxy khi gọi API bị lỗi CORS.

**83. Tại sao ảnh dùng thẻ `img src="https..."` mà không lưu thẳng trong máy?**
> Vì hiện tại dự án đang giả lập ảnh từ kho ảnh mẫu Unsplash. Thực tế, ảnh nên được lưu trên Cloud (như S3, Cloudinary) và API Backend chỉ trả về URL ảnh.

**84. Hot Module Replacement (HMR) là gì?**
> Khi lưu code (Ctrl+S), Vite chỉ thay thế (replace) đúng component vừa sửa trên trình duyệt mà không cần F5 tải lại toàn bộ trang, giữ nguyên State hiện tại.

**85. Thư mục `public` khác gì thư mục `src/assets`?**
> Ảnh để trong `public` sẽ được giữ nguyên tên và đường dẫn gốc khi build. Ảnh để trong `src/assets` sẽ được Vite xử lý, nén và đổi tên có mã băm (hash) để tránh lỗi cache.

**86. Làm sao Vite tối ưu hóa việc build lên Production?**
> Vite dùng Rollup để đóng gói (bundle) code, tự động Tree-shaking (loại bỏ code thừa không dùng đến) và chia nhỏ code (Code splitting) để tải trang nhanh hơn.

**87. Dependencies và devDependencies trong `package.json` khác nhau ra sao?**
> `dependencies` chứa các thư viện bắt buộc để chạy app (như React, Axios). `devDependencies` chứa các thư viện chỉ cần lúc code và build (như TypeScript, Tailwind, Vite).

**88. `.env` file dùng làm gì trong dự án React bằng Vite?**
> Lưu trữ các biến môi trường nhạy cảm hoặc cấu hình theo môi trường (vd: `VITE_API_URL`). Trong code sẽ truy cập thông qua `import.meta.env.VITE_API_URL`.

**89. Tại sao phải có `tsconfig.node.json` bên cạnh `tsconfig.json`?**
> Do Vite có cấu trúc riêng. `tsconfig.json` dành cho code ứng dụng (chạy trên trình duyệt), còn `tsconfig.node.json` dành cho file cấu hình của Vite (chạy trên Node.js).

**90. Thư mục `dist` chứa gì?**
> Là thư mục sinh ra sau khi chạy lệnh `npm run build`. Nó chứa toàn bộ HTML, JS, CSS đã được nén tối đa, sẵn sàng đẩy lên server (Hosting).

---

## PHẦN 10: TỐI ƯU HIỆU NĂNG (PERFORMANCE) (91-100)

**91. Tại sao hàm `encodeURIComponent(keyword)` lại quan trọng trong việc gọi API?**
> Ngoài việc chống lỗi URL khi có dấu tiếng Việt, nó còn giúp ngăn chặn lỗi khi user cố tình nhập các ký tự đặc biệt như `&`, `=`, `?` làm hỏng chuỗi query string.

**92. Để tránh việc người dùng nhập quá nhanh gây gọi API liên tục (Spam API), bạn dùng kỹ thuật gì?**
> Kỹ thuật Debounce. Nghĩa là đợi người dùng gõ xong (dừng khoảng 300ms) thì mới bắt đầu gọi API. (Hiện tại dự án đang bắt sự kiện bấm nút Enter hoặc click nút Kính lúp thay vì gõ từng chữ).

**93. Việc `products.slice(0, 4)` trong `FeaturedProducts` có phải cách tối ưu?**
> Nó tốt cho mặt hiển thị UI (giới hạn 4 sản phẩm nổi bật). Tuy nhiên, về mặt mạng, Frontend vẫn phải tải toàn bộ danh sách. Nếu tối ưu chuẩn, nên gọi API lấy đúng 4 sản phẩm (`pageSize=4`).

**94. Tại sao lại cần thuộc tính `key={p.id}` khi map danh sách sản phẩm?**
> Để React hiểu và quản lý định danh của từng phần tử DOM. Khi danh sách bị thêm/xóa/sắp xếp, React dùng `key` để chỉ cập nhật đúng phần tử bị đổi, giúp tăng tốc độ render (Virtual DOM diffing).

**95. Trạng thái Loading giả (Skeleton) khác gì Spinner?**
> Spinner (xoay) báo hiệu hệ thống đang tải. Skeleton là hiển thị trước các khối xám có hình dáng tương tự UI thật, giúp não bộ người dùng cảm thấy tốc độ tải nhanh hơn và không bị giật khung hình khi dữ liệu đổ về.

**96. Kỹ thuật Lazy Loading hình ảnh (Image Lazy Loading) là gì?**
> Chỉ tải những hình ảnh đang nằm trong tầm nhìn của màn hình (Viewport). Ảnh bên dưới sẽ không tải cho đến khi cuộn tới. Trong React có thể dùng thuộc tính `loading="lazy"` trên thẻ `<img>`.

**97. Vấn đề "N+1 Queries" có xảy ra ở Frontend không?**
> Thường xảy ra ở Backend (DB). Nhưng ở FE, nếu map qua 10 sản phẩm và gọi thêm 10 lần API để lấy số lượng đánh giá từng cái thì cũng là lỗi N+1. Giải pháp là Backend phải gộp dữ liệu trả về 1 lần.

**98. Component `NavMenu` re-render khi nào?**
> Khi State `mobileOpen` thay đổi (đóng mở menu mobile) hoặc khi `location.pathname` thay đổi (để cập nhật trạng thái link Active màu hồng).

**99. Làm sao để giảm dung lượng file bundle JS?**
> Code Splitting thông qua `React.lazy()` và `Suspense`. Thay vì tải cục bộ toàn trang web 1 lần, các trang như About, Products sẽ chỉ được tải về máy user khi họ thực sự click vào.

**100. Việc tính toán `totalPages = Math.ceil(...)` nên đặt ở đâu là tốt nhất?**
> Chỉ tính một lần duy nhất lúc API trả về và lưu vào State, hoặc tính toán tại chỗ trước khối return (vì phép chia rất nhẹ, React có thể tính on-the-fly mà không gây chậm).

---

## PHẦN 11: QUẢN LÝ LỖI & TOAST NOTIFICATION (101-110)

**101. Khối `try...catch` trong các hàm gọi API đóng vai trò gì?**
> `try` chứa logic gọi mạng. Nếu mất mạng, server sập hoặc lỗi 404, code sẽ tự động nhảy vào khối `catch(error)` để xử lý mà không làm sập (crash) toàn bộ ứng dụng.

**102. Thông báo `showToast("Thành công")` sử dụng thư viện nào?**
> Đây không dùng thư viện ngoài mà tự build thông qua Context API (ToastContext). Giúp tùy biến giao diện dễ dàng và không bị phụ thuộc vào các gói thư viện có dung lượng lớn.

**103. Làm sao để Toast tự động biến mất sau 3 giây?**
> Sử dụng `setTimeout` ở trong ToastContext. Khi thêm 1 toast mới, hệ thống tự đặt đồng hồ đếm ngược 3 giây để xóa nó khỏi mảng danh sách toast.

**104. Lỗi 400 Bad Request khác gì 500 Internal Server Error?**
> 400 là lỗi do Client (Frontend) gửi sai dữ liệu (vd: thiếu tên, email sai định dạng). 500 là lỗi do máy chủ (Backend) gặp sự cố hệ thống hoặc bug logic trong code C#.

**105. Khi API trả về mảng rỗng nhưng không lỗi, xử lý thế nào?**
> Render giao diện Empty State (Trạng thái trống). Ví dụ trong `FeaturedProducts` sẽ hiện hình cái giỏ trống và chữ "Không tìm thấy sản phẩm nào khớp với bộ lọc".

**106. Khi Backend nâng cấp sửa đổi API gây hỏng Frontend, giải pháp tốt nhất là gì?**
> Luôn có cơ chế Fallback (dự phòng). Ví dụ: `p.price || 0` hoặc `p.imageUrl || "default.jpg"`. Điều này đảm bảo UI vẫn hiển thị, dù dữ liệu có bị thiếu.

**107. Làm sao để phát hiện lỗi khi người dùng đang mua hàng thì mất mạng?**
> Bắt lỗi network ở `catch` (Axios Error) và thông báo Toast: "Mất kết nối mạng, vui lòng kiểm tra lại!".

**108. Tại sao phải thêm thông báo lỗi ngay dưới ô nhập liệu (Inline validation) thay vì đợi Submit form?**
> UX tốt hơn. Người dùng biết ngay mình sai ở đâu lúc đang gõ (vd: số điện thoại thiếu số) thay vì phải đọc một thông báo dài ngoằng sau khi đã ấn Đặt hàng.

**109. Trong màn hình Checkout, nếu người dùng quên nhập SĐT thì sao?**
> Hàm `handleCompleteOrder` sẽ kiểm tra điều kiện `!formData.phone`. Nếu thiếu, hàm sẽ `return` (dừng lại) và gọi `showToast` báo lỗi.

**110. Error Boundary trong React là gì?**
> Là một cơ chế bọc ngoài ứng dụng. Nếu một Component con bất ngờ bị sập (lỗi JS), Error Boundary sẽ bắt lỗi và hiển thị màn hình "Đã xảy ra lỗi hệ thống" thay vì màn hình trắng bóc.

---

## PHẦN 12: GIỎ HÀNG NÂNG CAO (111-120)

**111. Nếu giỏ hàng có 2 sản phẩm giống hệt nhau, xử lý thế nào?**
> Hàm `addToCart` trong `CartContext` sẽ dùng `.findIndex` để kiểm tra xem `item.id` đã có chưa. Nếu có rồi, nó chỉ tăng `quantity` lên, nếu chưa có thì push sản phẩm mới vào mảng.

**112. Dữ liệu Giỏ hàng bị mất khi F5 (tải lại trang). Cách khắc phục?**
> Sử dụng `localStorage.setItem('cart', JSON.stringify(cartItems))` mỗi khi giỏ hàng thay đổi. Và khi app vừa khởi động, đọc lại từ `localStorage.getItem('cart')`.

**113. Tổng tiền (Subtotal) được tính như thế nào?**
> Dùng `.reduce()` lặp qua mảng `cartItems`, cộng dồn phép tính `(item.price * item.quantity)`.

**114. Logic xóa sản phẩm khỏi giỏ (`removeFromCart`)?**
> Sử dụng `.filter()` để tạo ra một mảng mới chỉ chứa những sản phẩm có `id` khác với `id` được truyền vào, sau đó cập nhật lại state.

**115. Tại sao nút Trừ (-) lại bị mờ (Disabled) khi số lượng = 1?**
> Để tránh số lượng bị giảm xuống 0 hoặc số âm. Gắn điều kiện `disabled={item.quantity <= 1}` vào thẻ `button`. (Nếu muốn cho phép giảm xuống 0 để xóa, có thể xử lý logic trong `updateQuantity`).

**116. Icon giỏ hàng có Badge số lượng. Cần làm gì để nó luôn Update đúng?**
> Sử dụng Context API. Vì Header (chứa icon) được bọc bởi `CartProvider`, bất kỳ cập nhật nào về số lượng trong CartContext sẽ khiến Header tự động re-render số mới nhất.

**117. Hàm `clearCart` gọi khi nào?**
> Được gọi ở bước `handleCompleteOrder` khi thanh toán thành công, giúp giỏ hàng tự động làm sạch (reset mảng về rỗng) để khách bắt đầu mua sắm vòng mới.

**118. Làm sao giữ Giỏ hàng đồng bộ trên mọi thiết bị (Điện thoại, Máy tính)?**
> `localStorage` chỉ lưu trên 1 máy. Để đồng bộ đa thiết bị, phải lưu giỏ hàng vào Database của Backend thông qua API gắn với User ID (yêu cầu người dùng phải Đăng nhập).

**119. Hiệu ứng "Slide in" (trượt từ phải sang) của giỏ hàng làm bằng CSS nào?**
> Kết hợp CSS Tailwind `fixed right-0 h-full transform transition-transform` với các class `translate-x-full` (khi ẩn) và `translate-x-0` (khi mở).

**120. `Pointer-events-none` ở Overlay có tác dụng gì?**
> Overlay là màn mờ đen. Nó nhận sự kiện click (`onClick={onClose}`) để đóng giỏ. Nếu Drawer (khối trắng) đè lên Overlay, thì click vào khối trắng phải không làm đóng giỏ (ngăn nổi bọt sự kiện).

---

## PHẦN 13: XỬ LÝ FORM & CHECKOUT (121-130)

**121. Tại sao dùng 1 object `formData` thay vì tạo 3 state `name`, `phone`, `address` riêng?**
> Gom chung vào 1 object giúp code gọn gàng hơn, dễ dàng truyền vào tham số API (như gửi nguyên object `formData`) và quản lý bằng 1 hàm onChange duy nhất.

**122. Cú pháp `[name]: value` trong hàm onChange của Form là gì?**
> Computed Property Names (ES6). Tính toán key động của object dựa trên thuộc tính `name` của ô input đang được gõ (nếu gõ ô phone thì nó hiểu là `phone: value`).

**123. Tại sao chọn phương thức Chuyển khoản (Bank) thì mới hiện mã QR?**
> Dùng toán tử logic `&&`: `{paymentMethod === 'bank' && <Div_hien_QR />}`. React sẽ render khối UI khi điều kiện là `true`.

**124. Mã QR động (Dynamic QR) trong dự án lấy từ đâu?**
> Gọi vào service của vietqr.io (Ví dụ: `img.vietqr.io/image/MB-12345-compact2.png...`). Nó ghép trực tiếp URL bằng template literal `${subtotal}` và `${formData.phone}`.

**125. Khi submit Form, tại sao phải gọi `e.preventDefault()`?**
> (Dù hiện tại dự án dùng các button `type="button"`). Nếu dùng thẻ `<form>` thật sự, `preventDefault()` ngăn trình duyệt tải lại trang (reload) khi nhấn Enter hoặc nút Submit.

**126. Quy trình xử lý lỗi ở Checkout (Form Validation) cần làm thêm gì để chuyên nghiệp?**
> Thêm Regex (biểu thức chính quy) để kiểm tra: SĐT phải bắt đầu bằng số 0 và đủ 10 số. Tránh người dùng gõ linh tinh "abc".

**127. "Cảm giác an toàn" trong Checkout được thiết kế bằng cách nào?**
> Bằng các Trust Badges (Biểu tượng cam kết) như 100% Chính hãng, Giao hàng nhanh. Hiển thị rõ tổng tiền, phí vận chuyển và màu xanh chữ "MIỄN PHÍ" để trấn an.

**128. Tại sao phải có Step "Success" (Thành công)?**
> Đó là sự khẳng định tâm lý (Validation) với khách hàng rằng tiền/đơn của họ đã được ghi nhận an toàn. Thông báo Toast là chưa đủ với một hành động mua bán quan trọng.

**129. Làm sao phóng to ảnh QR khi click vào?**
> Tạo ra một component `Modal` (Cửa sổ nổi bật giữa màn hình). Khi click ảnh nhỏ, set biến state `isQRModalOpen = true` để hiển thị Modal chứa ảnh QR kích thước lớn.

**130. Việc truyền URL QR qua prop hay tạo trực tiếp trong component có khác nhau không?**
> Tạo trực tiếp bằng chuỗi mẫu (Template string) ngay trong `CartDrawer` giúp nó phản ứng tức thì khi `subtotal` hoặc `formData.phone` thay đổi ở mỗi nhịp gõ phím.

---

## PHẦN 14: SEARCH & LỌC SẢN PHẨM (131-140)

**131. Truyền dữ liệu Lọc từ Menu (Category) vào Component Sản phẩm thế nào?**
> Hiện tại trang ProductsPage có thể lấy tham số qua URL Params (`?category=DoNhBep`). Khi click menu, update URL, component tự đọc URL và fetchAPI lại.

**132. Gợi ý giá (Quick filters) hoạt động ra sao?**
> Đó là các nút bấm có cấu hình sẵn `min` và `max`. Khi click, nó gọi hàm set `minPrice` và `maxPrice`, từ đó `useEffect` phát hiện sự thay đổi và tự động gọi API.

**133. Tại sao chọn bộ lọc giá lại phải gọi API về Server mà không lọc trực tiếp ở Frontend?**
> Vì Frontend chỉ giữ danh sách của trang hiện tại (ví dụ 12/1000 sản phẩm). Nếu lọc ở Frontend sẽ bị sai dữ liệu. Phải nhờ Database của Server tìm trong tổng 1000 sản phẩm đó.

**134. Logic `sortOrder` (Sắp xếp) trong Backend thường viết bằng lệnh SQL gì?**
> `ORDER BY price ASC` (thấp đến cao) hoặc `ORDER BY price DESC` (cao đến thấp). API nhận chuỗi `price_asc` và phiên dịch ra lệnh SQL tương ứng.

**135. Tại sao cần có nút "Xóa tất cả bộ lọc"?**
> Đưa mọi biến filter (`keyword`, `minPrice`, `sortOrder`) về chuỗi rỗng `""`. Điều này giúp tạo truy vấn API sạch không có tham số, trả về danh sách gốc mặc định.

**136. Thuộc tính `value` trong thẻ `<select>` quản lý Sắp xếp có gì đặc biệt?**
> Nó là một Controlled Component trong React. Giá trị của thẻ select bị trói buộc hoàn toàn vào biến State `sortOrder`. Giao diện đổi khi State đổi và ngược lại.

**137. Phân trang trên điện thoại (Mobile) gặp khó khăn gì và cách khắc phục?**
> Trên di động, nếu hiện cả 10 nút trang sẽ bị tràn màn hình. Khắc phục bằng cách chỉ render trang `[1, 2, 3, ..., 10]` hoặc chỉ hiển thị nút Prev/Next kết hợp text "Trang 1/10".

**138. Tại sao khi chuyển trang, màn hình lại tự cuộn lên (scroll up) 400px?**
> Lệnh `window.scrollTo({ top: 400, behavior: 'smooth' })`. Khi ấn sang trang 2, danh sách mới đổ về. Nếu không cuộn, mắt người dùng vẫn mắc kẹt ở dưới đáy trang (footer). Cuộn lên vùng "Top Toolbar" giúp họ xem từ đầu trang mới.

**139. Chức năng Search dùng `encodeURIComponent` xử lý được dấu cộng (+) hay dấu và (&) không?**
> Có. Nó biến đổi dấu `+` thành `%2B`, dấu `&` thành `%26`. Nhờ đó Server không hiểu nhầm các ký hiệu đặc biệt của từ khóa là các tham số ngăn cách (delimiter) của chuỗi Query String.

**140. Bố cục "All-in-one" (Lọc & Hiển thị kết quả) trên trang chủ có rủi ro gì về UX không?**
> Rủi ro là quá nhiều bộ lọc gây rối rắm. Khắc phục bằng cách đưa vùng lọc vào nút "Lọc giá" dạng ẩn/hiện (Toggle), giữ màn hình trang chủ mặc định được gọn gàng.

---

## PHẦN 15: TÍNH NĂNG ADMIN & MỞ RỘNG (141-150)

**141. Trang AdminDashboard khác trang Shop như thế nào về Layout?**
> Admin thường dùng Sidebar (menu trái cứng) và Topbar đơn giản để chừa diện tích tối đa cho Bảng biểu (Table) hiển thị hàng ngàn bản ghi.

**142. Chức năng Quản lý Sản phẩm (Admin) cần những thao tác cơ bản nào?**
> CRUD: Create (Thêm mới), Read (Xem danh sách), Update (Sửa thông tin, giá), Delete (Xóa sản phẩm). Tương ứng gọi API POST, GET, PUT, DELETE.

**143. Dữ liệu bảng (Table) trong React thường được xử lý tối ưu ra sao?**
> Sử dụng thư viện như `TanStack Table` (React Table) hoặc tự xây dựng để hỗ trợ Sắp xếp từng cột, Tìm kiếm cục bộ và Phân trang dữ liệu tại bảng (Pagination).

**144. Upload hình ảnh sản phẩm (FE -> BE) diễn ra như thế nào?**
> Frontend chọn file bằng input `type="file"`, biến đổi thành đối tượng `FormData` (multipart/form-data), dùng Axios POST lên Server. Server nhận file lưu vào máy chủ rồi trả về cái URL đường dẫn ảnh.

**145. JWT (JSON Web Token) dùng trong Admin có mục đích gì?**
> Để xác thực (Authentication). Khi Login, API trả về Token. FE lưu token đó vào LocalStorage và tự động gắn vào Header `Authorization: Bearer <token>` mỗi lần gọi các API Admin. Nếu không có token, Backend sẽ chặn lại (401 Unauthorized).

**146. Nếu Admin muốn biết Doanh thu tháng này, FE làm gì?**
> FE gọi API `/api/analytics/revenue`. BE chịu trách nhiệm cộng tổng tiền các đơn hàng trong tháng. FE dùng thư viện như `Recharts` hoặc `Chart.js` để vẽ biểu đồ trực quan (Biểu đồ cột/đường).

**147. Chức năng cập nhật tồn kho (Stock) hoạt động tự động ra sao?**
> Khi Khách hàng đặt mua thành công, Backend tự động trừ tồn kho. Ở FE Admin sẽ có API báo động khi Stock < 5 (Ví dụ: "Hàng sắp hết"). Cần thiết kế Badge đỏ để nhấn mạnh.

**148. Tính năng Modal "Xác nhận xóa" có quan trọng không?**
> Rất quan trọng. Prevent accidental deletion (ngăn chặn thao tác nhầm lẫn). Phải hiện Modal cảnh báo "Bạn có chắc chắn muốn xóa?" trước khi thật sự gọi lệnh API DELETE.

**149. Code codebase của dự án đang dùng Component UI nào để tiết kiệm thời gian?**
> Hiện tại tự code bằng Tailwind (Custom Components). Để tăng tốc làm Admin, lập trình viên thường cài đặt `shadcn/ui` (xây sẵn trên Radix) hoặc `MUI` (Material UI).

**150. Bước tiếp theo để triển khai (Deploy) dự án Front-end này lên mạng là gì?**
> 1. Chạy lệnh `npm run build` để sinh ra thư mục `dist`.
> 2. Đẩy thư mục `dist` này lên các nền tảng Hosting cho ứng dụng tĩnh (Static Hosting) như Vercel, Netlify, hoặc AWS S3. 
> 3. Cấu hình biến môi trường (Environment Variables) trong bảng điều khiển của Hosting trỏ đúng tới địa chỉ IP của máy chủ Backend (C# API).