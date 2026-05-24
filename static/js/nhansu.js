function loadBenXeSelect() {
    const selectBen = document.getElementById('nv-benxe');
    if (!selectBen) return;

    fetch('/api/stations')
        .then(res => res.json())
        .then(data => {
            selectBen.innerHTML = '<option value="">-- Chọn bến xe đảm nhận --</option>';
            
            data.forEach(ben => {
                let ma, ten;
                                if (Array.isArray(ben)) {
                    ma = ben[0];
                    ten = ben[1];
                } 
                else {
                    ma = ben.Ma || ben.MaBen || ben.ma;
                    ten = ben.Ten || ben.TenBen || ben.ten;
                }

                if (ma && ten) {
                    const option = document.createElement('option');
                    option.value = ma;
                    option.textContent = ten;
                    selectBen.appendChild(option);
                }
            });
        })
        .catch(err => console.error("Lỗi khi load bến xe vào select:", err));
}
function loadNhanVien() {
    const tbody = document.getElementById('table-body-nv');
    if (!tbody) return;

    fetch('/api/nhanvien')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(nv => {
                // SỬA TẠI ĐÂY: Dùng tên Key chính xác từ ảnh Console của ông
                const ma = nv.Ma || 'N/A';
                const ten = nv.Ten || 'N/A';
                const chucVu = nv.ChucVu || 'N/A';
                const sdt = nv.SDT || 'N/A';
                const maBen = nv.MaBen || 'Chưa gán';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="fw-bold text-primary">${ma}</span></td>
                    <td>${ten}</td>
                    <td><span class="badge bg-info text-dark">${chucVu}</span></td>
                    <td><i class="fas fa-phone-alt me-2 text-secondary small"></i>${sdt}</td>
                    <td>${maBen}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-light text-primary me-1" onclick="editNhanVien('${ma}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-light text-danger" onclick="deleteNhanVien('${ma}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error('Lỗi load nhân viên:', err));
}

function loadTaiXe() {
    const tbody = document.getElementById('table-body-tx');
    if (!tbody) return;

    fetch('/api/taixe')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(tx => {
                const ma = tx.Ma || tx[0] || 'N/A';
                const ten = tx.Ten || tx[1] || 'N/A';
                const sdt = tx.SDT || tx[2] || 'N/A';
                const bangLai = tx.BangLai || tx[3] || 'N/A';
                const trangThai = tx.TrangThai || tx[4] || 'Sẵn sàng';


                let statusClass = '';
                if (trangThai.includes('chạy')) {
                    statusClass = 'bg-warning-subtle text-warning'; // Màu vàng nhạt
                } else if (trangThai === 'Sẵn sàng') {
                    statusClass = 'bg-success-subtle text-success'; // Màu xanh nhạt
                } else if (trangThai === 'Nghỉ') {
                    statusClass = 'bg-danger-subtle text-danger';   // Màu đỏ nhạt
                } else {
                    statusClass = 'bg-secondary-subtle text-secondary'; // Màu xám nhạt
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="align-middle">
                        <span class="fw-bold text-primary">${ma}</span>
                    </td>
                    <td class="align-middle">${ten}</td>
                    <td class="align-middle">
                        <span class="badge bg-dark px-2">${bangLai}</span>
                    </td>
                    <td class="align-middle">
                        <i class="fas fa-phone-alt me-2 text-secondary small"></i>
                        <span>${sdt}</span>
                    </td>
                    <td class="align-middle">
                        <span class="badge ${statusClass} px-3">${trangThai}</span>
                    </td>
                    <td class="text-center align-middle">
                        <button class="btn btn-sm btn-light text-primary me-2" onclick="editTaiXe('${ma}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-light text-danger" onclick="deleteTaiXe('${ma}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Lỗi load tài xế:', err);
        });
}

async function handleAddNhanVien() {
    const ma = document.getElementById('nv-ma').value.trim();
    const ten = document.getElementById('nv-ten').value.trim();
    const chucvu = document.getElementById('nv-chucvu').value;
    const sdt = document.getElementById('nv-sdt').value.trim();
    const maben = document.getElementById('nv-benxe').value;

    if (!ma || !ten) {
        alert("Vui lòng nhập Mã và Tên!");
        return;
    }
    const payload = {
        ma: ma,
        ten: ten,
        sdt: sdt,
        chucvu: chucvu,
        maben: maben
    };

    try {
        const response = await fetch('/api/nhanvien', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            loadNhanVien(); 
            document.getElementById('nv-ma').value = '';
            document.getElementById('nv-ten').value = '';
            document.getElementById('nv-sdt').value = '';
        } else {
            alert("Lỗi: " + (result.error || "Không xác định"));
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}
async function handleAddTaiXe() {
    const ma = document.getElementById('tx-matx').value.trim();
    const ten = document.getElementById('tx-ten').value.trim();
    const sdt = document.getElementById('tx-sdt').value.trim();
    const bang = document.getElementById('tx-bang').value; 
    
    const trangthai = document.getElementById('tx-trangthai')?.value || "Sẵn sàng";

    if (!ma || !ten || !sdt || !bang) {
        alert("Vui lòng nhập đủ Mã, Tên, SĐT và CHỌN HẠNG BẰNG!");
        return;
    }

    const payload = {
        ma: ma,
        ten: ten,
        sdt: sdt,
        banglai: bang,
        trangthai: trangthai
    };

    console.log("Đang gửi dữ liệu:", payload);

    try {
        const response = await fetch('/api/taixe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Thêm tài xế thành công!");
            if (typeof loadTaiXe === 'function') loadTaiXe();
            
            document.getElementById('tx-matx').value = '';
            document.getElementById('tx-ten').value = '';
            document.getElementById('tx-sdt').value = '';
            document.getElementById('tx-bang').value = ''; 
            if (document.getElementById('tx-trangthai')) {
                document.getElementById('tx-trangthai').value = 'Sẵn sàng';
            }
        } else {
            alert("Lỗi: " + (result.error || "Không thể thêm tài xế"));
        }
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
        alert("Không thể kết nối tới server!");
    }
}

async function deleteNhanVien(ma) {
    if (!confirm(`Xóa nhân viên ${ma}?`)) return;

    const res = await fetch(`/api/nhanvien/${ma}`, { method: 'DELETE' });
    if (res.ok) {
        loadNhanVien();
    } else {
        alert("Lỗi xóa nhân viên!");
    }
}

async function deleteTaiXe(ma) {
    // 1. Hỏi xác nhận trước khi xóa (Cho chuyên nghiệp)
    if (!confirm(`Bạn có chắc chắn muốn xóa tài xế có mã ${ma} không?`)) {
        return;
    }
    try {
        const response = await fetch(`/api/taixe/${ma}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            loadTaiXe(); 
        } else {
            alert("Lỗi: " + (result.error || result.message));
        }
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Không thể kết nối đến server để xóa tài xế!");
    }
}

async function editTaiXe(ma) {
    try {
        const res = await fetch(`/api/taixe/${ma}`);
        const tx = await res.json();

        if (res.ok) {
            document.getElementById('display-ma-tx').innerText = ma;
            document.getElementById('edit-tx-ma').value = ma;
            document.getElementById('edit-tx-ten').value = tx.Ten || tx[1];
            document.getElementById('edit-tx-sdt').value = tx.SDT || tx[2];
            document.getElementById('edit-tx-bang').value = tx.BangLai || tx[3];

            // Xử lý đổ Option cho Trạng thái
            const statusSelect = document.getElementById('edit-tx-trangthai');
            const currentStatus = tx.TrangThai || tx[4];
            
            let options = `<option value="${currentStatus}" selected>${currentStatus} (Hiện tại)</option>`;
            
            // Nếu trạng thái hiện tại chưa phải là "Nghỉ", thì mới thêm option "Nghỉ"
            if (currentStatus !== "Nghỉ") {
                options += `<option value="Nghỉ">Nghỉ</option>`;
            } else {
                // Nếu đang "Nghỉ", có thể cho họ quay lại "Sẵn sàng" để hệ thống tính tiếp
                options += `<option value="Sẵn sàng">Kích hoạt lại (Sẵn sàng)</option>`;
            }
            
            statusSelect.innerHTML = options;

            const editModal = new bootstrap.Modal(document.getElementById('editTaiXeModal'));
            editModal.show();
        }
    } catch (e) {
        console.error(e);
    }
}

async function submitEditTaiXe() {
    const ma = document.getElementById('edit-tx-ma').value;
    
    // Gom đủ bộ tứ "Full Combo" mà Backend yêu cầu
    const payload = {
        ten: document.getElementById('edit-tx-ten').value.trim(),
        sdt: document.getElementById('edit-tx-sdt').value.trim(),
        banglai: document.getElementById('edit-tx-bang').value,
        trangthai: document.getElementById('edit-tx-trangthai').value
    };

    // Kiểm tra nhanh ở Frontend trước khi gửi
    if (!payload.ten || !payload.sdt || !payload.banglai || !payload.trangthai) {
        alert("Vui lòng nhập đầy đủ thông tin: Tên, SĐT, Bằng lái và Trạng thái!");
        return;
    }

    try {
        const res = await fetch(`/api/taixe/${ma}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
            alert("Cập nhật thành công!");
            
            // Đóng modal sau khi xong
            const modalElem = document.getElementById('editTaiXeModal');
            const modal = bootstrap.Modal.getInstance(modalElem);
            modal.hide();

            // Load lại bảng để thấy dữ liệu mới ngay lập tức
            loadTaiXe(); 
        } else {
            // Hiển thị lỗi từ Backend (Ví dụ: "Thiếu thông tin: ten")
            alert("Lỗi: " + (result.error || "Không thể cập nhật"));
        }
    } catch (e) {
        alert("Lỗi kết nối server!");
    }
}