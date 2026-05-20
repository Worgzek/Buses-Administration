from flask import Flask, request, jsonify
import db  # Gọi file db.py chứa các hàm truy vấn SQL

app = Flask(__name__)

# ---------------------------------------------------------
# 1. NHÓM TRUY VẤN (SELECT)
# ---------------------------------------------------------

@app.route('/stations', methods=['GET'])
def list_stations():
    """Lấy danh sách tất cả bến xe"""
    data = db.get_all_stations()
    return jsonify(data)

@app.route('/reports/revenue', methods=['GET'])
def show_revenue():
    """Lấy báo cáo doanh thu (Truy vấn 3 bảng)"""
    data = db.get_revenue_report()
    return jsonify(data)

@app.route('/drivers/busy', methods=['GET'])
def list_busy_drivers():
    """Lấy danh sách tài xế chạy nhiều chuyến (HAVING)"""
    data = db.get_busy_drivers()
    return jsonify(data)


# ---------------------------------------------------------
# 2. NHÓM THAY ĐỔI DỮ LIỆU (INSERT, UPDATE, DELETE)
# ---------------------------------------------------------

@app.route('/stations', methods=['POST'])
def add_station():
    """Thêm bến xe mới"""
    req = request.json
    db.add_station(req['ma'], req['ten'], req['diachi'])
    return jsonify({"status": "success", "message": "Đã thêm bến xe mới"}), 201

@app.route('/tickets/<ma_ve>', methods=['PUT'])
def update_price(ma_ve):
    """Cập nhật giá vé"""
    new_price = request.json.get('gia_moi')
    db.update_ticket_price(ma_ve, new_price)
    return jsonify({"status": "success", "message": f"Đã cập nhật vé {ma_ve}"})

@app.route('/tickets/<ma_ve>', methods=['DELETE'])
def delete_ticket(ma_ve):
    """Xóa một vé xe"""
    db.delete_ticket(ma_ve)
    return jsonify({"status": "success", "message": f"Đã xóa vé {ma_ve}"})


if __name__ == '__main__':
    # Chạy Flask app
    app.run(debug=True,host='0.0.0.0', port=5000)