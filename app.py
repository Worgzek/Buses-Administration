from flask import Flask, request, jsonify, render_template
import db  # Gọi file db.py chứa các hàm truy vấn SQL

app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')

# ----ben xe

@app.route('/api/stations', methods=['GET'])
def list_stations():
    data = db.get_all_stations()
    return jsonify(data)

@app.route('/api/stations', methods=['POST'])
def add_station():
    req = request.json
    db.add_station(req['ma'], req['ten'], req['diachi'])
    return jsonify({"status": "success", "message": "Đã thêm bến xe mới"}), 201

@app.route('/api/stations/<string:id>', methods=['PUT'])
def edit_station_route(id):
    try:
        data = request.json
        ten_moi = data.get('ten')
        diachi_moi = data.get('diachi')

        if not ten_moi or not diachi_moi:
            return jsonify({"error": "Thiếu dữ liệu Tên hoặc Địa chỉ!"}), 400
        db.edit_stations(ten_moi, diachi_moi, id)
        
        return jsonify({"message": "Cập nhật bến xe thành công!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stations/<string:id>', methods=['DELETE'])
def delete_station_route(id):
    try:
        db.delete_station(id)
        return jsonify({"message": f"Đã xóa bến xe {id} thành công!"}), 200
    except Exception as e:

        error_msg = str(e)
        if "foreign key" in error_msg.lower():
            return jsonify({"error": "Không thể xóa! Bến xe này đang có dữ liệu liên quan."}), 400
        return jsonify({"error": error_msg}), 500

# ----tuyen xe
@app.route('/api/tuyenxe', methods=['GET'])
def list_tuyen():
    data = db.get_all_tuyen()
    return jsonify(data)

@app.route('/api/tuyenxe', methods=['POST'])
def add_tuyen():
    req = request.json
    db.add_tuyen(req['ma'], req['ten'], req['dau'], req['cuoi'], req['gia'], req['maben'])
    return jsonify({"status":"success","message":"Đã thêm tuyến xe mới!"}),201

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)