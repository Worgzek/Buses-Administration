import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

# --- PHẦN KẾT NỐI ---
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        port=os.getenv('DB_PORT')
    )

# --- PHẦN TRUY VẤN (Các hàm nghiệp vụ) ---

def get_all_stations():
    """Truy vấn lấy danh sách bến xe"""
    query = "SELECT * FROM ben_xe"
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_station(ma, ten, diachi):
    """Truy vấn thêm bến xe mới"""
    query = "INSERT INTO ben_xe (mabenxe, tenbenxe, diachi) VALUES (%s, %s, %s)"
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, ten, diachi))
            conn.commit()
    finally:
        conn.close()

def get_revenue_report():
    """Truy vấn JOIN 3 bảng thống kê doanh thu"""
    query = """
        SELECT b.TenBenXe, SUM(v.GiaVe) AS TongDoanhThu
        FROM BEN_XE b 
        JOIN CHUYEN_XE c ON b.MaBenXe = c.MaBenDi
        JOIN VE v ON c.MaChuyen = v.MaChuyen
        GROUP BY b.TenBenXe;
    """
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()