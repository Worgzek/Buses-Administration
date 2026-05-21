-- 1. Bến Xe (Chạy đầu tiên)
CREATE TABLE BEN_XE (
    MaBenXe VARCHAR(20) PRIMARY KEY, -- Thống nhất độ dài 20
    TenBenXe VARCHAR(100) NOT NULL,
    DiaChi TEXT
);

-- 2. Tài Xế
CREATE TABLE TAI_XE (
    MaTaiXe VARCHAR(10) PRIMARY KEY,
    TenTaiXe VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    BangLai VARCHAR(50),
    NgaySinh DATE
);

-- 3. Hành Khách
CREATE TABLE HANH_KHACH (
    MaHanhKhach VARCHAR(10) PRIMARY KEY,
    TenHanhKhach VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15)
);

-- 4. Tuyến Xe (Phải sửa độ dài MaBXdau)
CREATE TABLE TUYEN_XE (
    MaTuyen VARCHAR(20) PRIMARY KEY,
    TenTuyen VARCHAR(100) NOT NULL,
    MaBXdau VARCHAR(20) REFERENCES BEN_XE(MaBenXe), -- Sửa từ 10 thành 20
    MaBXcuoi VARCHAR(20) REFERENCES BEN_XE(MaBenXe),
    GiaVe DECIMAL(12, 2)
);

-- 5. Xe Bus
CREATE TABLE XE_BUS (
    MaXe VARCHAR(10) PRIMARY KEY,
    BienSo VARCHAR(20) UNIQUE NOT NULL,
    SoCho INTEGER CHECK (SoCho > 0),
    TrangThai VARCHAR(50),
    MaTuyen VARCHAR(20) REFERENCES TUYEN_XE(MaTuyen)
);

-- 6. Nhân Viên (Phải sửa độ dài MaBenXe)
CREATE TABLE NHAN_VIEN (
    MaNhanVien VARCHAR(10) PRIMARY KEY,
    TenNhanVien VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    ChucVu VARCHAR(50),
    MaBenXe VARCHAR(20) REFERENCES BEN_XE(MaBenXe) -- Sửa từ 10 thành 20
);

-- 7. Chuyến Xe
CREATE TABLE CHUYEN_XE (
    MaChuyen VARCHAR(10) PRIMARY KEY,
    NgayKhoiHanh DATE NOT NULL,
    GioKhoiHanh TIME NOT NULL,
    MaXe VARCHAR(10) REFERENCES XE_BUS(MaXe),
    MaTaiXe VARCHAR(10) REFERENCES TAI_XE(MaTaiXe),
    TrangThai VARCHAR(50)
);

-- 8. Vé (Bảng cuối cùng)
CREATE TABLE VE (
    MaVe VARCHAR(10) PRIMARY KEY,
    SoGhe INTEGER NOT NULL CHECK (SoGhe > 0),
    GiaVe_ThucTe DECIMAL(12, 2),
    NgayDat DATE DEFAULT CURRENT_DATE,
    MaChuyen VARCHAR(10) REFERENCES CHUYEN_XE(MaChuyen),
    MaHanhKhach VARCHAR(10) REFERENCES HANH_KHACH(MaHanhKhach),
    MaNhanVien VARCHAR(10) REFERENCES NHAN_VIEN(MaNhanVien)
);