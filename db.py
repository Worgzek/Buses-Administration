import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        port=os.getenv('DB_PORT')
    )

#---BEN XE

def get_all_stations():
    query = '''
                SELECT * FROM ben_xe
                ORDER BY mabenxe ASC
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_station(ma, ten, diachi):
    query = '''
                INSERT INTO ben_xe (mabenxe, tenbenxe, diachi) 
                VALUES 
                (%s, %s, %s)
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, ten, diachi))
            conn.commit()
    finally:
        conn.close()

def delete_station(ma):
    query = '''
                Delete 
                from ben_xe 
                where 
                mabenxe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            conn.commit()
    finally:
        conn.close()

def edit_stations(ten, diachi, ma):
    query = '''
                update ben_xe
                set tenbenxe = %s, diachi = %s
                where mabenxe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ten, diachi, ma))
            conn.commit()
    finally:
        conn.close()

#---TUYEN XE

def get_all_tuyen():
    query = '''
        SELECT 
            t.matuyen
            ,t.tentuyen
            ,b1.tenbenxe AS ten_dau
            ,b2.tenbenxe AS ten_cuoi
            ,t.giave
        FROM tuyen_xe t
        LEFT JOIN ben_xe b1 ON t.maBXdau = b1.mabenxe
        LEFT JOIN ben_xe b2 ON t.maBXcuoi = b2.mabenxe
        ORDER BY t.matuyen ASC
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_tuyen(ma, ten, dau, cuoi, gia):
    query = '''
                insert into tuyen_xe(matuyen, tentuyen, maBXdau, maBXcuoi, giave)
                values
                (%s,%s,%s,%s,%s);
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma, ten, dau, cuoi, gia))
            conn.commit()
    finally:
        conn.close()

def delete_tuyen(ma):
    query = '''
                delete 
                from tuyen_xe
                where matuyen = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            conn.commit()
    finally:
        conn.close()

def get_tuyen_by_id(ma):
    query = '''
        SELECT 
            t.matuyen
            ,t.tentuyen
            ,t.maBXdau
            ,t.maBXcuoi
            ,t.giave
            ,b1.tenbenxe AS ten_dau
            ,b2.tenbenxe AS ten_cuoi
        FROM tuyen_xe t
        LEFT JOIN ben_xe b1 ON t.maBXdau = b1.mabenxe
        LEFT JOIN ben_xe b2 ON t.maBXcuoi = b2.mabenxe 
        WHERE t.matuyen = %s
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            return cur.fetchone()
    finally:
        conn.close()

def edit_tuyen(ma, ten, dau, cuoi, gia):
    query = '''
        UPDATE tuyen_xe 
        SET tentuyen = %s, 
            maBXdau = %s, 
            maBXcuoi = %s, 
            giave = %s
        WHERE matuyen = %s
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ten, dau, cuoi, gia, ma))
            conn.commit()

    finally:
        conn.close()

#-----XE

def get_all_xe():
    query = '''
                select
                xe.MaXe
                ,xe.BienSo
                ,xe.SoCho
                ,xe.TrangThai
                ,tuy.tentuyen
                from xe_bus xe
                left join tuyen_xe tuy on xe.matuyen = tuy.matuyen
                order by MaXe asc
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_xe(ma, bien, cho, tuyen):
    ttg = 'Sẵn sàng' if (tuyen and str(tuyen).strip() != "") else 'Chưa gán tuyến'
    ma_tuyen = tuyen if (tuyen and str(tuyen).strip() != "") else None

    query = '''
            INSERT INTO xe_bus (MaXe, BienSo, SoCho, TrangThai, MaTuyen)
            VALUES 
            (%s, %s, %s, %s, %s)
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, bien, cho, ttg, ma_tuyen))
            conn.commit()
    finally:
        conn.close()

def xoa_xe(ma):
    query = '''
            delete
            from xe_bus
            where maxe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            conn.commit()
    finally:
        conn.close()

def get_one_xe(ma):
    query = '''
                select 
                xe.bienso
                ,xe.socho
                ,tuy.matuyen
                from xe_bus xe
                left join tuyen_xe tuy on xe.matuyen = tuy.matuyen
                where xe.maxe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            return cur.fetchone()
    finally:
        conn.close()

def update_xe(ma, bien, cho, tuyen, trang_thai):
    query = '''
            UPDATE XE_BUS 
            SET BienSo = %s
            ,SoCho = %s
            ,MaTuyen = %s
            ,TrangThai = %s
            WHERE MaXe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (bien, cho, tuyen, trang_thai, ma))
            conn.commit()
    finally:
        conn.close()

