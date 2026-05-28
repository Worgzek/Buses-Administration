# 🚌 Hệ Thống Quản Lý Bán Vé Xe Bus

Dự án Hệ thống quản lý bán vé xe bus được xây dựng nhằm mục đích tự động hóa quy trình quản lý chuyến xe, đặt vé và thống kê dữ liệu.

## 🛠 Công nghệ sử dụng
- **Backend:** Python (Flask)
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (Bootstrap, Font Awesome)

## ✨ Các tính năng nổi bật
- **Tự động hóa logic (Database Trigger):**
    - Tự động trừ/cộng số chỗ ngồi khi có hành động đặt vé hoặc hủy vé.
    - Tự động cập nhật trạng thái chuyến xe (`Sẵn sàng` / `Đang hoạt động`).
    - Chặn đặt vé vượt quá số ghế quy định ngay từ cấp độ cơ sở dữ liệu.
- **Dashboard Thống kê thời gian thực:**
    - Tổng doanh thu.
    - Số lượng khách hàng.
    - Theo dõi các chuyến xe trong ngày.
    - Báo cáo top tuyến xe có doanh thu cao nhất.

## 📁 Cấu trúc thư mục
- `/app.py`: File cấu hình chính và các API.
- `/db.py`: Các hàm truy vấn cơ sở dữ liệu.
- `/templates/`: Chứa các file giao diện HTML.
- `/static/`: Chứa file CSS, JS và hình ảnh.
- `/sql/`: Các file khởi tạo bảng, trigger và function.

## 🛠 Công nghệ
- **Frontend:** Javascript (chartJS), HTML/CSS(Bootstrap)
- **Backend:** Python (Flask)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu
- Đã cài đặt [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/).

### 2. Khởi chạy dự án
Tại thư mục gốc của dự án (nơi chứa file `docker-compose.yml`), chạy lệnh:

```bash
docker-compose up --build
