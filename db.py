import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():

    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        port=os.getenv('DB_PORT')
    )
    return conn

def fetch_all_trips():
    conn = get_db_connection()   
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM VE;')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    return rows
