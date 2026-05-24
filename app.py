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
    
@app.route('/api/xe/<ma>', methods=['DELETE'])
def delete_xe(ma):
    try:
        db.xoa_xe(ma)
        return jsonify({"status": "success", "message": f"Đã xóa xe {ma} thành công!"}), 200
    except Exception as e:
        if "foreign key" in str(e).lower():
            return jsonify({"error": "Không thể xóa! Xe này đang có dữ liệu liên quan."}), 400
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/xe/<ma>', methods=['GET'])
def get_one_xe(ma):
    xe = db.get_one_xe(ma)
    if xe:
        return jsonify({
            "MaXe": xe,
            "BienSo": xe[0],
            "SoCho": xe[1],
            "MaTuyen": xe[2]
        })
    return jsonify({"error": "Không tìm thấy xe"}), 404

@app.route('/api/xe/<ma>', methods=['PUT'])
def edit_xe_route(ma):
    req = request.json
    try:
        bien = req.get('bien')
        cho = req.get('cho')
        tuyen = req.get('tuyen')

        if not bien or not cho:
            return jsonify({"status": "error", "message": "Biển số và số chỗ không được để trống!"}), 400

        ma_tuyen = tuyen if tuyen and str(tuyen).strip() != "" else None
        trang_thai_moi = 'Sẵn sàng' if ma_tuyen else 'Chưa gán tuyến'

        db.update_xe(ma, bien, cho, ma_tuyen, trang_thai_moi)
        
        return jsonify({
            "status": "success", 
            "message": f"Cập nhật xe {ma} thành công!",
            "new_status": trang_thai_moi
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": f"Lỗi server: {str(e)}"}), 500
  
#---Nhan vien &ttai xe

@app.route('/api/nhanvien', methods=['GET'])
def get_nhan_vien():
    try:
        data = db.get_all_nhan_vien()
        result = []
        for row in data:
            result.append({
                "Ma": row[0],
                "Ten": row[1],
                "SDT": row[2],
                "ChucVu": row[3],
                "MaBen": row[4]
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/nhanvien', methods=['POST'])
def post_nhan_vien():
    req = request.json
    try:
        db.add_nhan_vien(req['ma'], req['ten'], req['sdt'], req['chucvu'], req['maben'])
        return jsonify({"message": "Thêm nhân viên thành công!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/taixe', methods=['GET'])
def get_tai_xe():
    try:
        data = db.get_all_tai_xe()
        result = []
        for row in data:
            result.append({
                "Ma": row[0],
                "Ten": row[1],
                "SDT": row[2],
                "BangLai": row[3],
                "TrangThai": row[4]

            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/taixe', methods=['POST'])
def post_tai_xe():
    req = request.json
    try:
        db.add_tai_xe(req['ma'], req['ten'], req['sdt'], req['banglai'], req['trangthai'])
        return jsonify({"message": "Thêm tài xế thành công!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/nhanvien/<ma>', methods=['DELETE'])
def xoa_nv(ma):
    db.delete_nv(ma)
    return jsonify({"status": "success", "message": f"Đã xóa {ma} thành công!"}), 200

@app.route('/api/taixe/<ma>', methods=['DELETE'])
def delete_tx(ma):
    try:
        db.delete_tx(ma)
        return jsonify({"status": "success", "message": f"Đã xóa tài xế {ma} thành công!"}), 200
    except Exception as e:
        if "foreign key" in str(e).lower():
            return jsonify({"error": "Không thể xóa! Tài xế này đang có chuyến"}), 400
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/api/taixe/<ma>', methods=['GET'])
def get_mot_taixe(ma):
    data = db.get_tx_by_id(ma)
    if data:
        return jsonify(data), 200
    return jsonify({"error": "Không tìm thấy"}), 404

@app.route('/api/taixe/<ma>', methods=['PUT'])
def update_taixe(ma):
    req = request.json
    try:
        db.update_tai_xe(ma, req['ten'], req['sdt'], req['banglai'], req['trangthai'])
        return jsonify({"message": "Cập nhật thành công!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/nhanvien/<ma>', methods=['GET'])
def get_mot_nhanvien(ma):
    data = db.get_nv_by_id(ma)
    if data:
        return jsonify(data), 200
    return jsonify({"error": "Không tìm thấy"}), 404

@app.route('/api/nhanvien/<ma>', methods=['PUT'])
def update_nhanvien(ma):
    req = request.json
    try:
        db.update_nv(ma, req['ten'], req['sdt'], req['chucvu'], req['maben'])
        return jsonify({"message": "Cập nhật thành công!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)

