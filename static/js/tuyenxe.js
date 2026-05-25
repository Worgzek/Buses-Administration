document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('section-tuyenxe')) {
        loadAllStationSelects();
    }
});

function loadTuyenXe() {
    fetch('/api/tuyenxe')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('table-body-tuyen');
            if (!tbody) return;
            tbody.innerHTML = '';

            data.forEach(t => {
                const ma = t[0];
                const giave = (parseFloat(t[4]) || 0).toLocaleString('vi-VN') + 'đ';
                const tenDau = t[2];  // Tên bến đi
                const tenCuoi = t[3]; // Tên bến đến

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="fw-bold text-primary">${ma}</span></td>
                    <td>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold">${tenDau} <i class="fas fa-arrow-right mx-1 small text-muted"></i> ${tenCuoi}</span>
                            <small class="text-muted">${t[1]}</small>
                        </div>
                    </td>
                    <td class="text-danger fw-bold">${giave}</td>
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
        .catch(err => console.error("Lỗi load bảng:", err));
}

async function loadAllStationSelects() {
    try {
        const res = await fetch('/api/stations');
        const stations = await res.json();
        
        // Danh sách các thẻ Select cần đổ dữ liệu
        const selectIds = ['tx-dau', 'tx-cuoi', 'edit-tx-dau', 'edit-tx-cuoi'];

        selectIds.forEach(id => {
            const sel = document.getElementById(id);
            if (!sel) return;

            sel.innerHTML = '<option value="">-- Chọn bến xe --</option>';
            stations.forEach(bx => {
                const op = document.createElement('option');
                op.value = bx.mabenxe || bx[0];
                op.textContent = bx.tenbenxe || bx[1];
                sel.appendChild(op);
            });
        });
    } catch (err) {
        console.error("Lỗi load danh sách bến:", err);
    }
}

function handleAddTuyen() {
    const ma = document.getElementById('tx-ma').value.trim();
    const selDau = document.getElementById('tx-dau');
    const selCuoi = document.getElementById('tx-cuoi');
    const gia = document.getElementById('tx-gia').value.trim();

    if (!ma || !selDau.value || !selCuoi.value || !gia) {
        alert("Vui lòng nhập mã tuyến, chọn bến đi/đến và nhập giá vé!");
        return;
    }

    const tenDau = selDau.options[selDau.selectedIndex].text;
    const tenCuoi = selCuoi.options[selCuoi.selectedIndex].text;

    const payload = {
        ma: ma,
        ten: `${tenDau} - ${tenCuoi}`,
        dau: selDau.value,
        cuoi: selCuoi.value,
        gia: parseFloat(gia)
    };

    fetch('/api/tuyenxe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Thêm tuyến thành công!");
            document.getElementById('tx-ma').value = '';
            document.getElementById('tx-gia').value = '';
            selDau.value = '';
            selCuoi.value = '';
            loadTuyenXe();
        } else {
            alert("Lỗi: " + data.message);
        }
    });
}

async function editTuyen(ma) {
    document.getElementById('display-ma-tx').innerText = ma;
    document.getElementById('edit-tx-ma').value = ma;

    try {
        await loadAllStationSelects();

        const res = await fetch(`/api/tuyenxe/${ma}`);
        const t = await res.json(); 

        document.getElementById('edit-tx-dau').value = t[2];
        document.getElementById('edit-tx-cuoi').value = t[3];
        document.getElementById('edit-tx-gia').value = t[4];

        new bootstrap.Modal(document.getElementById('editTuyenModal')).show();
    } catch (err) {
        console.error("Lỗi khi lấy thông tin tuyến:", err);
    }
}

function submitEditTuyen() {
    const ma = document.getElementById('edit-tx-ma').value;
    const selDau = document.getElementById('edit-tx-dau');
    const selCuoi = document.getElementById('edit-tx-cuoi');
    const gia = document.getElementById('edit-tx-gia').value;

    if (selDau.selectedIndex <= 0 || selCuoi.selectedIndex <= 0) {
        alert("Vui lòng chọn bến xe!");
        return;
    }

    const tenDau = selDau.options[selDau.selectedIndex].text;
    const tenCuoi = selCuoi.options[selCuoi.selectedIndex].text;

    const payload = {
        ma: ma,
        ten: `${tenDau} - ${tenCuoi}`,
        dau: selDau.value,
        cuoi: selCuoi.value,
        gia: parseFloat(gia)
    };

    fetch(`/api/tuyenxe/${ma}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        alert("Đã cập nhật tuyến xe!");
        const modalEl = document.getElementById('editTuyenModal');
        bootstrap.Modal.getInstance(modalEl).hide();
        loadTuyenXe();
    })
    .catch(err => console.error("Lỗi update:", err));
}

function deleteTuyen(ma) {
    if (!confirm(`Bạn có chắc muốn xóa tuyến ${ma} không?`)) return;

    fetch(`/api/tuyenxe/${ma}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        loadTuyenXe();
    });
}