function loadTuyenXe() {
    console.log("Hàm loadTuyenXe đang chạy với dữ liệu Index!");

    fetch('/api/tuyenxe')
        .then(res => res.json())
        .then(data => {
            console.log("Dữ liệu nhận được:", data);
            const tbody = document.getElementById('table-body-tuyen');
            if (!tbody) return;

            tbody.innerHTML = '';

            data.forEach(t => {
                const ma = t[0];
                const giave = parseFloat(t[4]) || 0;
                const formattedGia = giave.toLocaleString('vi-VN') + 'đ';
                const tenBen = t[6] || 'Chưa gán';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="fw-bold text-primary">${ma}</span></td>
                    <td>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold">${t[2]} <i class="fas fa-arrow-right mx-1 small text-muted"></i> ${t[3]}</span>
                            <small class="text-muted">${t[1]}</small>
                        </div>
                    </td>
                    <td class="text-danger fw-bold">${formattedGia}</td>
                    <td>
                        <span class="badge rounded-pill bg-info text-dark">
                            <i class="fas fa-map-marker-alt me-1"></i>${tenBen}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-light text-primary me-2" onclick="editTuyen('${ma}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-light text-danger" onclick="deleteTuyen('${ma}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Lỗi:", err));
}

function loadStationsForSelect() {
    fetch('/api/stations')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('tx-mabenxe');
            if (!select) return;

            select.innerHTML = '<option value="">-- Chọn bến xe quản lý --</option>';
            
            data.forEach(bx => {
                const ma = bx.mabenxe;
                const ten = bx.tenbenxe;
                
                const option = document.createElement('option');
                option.value = ma;
                option.textContent = `${ma} - ${ten}`;
                select.appendChild(option);
            });
        })
        .catch(err => console.error("Lỗi khi load danh sách bến vào select:", err));
}

function handleAddTuyen() {
    const ma = document.getElementById('tx-ma').value.trim();
    const dau = document.getElementById('tx-dau').value.trim();
    const cuoi = document.getElementById('tx-cuoi').value.trim();
    const gia = document.getElementById('tx-gia').value.trim();
    const maben = document.getElementById('tx-mabenxe').value; // Mã bến xe lấy từ Dropdown

    // 2. Validate nhanh
    if (!ma || !dau || !cuoi || !gia || !maben) {
        alert("Quốc Jack ơi, điền đủ các ô rồi mới lưu được nhé!");
        return;
    }

    const payload = {
        ma: ma,
        ten: `${dau} - ${cuoi}`, 
        dau: dau,
        cuoi: cuoi,
        gia: parseFloat(gia),
        maben: maben
    };

    fetch('/api/tuyenxe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            document.querySelectorAll('#section-tuyenxe input').forEach(i => i.value = '');
            loadTuyenXe();
        } else {
            alert("Lỗi: " + data.message);
        }
    })
    .catch(err => console.error("Lỗi khi thêm tuyến:", err));
}

function deleteTuyen(ma) {
    if (!confirm(`Bạn ccó chắc muốn xóa tuyến ${ma} không?`)) return;

    fetch(`/api/tuyenxe/${ma}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            loadTuyenXe();
        } else {
            alert("Lỗi: " + data.error);
        }
    })
    .catch(err => console.error("Lỗi xóa:", err));
}

async function editTuyen(ma) {
    // 1. Hiện mã tuyến lên Modal trước
    document.getElementById('display-ma-tx').innerText = ma;
    document.getElementById('edit-tx-ma').value = ma;

    try {
        // 2. Load danh sách tất cả các bến vào Dropdown (Dropbox)
        const resBen = await fetch('/api/stations'); // Route lấy list bến xe của ông
        const listBen = await resBen.json();
        const selectBen = document.getElementById('edit-tx-mabenxe');
        selectBen.innerHTML = '';
        
        listBen.forEach(bx => {
            // Lưu ý: Nếu listBen trả về Array thô thì dùng bx[0], bx[1]
            // Nếu trả về Object thì dùng bx.mabenxe, bx.tenbenxe
            const option = document.createElement('option');
            option.value = bx.mabenxe || bx[0];
            option.textContent = bx.tenbenxe || bx[1];
            selectBen.appendChild(option);
        });

        // 3. Lấy dữ liệu hiện tại của tuyến này để điền vào form
        const resTuyen = await fetch(`/api/tuyenxe/${ma}`);
        const t = await resTuyen.json();

        // Giả sử t là mảng index theo db.py ở trên: 0:matuyen, 2:diemdau, 3:diemcuoi, 4:giave, 5:mabenxe
        document.getElementById('edit-tx-dau').value = t[2];
        document.getElementById('edit-tx-cuoi').value = t[3];
        document.getElementById('edit-tx-gia').value = t[4];
        document.getElementById('edit-tx-mabenxe').value = t[5]; // Tự động chọn đúng bến xe cũ

        // 4. Mở Modal
        new bootstrap.Modal(document.getElementById('editTuyenModal')).show();

    } catch (err) {
        console.error("Lỗi khi chuẩn bị Modal Edit:", err);
    }
}

function submitEditTuyen() {
    const ma = document.getElementById('edit-tx-ma').value;
    const dau = document.getElementById('edit-tx-dau').value;
    const cuoi = document.getElementById('edit-tx-cuoi').value;
    const gia = document.getElementById('edit-tx-gia').value;
    const maben = document.getElementById('edit-tx-mabenxe').value;

    const payload = {
        ma: ma,
        ten: `${dau} - ${cuoi}`, // TỰ ĐỘNG GEN TÊN TUYẾN Ở ĐÂY
        dau: dau,
        cuoi: cuoi,
        gia: parseFloat(gia),
        maben: maben
    };

    fetch(`/api/tuyenxe/${ma}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        alert("Cập nhật thành công!");
        // Đóng modal
        const modalEl = document.getElementById('editTuyenModal');
        bootstrap.Modal.getInstance(modalEl).hide();
        // Load lại bảng
        loadTuyenXe();
    });
}