#-----Nhan Vien & Tai xe

def get_all_nhan_vien():
    query = '''SELECT 
                MaNhanVien
                ,TenNhanVien
                ,SoDienThoai
                ,ChucVu
                ,MaBenXe 
                FROM NHAN_VIEN
                ORDER BY MaNhanVien ASC
                '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_nhan_vien(ma, ten, sdt, chucvu, maben):
    query = '''
            INSERT INTO NHAN_VIEN 
            (MaNhanVien, TenNhanVien, SoDienThoai, ChucVu, MaBenXe) 
            VALUES 
            (%s, %s, %s, %s, %s)
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, ten, sdt, chucvu, maben))
            conn.commit()
    finally:
        conn.close()

def get_all_tai_xe():
    query = '''
                SELECT 
                MaTaiXe
                ,TenTaiXe
                ,SoDienThoai
                ,BangLai
                ,TrangThai
                FROM TAI_XE
                order by MaTaiXe ASC
                '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_tai_xe(ma, ten, sdt, banglai, trangthai):
    query = '''
                INSERT INTO TAI_XE (MaTaiXe, TenTaiXe, SoDienThoai, BangLai, TrangThai) 
                VALUES 
                (%s, %s, %s, %s, %s)
                '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, ten, sdt, banglai, trangthai))
            conn.commit()
    finally:
        conn.close()

def delete_nv(ma):
    query ='''
                Delete from NHAN_VIEN
                where MaNhanVien = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            conn.commit()
    finally:
        conn.close()

def delete_tx(ma):
    query = '''
                Delete from TAI_XE
                where MaTaiXe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            conn.commit()
    finally:
        conn.close()

def get_tx_by_id(ma):
    query ='''
                SELECT MaTaiXe
                ,TenTaiXe
                ,SoDienThoai
                ,BangLai
                ,TrangThai 
                FROM TAI_XE 
                WHERE MaTaiXe = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            row = cur.fetchone()
            if row:
                return {
                    "Ma": row[0],
                    "Ten": row[1],
                    "SDT": row[2],
                    "BangLai": row[3],
                    "TrangThai": row[4]
                }
            return None
    finally:
        conn.close()

def update_tai_xe(ma, ten, sdt, banglai, trangthai):
    query = '''
        UPDATE TAI_XE 
        SET TenTaiXe = %s, SoDienThoai = %s, BangLai = %s, TrangThai = %s
        WHERE MaTaiXe = %s
    '''
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute(query, (ten, sdt, banglai, trangthai, ma))
        conn.commit()
    conn.close()

def get_nv_by_id(ma):
    query = '''
                SELECT 
                MaNhanVien
                ,TenNhanVien
                ,SoDienThoai
                ,ChucVu 
                ,MaBenXe
                FROM NHAN_VIEN WHERE MaNhanVien = %s
                '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            r = cur.fetchone()
            if r:
                return {
                    "Ma": r[0],
                    "Ten": r[1],
                    "SoDienThoai": r[2],
                    "ChucVu": r[3],
                    "MaBenXe": r[4]
                }
            return None
    finally:
        conn.close()

def update_nv(ma, ten, sdt, chucvu, maben):
    query = '''
            UPDATE NHAN_VIEN
            SET TenNhanVien = %s
            ,SoDienThoai = %s
            ,ChucVu = %s
            ,MaBenXe = %s
            WHERE MaNhanVien = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ten,sdt,chucvu,maben,ma))
            conn.commit()
    finally:
        conn.close()

#-----CCHUYEN XE------

def get_all_route():
    query = '''
            Select 
            c.MaChuyen
            ,c.ThoiGianKhoiHanh
            ,x.BienSo
            ,t.TenTuyen
            ,c.TrangThai
            from CHUYEN_XE c
            join XE_BUS x on c.MaXe = x.MaXe
            join TUYEN_XE t on c.MaTuyen = t.MaTuyen
            order by c.MaChuyen ASC
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
            return rows
    finally:
        conn.close()

