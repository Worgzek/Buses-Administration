import psycopg2
from psycopg2.extras import RealDictCursor
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

#---Ben xe
def get_all_stations():
    query = '''
                SELECT * FROM ben_xe
                ORDER BY mabenxe ASC
            '''
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
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

#---Tuyen xe
def get_all_tuyen():
    query = '''
                select
                tuy.*
                ,ben.tenbenxe
                from tuyen_xe tuy
                left join ben_xe ben on tuy.mabenxe = ben.mabenxe   
                order by tuy.matuyen ASC           
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()
    finally:
        conn.close()

def add_tuyen(ma, ten, dau, cuoi, gia, maben):
    query = '''
                insert into tuyen_xe(matuyen, tentuyen, diemdau, diemcuoi, giave, mabenxe)
                values
                (%s,%s,%s,%s,%s,%s);
            '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query,(ma, ten, dau, cuoi, gia, maben))
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
        SELECT tuy.*, ben.tenbenxe 
        FROM tuyen_xe tuy
        LEFT JOIN ben_xe ben ON tuy.mabenxe = ben.mabenxe
        WHERE tuy.matuyen = %s
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ma,))
            return cur.fetchone()
    finally:
        conn.close()

def edit_tuyen(ma, ten, dau, cuoi, gia, maben):
    query = '''
        UPDATE tuyen_xe 
        SET tentuyen = %s, 
            diemdau = %s, 
            diemcuoi = %s, 
            giave = %s, 
            mabenxe = %s
        WHERE matuyen = %s
    '''
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (ten, dau, cuoi, gia, maben, ma))
            conn.commit()
    except Exception as e:
        print(f"Lỗi SQL Update: {e}")
        raise e
    finally:
        conn.close()