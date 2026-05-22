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
        if "foreign key" in str(e).lower():
            return jsonify({"error": "Không thể xóa! Bến xe này đang có dữ liệu liên quan."}), 400
        return jsonify({"status": "error", "message": str(e)}), 500

# ----tuyen xe
@app.route('/api/tuyenxe', methods=['GET'])
def list_tuyen():
    data = db.get_all_tuyen()
    return jsonify(data)

@app.route('/api/tuyenxe', methods=['POST'])
def add_tuyen():
    req = request.json
    db.add_tuyen(req['ma'], req['ten'], req['dau'], req['cuoi'], req['gia'])
    return jsonify({"status":"success","message":"Đã thêm tuyến xe mới!"}),201

@app.route('/api/tuyenxe/<ma>', methods=['DELETE'])
def xoa_tuyen(ma):
    try:
        db.delete_tuyen(ma)
        return jsonify({"status": "success", "message": f"Đã xóa tuyến xe {ma} thành công!"}), 200
    except Exception as e:
        if "foreign key" in str(e).lower():
            return jsonify({"error": "Không thể xóa! Tuyến xe này đang có dữ liệu liên quan."}), 400
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/tuyenxe/<ma>', methods=['GET'])
def get_one_tuyen(ma):
    data = db.get_tuyen_by_id(ma)
    return jsonify(data)

@app.route('/api/tuyenxe/<ma>', methods=['PUT'])
def edit_tuyen(ma):
    req = request.json
    try:
        db.edit_tuyen(ma, req['ten'], req['dau'], req['cuoi'], req['gia'])
        return jsonify({"status": "success", "message": f"Đã cập nhật tuyến {ma} thành công!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#----XE
@app.route('/api/xe', methods=['GET'])
def get_xe():
    data = db.get_all_xe()
    return jsonify(data)

@app.route('/api/xe', methods=['POST'])
def add_xe_route():
    req = request.json
    try:
        ma = req.get('ma')
        bien = req.get('bien')
        cho = req.get('cho')
        tuyen = req.get('tuyen')

        if not ma or not bien or not cho:
            return jsonify({"status": "error", "message": "Mã xe, biển số và số chỗ không được để trống!"}), 400

        db.add_xe(ma, bien, cho, tuyen)
        status_msg = 'Sẵn sàng' if tuyen else 'Chưa gán tuyến'
        return jsonify({"status": "success", "message": f"Thành công! Xe hiện ở trạng thái: {status_msg}"}), 200

    except Exception as e:
        if "duplicate" in str(e).lower():
            return jsonify({"status": "error", "message": "Mã xe hoặc Biển số đã tồn tại trong hệ thống!"}), 400
        return jsonify({"status": "error", "message": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)

