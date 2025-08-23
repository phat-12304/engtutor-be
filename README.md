# EngTutor Backend

Backend API cho ứng dụng dạy tiếng Anh EngTutor.

## 🚀 Tính năng chính

- Đăng ký và đăng nhập người dùng
- Quản lý gia sư
- Quản lý gói học
- Đặt lịch học
- Quản lý đơn hàng
- Upload ảnh (avatar người dùng, ảnh gia sư)
- Tải ảnh từ URL

## 🛠️ Công nghệ sử dụng

- **Node.js** - Môi trường chạy
- **Express.js** - Framework web
- **MongoDB** - Cơ sở dữ liệu
- **JWT** - Xác thực người dùng
- **Multer** - Upload file

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- MongoDB
- npm

## 🔧 Cài đặt


1. Cài đặt thư viện
```bash
npm install
```


2. Chạy server
```bash
# Chế độ phát triển
npm run dev

# Chế độ sản xuất
npm start
```

## 📁 Cấu trúc thư mục

```
engtutor-be/
├── config/          # Cấu hình
├── controllers/     # Xử lý logic
├── middleware/      # Middleware
├── models/          # Model dữ liệu
├── routes/          # Định tuyến API
├── services/        # Dịch vụ (bao gồm upload)
├── assets/          # File ảnh (users/, tutors/)
└── server.js        # File chính
```

## 🔌 API Endpoints

### Người dùng
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/me` - Lấy thông tin cá nhân
- `POST /api/register` - Đăng ký
- `POST /api/login` - Đăng nhập
- `PUT /api/users` - Cập nhật thông tin (có thể upload avatar)

### Gia sư
- `GET /api/tutors` - Lấy danh sách gia sư
- `GET /api/tutors/:id` - Lấy thông tin gia sư
- `POST /api/tutors` - Thêm gia sư mới (có thể upload ảnh)
- `PUT /api/tutors/:id` - Cập nhật gia sư (có thể upload ảnh)
- `DELETE /api/tutors/:id` - Xóa gia sư

### Gói học
- `GET /api/packages` - Lấy danh sách gói học
- `POST /api/packages` - Thêm gói học mới
- `PUT /api/packages/:id` - Cập nhật gói học
- `DELETE /api/packages/:id` - Xóa gói học

### Lịch học
- `GET /api/schedules` - Lấy danh sách lịch học
- `POST /api/schedules` - Tạo lịch học mới
- `PUT /api/schedules/:id` - Cập nhật lịch học
- `GET /api/schedules-try/:id` - Lấy lịch thử
- `GET /api/schedules-by/:id` - Lấy lịch của gia sư

### Đơn hàng
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới


