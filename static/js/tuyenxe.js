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

                const giave = parseFloat(t[4]) || 0;
                const formattedGia = giave.toLocaleString('vi-VN') + 'đ';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="fw-bold text-primary">${t[0]}</span></td>
                    <td>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold">${t[2]} <i class="fas fa-arrow-right mx-1 small text-muted"></i> ${t[3]}</span>
                            <small class="text-muted">${t[1]}</small>
                        </div>
                    </td>
                    <td class="text-danger fw-bold">${formattedGia}</td>
                    <td>
                        <span class="badge rounded-pill bg-info text-dark">
                            <i class="fas fa-map-marker-alt me-1"></i>${t[6] || 'Chưa gán'}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-warning me-1"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
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

// 3. Hàm xử lý thêm tuyến mới
function handleAddTuyen() {
    // 1. Lấy dữ liệu từ các ô nhập
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

    // 3. Đóng gói dữ liệu gửi lên (Key phải khớp với req['...'] trong Python)
    const payload = {
        ma: ma,
        ten: `${dau} - ${cuoi}`, // Tự động tạo tên tuyến
        dau: dau,
        cuoi: cuoi,
        gia: parseFloat(gia),
        maben: maben
    };

    // 4. Gọi API
    fetch('/api/tuyenxe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            // Xóa sạch các ô nhập sau khi thêm thành công
            document.querySelectorAll('#section-tuyenxe input').forEach(i => i.value = '');
            // Load lại bảng ngay và luôn
            loadTuyenXe();
        } else {
            alert("Lỗi: " + data.message);
        }
    })
    .catch(err => console.error("Lỗi khi thêm tuyến:", err));
}