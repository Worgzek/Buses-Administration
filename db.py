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
            VALUES (%s, %s, %s, %s, %s)
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma, bien, cho, ttg, ma_tuyen))
            conn.commit()
    finally:
        conn.close()