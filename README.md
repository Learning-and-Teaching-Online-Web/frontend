# 🎓 BÁO CÁO THỰC TẬP TỐT NGHIỆP ĐẠI HỌC
## ĐỀ TÀI: XÂY DỰNG NỀN TẢNG WEB KẾT NỐI GIA SƯ VÀ HỌC VIÊN, HỖ TRỢ HỌC TRỰC TUYẾN VÀ TÍCH HỢP AI HỖ TRỢ HỌC TẬP

### 🏫 Đơn Vị: HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG (PTIT)
- **Giảng Viên Hướng Dẫn**: Th.S Nguyễn Thị Bích Nguyên

### 👥 Sinh Viên Thực Hiện (Lớp D22CQCNPM01-N):
1. **Nguyễn Ngọc Cẩn** - MSSV: `N22DCCN009`
2. **Nguyễn Thành Phong** - MSSV: `N22DCCN059`
3. **Nguyễn Nhật Thi** - MSSV: `N22DCCN080`

---

# 🎨 NovaLearn Frontend Web App (Client Repository)

Giao diện Web Application phục vụ cho Đồ án Thực tập tốt nghiệp đại học **"Xây dựng nền tảng Web kết nối Gia sư và Học viên, hỗ trợ học trực tuyến và tích hợp AI hỗ trợ học tập"**, phát triển trên nền tảng **React 19 + TypeScript + Vite**. Hệ thống cho phép Học viên đăng bài tìm gia sư, theo dõi tiến độ thanh toán Escrow 48 giờ; Gia sư duyệt danh sách lớp, ứng tuyển nhanh, nộp phí nhận lớp và quản lý ví cá nhân.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework & Core**: React 19, TypeScript, Vite
- **Routing & State**: React Router v7, Custom State Hooks
- **HTTP Client**: Axios (với Axios Interceptors quản lý JWT Auth)
- **UI Components & Styling**: Custom CSS Modules / Standard CSS, Lucide React Icons, React Datepicker
- **Notification**: React Toastify

---

## ✨ Các Phân Hệ & Tính Năng Giao Diện (Key Features)

### 🎓 1. Phân Hệ Học Viên (Student Portal)
- **Đăng Bài Tìm Gia Sư**: Form đăng bài chọn môn học, lớp, mức lương, thời gian và địa điểm học.
- **Thanh Toán Học Phí Escrow (48h)**: Giao diện đồng hồ đếm ngược 48h, nút đóng học phí tháng đầu từ ví cá nhân.
- **Hủy Nhận Lớp 48h**: Cho phép từ chối nhận lớp trong giai đoạn chờ đóng phí để nhận lại tiền về ví.
- **Yêu Cầu Hủy Lớp 7 Ngày**: Gửi yêu cầu hủy lớp kèm lý do cho Admin phê duyệt trong thời hạn bảo hộ 7 ngày.

### 👩‍🏫 2. Phân Hệ Gia Sư (Tutor Portal)
- **Tìm Lớp Học Công Khai**: Bộ lọc tìm kiếm lớp theo Môn học, Trình độ/Lớp, Tỉnh/Thành phố.
- **Ứng Tuyển Nhanh**: Đăng ký nhận lớp công khai hoặc xem các lớp được gán trực tiếp.
- **Nộp Phí Nhận Lớp Escrow (35%)**: Thanh toán phí nhận lớp trong thời hạn 48h đếm ngược.
- **Quản Lý Lớp Học**: Danh sách các lớp đang hoạt động (`ACTIVE`), lớp đang chờ nộp phí, và các lớp được hoàn tiền 100%.

### 👑 3. Phân Hệ Quản Trị Viên (Admin Portal)
- **Kiểm Duyệt Bài Đăng**: Duyệt các bài tìm gia sư mới tạo (`PENDING_ADMIN`), gán gia sư chỉ định.
- **Xử Lý Yêu Cầu Hoàn Tiền (`RefundTicket`)**: Đánh giá căn cứ hủy lớp, phân định lỗi (`STUDENT_FAULT` hoặc `TUTOR_FAULT`) và duyệt hoàn tiền theo tỷ lệ quy định.

### 💳 4. Quản Lý Ví & Lịch Sử Giao Dịch
- Hiển thị số dư khả dụng, giao diện nạp tiền vào ví.
- Theo dõi chi tiết lịch sử biến động số dư (Nạp tiền, Đóng phí Escrow, Nhận hoàn tiền ví).

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

```text
frontend/
├── src/
│   ├── assets/              # Hình ảnh, icons, static assets
│   ├── components/          # Layouts & Reusable UI components
│   │   ├── admin/           # Tabs & Modals dành cho Admin
│   │   ├── student/         # Tabs & Form bài đăng dành cho Học viên
│   │   ├── teacher/         # Tabs danh sách lớp & ứng tuyển dành cho Gia sư
│   │   ├── common/          # Header, Footer, Navbar, Loading Spinners
│   ├── pages/               # Trang chính (Home, Login, Register, Wallet, Profile...)
│   ├── services/            # Axios Client & API Endpoints Callers
│   ├── utils/               # Formatters (Tiền tệ, Ngày tháng, Cấp học)
│   ├── App.tsx              # Application Routes & Auth Providers
│   └── main.tsx             # Entry point React
├── index.html
├── package.json
└── vite.config.ts
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng (Setup & Installation)

### 1. Yêu cầu môi trường
- Node.js >= 18.x
- Backend API Server đã được khởi chạy (Mặc định: `http://localhost:5000`)

### 2. Cài đặt thư viện phụ thuộc
```bash
npm install
```

### 3. Khai báo biến môi trường (`.env`)
Tạo file `.env` tại thư mục gốc `frontend/`:

```env
VITE_API_URL="http://localhost:5000/api"
```

### 4. Khởi chạy ứng dụng

- **Môi trường Phát triển (Development Mode)**:
  ```bash
  npm run dev
  ```
  Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

- **Đóng gói Sản phẩm (Production Build)**:
  ```bash
  npm run build
  ```

- **Xem thử bản Build (Preview Production)**:
  ```bash
  npm run preview
  ```
