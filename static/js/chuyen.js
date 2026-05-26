async function loadChuyenXe() {
    try {
        const res = await fetch('/api/chuyen');
        const data = await res.json();
        const tbody = document.getElementById('table-body-chuyen');
        if (!tbody) {
            console.error("Không tìm thấy tbody với id 'table-body-chuyen'");
            return;
        }

        tbody.innerHTML = ''; 

        data.forEach(c => {
            const ma = c[0]; 
            const thoiGian = c[1];
            const bienSo = c[2];
            const tenTuyen = c[3];
            const taiXe = c[4] || 'Chưa cập nhật';
            const trangThai = c[5] || 'Chưa cập nhật';
            
            const time = thoiGian ? thoiGian.substring(0, 23) : 'N/A';

            let statusClass = '';
            if (trangThai.includes('Đang chạy') || trangThai.includes('Đang chạy')) statusClass = 'bg-warning-subtle text-warning';
            else if (trangThai === 'Sẵn sàng') statusClass = 'bg-success-subtle text-success';
            else if (trangThai === 'Hủy') statusClass = 'bg-danger-subtle text-danger';
            else statusClass = 'bg-secondary-subtle text-secondary';

            const row = `<tr>
                <td><span class="fw-bold text-primary">${ma}</span></td>
                <td>${time}</td>
                <td><span class="badge bg-dark px-2">${bienSo}</span></td>
                <td>${tenTuyen}</td>
                <td>${taiXe}</td>
                <td><span class="badge ${statusClass} px-3">${trangThai}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-light text-primary me-2" onclick="editChuyen('${ma}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-light text-danger" onclick="deleteChuyen('${ma}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
        console.log("Đổ dữ liệu hoàn tất!");
    } catch (e) {
        console.error("Lỗi xảy ra trong loadChuyenXe:", e);
    }
}

async function initChuyenForm() {
    try {
        const [resTuyen, resXe, resTaiXe] = await Promise.all([
            fetch('/api/tuyenxe'),
            fetch('/api/xe'),
            fetch('/api/taixe')
        ]);

        const data = await Promise.all([resTuyen.json(), resXe.json(), resTaiXe.json()]);
        
        // Ép kiểu cho các mảng
        const tuyens = data[0].map(t => ({ id: t[0], name: t[1] }));
        const xes = data[1].map(x => ({ id: x[0], name: x[1] }));
        const taixes = data[2].map(tx => ({ id: tx.Ma, name: tx.Ten }));

        const populateSelect = (elementId, list, prefix) => {
            const el = document.getElementById(elementId);
            
            let html = `<option value="">--Chọn--</option>`;            
            html += list.map(item => 
                `<option value="${item.id}">${prefix ? item.id + ' - ' : ''}${item.name}</option>`
            ).join('');
            
            el.innerHTML = html;
        };

        populateSelect('cx-tuyen', tuyens, true);
        populateSelect('cx-xe', xes, false);
        populateSelect('cx-taixe', taixes, false);

        populateSelect('edit-cx-tuyen', tuyens, true);
        populateSelect('edit-cx-xe', xes, false);
        populateSelect('edit-cx-taixe', taixes, false);
        
    } catch (e) {
        console.error("Lỗi:", e);
    }
}

function deleteChuyen(ma) {
    if (confirm(`Bạn chắc chắn muốn xóa chuyến ${ma} không?`)) {
        fetch(`/api/chuyen/${ma}`, { method: 'DELETE' })
        .then(res => {
            if (res.ok) {
                alert('Xóa thành công!');
                loadChuyenXe();
            } else {
                alert('Không thể xóa! Chuyến này đang hoạt động');
            }
        });
    }
}

async function handleAddChuyen() {
    // 1. Lấy dữ  từ form
    const payload = {
        maChuyen: document.getElementById('cx-ma').value,
        thoiGian: document.getElementById('cx-thoigian').value,
        maTuyen: document.getElementById('cx-tuyen').value,
        maXe: document.getElementById('cx-xe').value,
        maTaiXe: document.getElementById('cx-taixe').value
    };

    if (!payload.maChuyen || !payload.thoiGian || !payload.maTuyen || !payload.maXe) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    try {
        const res = await fetch('/api/chuyen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
            alert("Thêm chuyến xe thành công!");
            // 3. Reset form và load lại bảng
            document.getElementById('cx-ma').value = '';
            document.getElementById('cx-thoigian').value = '';
            loadChuyenXe(); 
        } else {
            alert("Lỗi: " + (result.message || "Không thể thêm chuyến xe"));
        }
    } catch (e) {
        console.error("Lỗi khi thêm:", e);
        alert("Có lỗi xảy ra khi kết nối tới server!");
    }
}

async function editChuyen(ma) {
    const res = await fetch(`/api/chuyen/${ma}`);
    const data = await res.json(); 
    console.log("Dữ liệu nhận được:", data);

    document.getElementById('edit-cx-ma').value = data[0];
    document.getElementById('display-ma-chuyen').innerText = data[0];
    document.getElementById('edit-cx-thoigian').value = data[1]    
    document.getElementById('edit-cx-xe').value = data[2];
    document.getElementById('edit-cx-tuyen').value = data[3];
    document.getElementById('edit-cx-taixe').value = data[4]; 

    new bootstrap.Modal(document.getElementById('editChuyenModal')).show();
}

async function submitEditChuyen() {
    const payload = {
        thoiGian: document.getElementById('edit-cx-thoigian').value,
        maTuyen: document.getElementById('edit-cx-tuyen').value,
        maXe: document.getElementById('edit-cx-xe').value,
        maTaiXe: document.getElementById('edit-cx-taixe').value,
        trangThai: 'Sẵn sàng'
    };
    const ma = document.getElementById('edit-cx-ma').value;

    try {
        const res = await fetch(`/api/chuyen/${ma}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Cập nhật thành công!");
            bootstrap.Modal.getInstance(document.getElementById('editChuyenModal')).hide();
            loadChuyenXe();
        } else {
            const errorData = await res.json();
            alert("Cập nhật thất bại:");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối đến máy chủ để cập nhật!");
    }
}