def delete_chuyen(ma):
    query='''
            delete from CHUYEN_XE 
            where MaChuyen = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma,))
            conn.commit()
    finally:
        conn.close()


def add_chuyen(ma, thoigian, tuyen, xe, taixe):
    query='''
            insert into CHUYEN_XE(MaChuyen, ThoiGianKhoiHanh, MaXe, MaTuyen, MaTaiXe, TrangThai)
            values
            (%s,%s,%s,%s,%s,%s)
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, thoigian, tuyen, xe, taixe, 'Sẵn sàng'))
            conn.commit()
    finally:
        conn.close()

def update_chuyen(ma, thoigian, xe, tuyen, taixe, trangthai):
    query = '''
        UPDATE CHUYEN_XE 
        SET ThoiGianKhoiHanh=%s, MaXe=%s, MaTuyen=%s, MaTaiXe=%s, TrangThai=%s 
        WHERE MaChuyen=%s
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (thoigian, xe, tuyen, taixe, trangthai, ma))
            conn.commit()
    finally:
        conn.close()

def get_one_chuyen(ma):
    query = '''
            SELECT 
                c.MaChuyen, 
                TO_CHAR(ThoiGianKhoiHanh, 'YYYY-MM-DD HH24:MI:SS'),            
                c.MaXe,
                c.MaTuyen,
                c.MaTaiXe,
                c.TrangThai
            FROM CHUYEN_XE c
            WHERE MaChuyen = %s
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            row = cur.fetchone()
            return row
    finally:
        conn.close()

#------------VE

# Lấy danh sách chuyến xe (Dùng cho dropdown Bán vé)
def get_chuyen_active():
    query = '''
        SELECT c.MaChuyen, t.TenTuyen, TO_CHAR(c.ThoiGianKhoiHanh, 'YYYY-MM-DD HH24:MI'), t.GiaVe, xe.SoCho
        FROM CHUYEN_XE c
        JOIN TUYEN_XE t ON c.MaTuyen = t.MaTuyen
        JOIN XE_BUS xe ON c.MaXe = xe.MaXe
        WHERE c.TrangThai IN ('Sẵn sàng', 'Đang chạy')
        order by c.MaChuyen ASC
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

# Kiểm tra khách hàng theo SĐT (Để tránh tạo trùng)
def get_khach_by_sdt(sdt):
    query = "SELECT MaHanhKhach, TenHanhKhach FROM HANH_KHACH WHERE SoDienThoai = %s"
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (sdt,))
            return cur.fetchone()
    finally:
        conn.close()

# Thêm khách hàng mới
def insert_khach(ma, ten, sdt):
    query = "INSERT INTO HANH_KHACH (MaHanhKhach, TenHanhKhach, SoDienThoai) VALUES (%s, %s, %s)"
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, ten, sdt))
            conn.commit()
    finally:
        conn.close()

# Insert Vé
def insert_ve(ma_ve, gia, ma_chuyen, ma_khach):
    query = "INSERT INTO VE (MaVe, GiaVe, MaChuyen, MaHanhKhach) VALUES (%s, %s, %s, %s)"
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma_ve, gia, ma_chuyen, ma_khach))
            conn.commit()
    finally:
        conn.close()

def get_all_ve():
    query = '''
        SELECT v.MaVe, v.GiaVe, t.TenTuyen, k.TenHanhKhach 
        FROM VE v
        JOIN CHUYEN_XE c ON v.MaChuyen = c.MaChuyen
        JOIN TUYEN_XE t ON c.MaTuyen = t.MaTuyen
        JOIN HANH_KHACH k ON v.MaHanhKhach = k.MaHanhKhach
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def tru_cho_ngoi(maChuyen):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # PostgreSQL dùng cú pháp UPDATE với FROM thay vì JOIN
            sql = '''
                UPDATE XE_BUS
                SET SoCho = SoCho - 1
                FROM CHUYEN_XE
                WHERE XE_BUS.MaXe = CHUYEN_XE.MaXe
                AND CHUYEN_XE.MaChuyen = %s
                AND XE_BUS.SoCho > 0
            '''
            
            cur.execute(sql, (maChuyen,))
            
            # rowcount cho biết số dòng đã được cập nhật
            affected = cur.rowcount 
            conn.commit()
            
            return affected > 0
    finally:
        conn.close()