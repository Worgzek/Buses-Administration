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
            const choConLai = c[6]; 
            
            const time = thoiGian ? thoiGian.substring(0, 22) : 'N/A';

            const isLocked = (trangThai === 'Đang hoạt động');
            
            let choDisplay = (choConLai <= 0) 
                ? '<span class="text-danger fw-bold">Hết chỗ</span>' 
                : `<span class="text-primary fw-bold">${choConLai}</span>`;

            let statusClass = '';
            if (trangThai === 'Đang hoạt động') statusClass = 'bg-warning-subtle text-warning';
            else if (trangThai === 'Sẵn sàng') statusClass = 'bg-success-subtle text-success';
            else if (trangThai === 'Hủy') statusClass = 'bg-danger-subtle text-danger';
            else statusClass = 'bg-secondary-subtle text-secondary';

            const row = `<tr>
                <td><span class="fw-bold text-primary">${ma}</span></td>
                <td>${time}</td>
                <td><span class="badge bg-dark px-2">${bienSo}</span></td>
                <td>${tenTuyen}</td>
                <td>${taiXe}</td>
                <td>${choDisplay}</td>
                <td><span class="badge ${statusClass} px-3">${trangThai}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm ${isLocked ? 'btn-outline-secondary' : 'btn-light text-primary'} me-2" 
                            onclick="${isLocked ? '' : `editChuyen('${ma}')`}" 
                            ${isLocked ? 'disabled title="Chuyến đang hoạt động, không thể sửa"' : ''}>
                        <i class="fas ${isLocked ? 'fa-lock' : 'fa-edit'}"></i>
                    </button>
                    
                    <button class="btn btn-sm ${isLocked ? 'btn-outline-secondary' : 'btn-light text-danger'}" 
                            onclick="${isLocked ? '' : `deleteChuyen('${ma}')`}"
                            ${isLocked ? 'disabled title="Chuyến đang hoạt động, không thể xóa"' : ''}>
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

async function initChuyenForm(maChuyenDangSua = null) {
    try {
        // 1. Fetch Tuyến và Tài xế (Xe sẽ load theo Tuyến sau)
        const [resTuyen, resTaiXeFull] = await Promise.all([
            fetch('/api/tuyenxe'), 
            fetch('/api/tai-xe-available')
        ]);
        
        // 2. Xử lý tài xế cho form Edit
        let taixesEdit = [];
        if (maChuyenDangSua) {
            const resTaiXeEdit = await fetch(`/api/tai-xe-available?maChuyen=${maChuyenDangSua}`);
            taixesEdit = await resTaiXeEdit.json();
        }

        const tuyens = (await resTuyen.json()).map(t => ({ id: t[0], name: t[1] }));
        const taixesFull = await resTaiXeFull.json();
        if (!maChuyenDangSua) taixesEdit = taixesFull;

        const populateSelect = (elementId, list, prefix) => {
            const el = document.getElementById(elementId);
            if (!el) return;
            let html = `<option value="">--Chọn--</option>`;            
            html += list.map(item => 
                `<option value="${item.id || item.ma}">${prefix ? (item.id || item.ma) + ' - ' : ''}${item.name || item.ten}</option>`
            ).join('');
            el.innerHTML = html;
        };

        // Đổ dữ liệu
        populateSelect('cx-tuyen', tuyens, true);
        populateSelect('cx-taixe', taixesFull, false);
        populateSelect('edit-cx-tuyen', tuyens, true);
        populateSelect('edit-cx-taixe', taixesEdit, false);

// Thay vì addEventListener, ta gán trực tiếp vào thuộc tính onchange
        const bindXeEvent = (tuyenId, xeId) => {
            const el = document.getElementById(tuyenId);
            
            el.onchange = async function() {
                const maTuyen = this.value;
                const xeSelect = document.getElementById(xeId);
                
                // Luôn luôn reset sạch sẽ bằng cách gán lại từ đầu
                xeSelect.innerHTML = '<option value="">--Chọn--</option>';
                
                if (!maTuyen) return;

                const res = await fetch(`/api/xe-theo-tuyen/${maTuyen}`);
                const xes = await res.json();
                
                // Đổ dữ liệu vào
                xeSelect.innerHTML += xes.map(x => 
                    `<option value="${x.MaXe}">${x.BienSo}</option>`
                ).join('');
            };
        };

        bindXeEvent('cx-tuyen', 'cx-xe');
        bindXeEvent('edit-cx-tuyen', 'edit-cx-xe');

    } catch (e) {
        console.error("Lỗi khởi tạo form:", e);
    }
}

function deleteChuyen(ma) {
    if (confirm(`Bạn chắc chắn muốn xóa chuyến ${ma} không?`)) {
        fetch(`/api/chuyen/${ma}`, { method: 'DELETE' })
        .then(res => {
            if (res.ok) {
                alert('Xóa thành công!');
                loadChuyenXe();
                initChuyenForm();

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
    try {
        // 1. Lấy dữ liệu chuyến
        const res = await fetch(`/api/chuyen/${ma}`);
        const data = await res.json();
        const taiXeCu = data[4];
        const maTuyen = data[3]; // Lấy tuyến của chuyến cũ
        const maXe = data[2];    // Lấy xe của chuyến cũ

        // 2. Nạp form (Tuyến, Tài xế đã có sẵn)
        await initChuyenForm(ma);

        // 3. ĐẶC BIỆT: Load lại danh sách xe của tuyến đó ngay lập tức
        const resXe = await fetch(`/api/xe-theo-tuyen/${maTuyen}`);
        const xes = await resXe.json();
        
        const selectXe = document.getElementById('edit-cx-xe');
        selectXe.innerHTML = '<option value="">--Chọn--</option>' + 
            xes.map(x => `<option value="${x.MaXe}">${x.BienSo}</option>`).join('');

        // 4. Xử lý tài xế cũ (giữ nguyên logic của bạn)
        const selectTX = document.getElementById('edit-cx-taixe');
        if (!Array.from(selectTX.options).some(o => o.value === taiXeCu) && taiXeCu) {
            let opt = document.createElement('option');
            opt.value = taiXeCu;
            opt.text = "Tài xế hiện tại: " + taiXeCu; 
            selectTX.appendChild(opt);
        }

        // 5. Gán dữ liệu (Bây giờ dropdown Xe đã có dữ liệu rồi nên sẽ chọn được)
        document.getElementById('edit-cx-ma').value = data[0];
        document.getElementById('display-ma-chuyen').innerText = data[0];
        document.getElementById('edit-cx-thoigian').value = data[1];
        document.getElementById('edit-cx-tuyen').value = maTuyen;
        document.getElementById('edit-cx-xe').value = maXe; // Bây giờ dòng này mới chạy đúng!
        document.getElementById('edit-cx-taixe').value = taiXeCu;

        new bootstrap.Modal(document.getElementById('editChuyenModal')).show();
    } catch (e) {
        console.error("Lỗi:", e);
    }
}
async function submitEditChuyen() {
    const ma = document.getElementById('edit-cx-ma').value;
    const selectTX = document.getElementById('edit-cx-taixe');
    const maTaiXe = selectTX.value;

    // 1. Nếu chọn trống, chặn lại và tự điền lại dữ liệu cũ
    if (!maTaiXe || maTaiXe === "") {
        alert("Vui lòng chọn tài xế! Hệ thống sẽ khôi phục lại dữ liệu gốc.");
        
        // Bước A: Load lại các option cho Dropbox (để đảm bảo không bị trống)
        await initChuyenForm(ma); 
        
        // Bước B: Fetch lại dữ liệu gốc của chuyến đó
        const res = await fetch(`/api/chuyen/${ma}`);
        const data = await res.json();
        
        // Bước C: Điền lại TẤT CẢ các trường (Tuyến, Xe, Tài xế) để không bị reset
        document.getElementById('edit-cx-thoigian').value = data[1];
        document.getElementById('edit-cx-xe').value = data[2];
        document.getElementById('edit-cx-tuyen').value = data[3];
        document.getElementById('edit-cx-taixe').value = data[4]; // Trả lại ông tài xế cũ
        
        // KHÔNG gọi editChuyen(ma) ở đây nữa để tránh bị đen màn hình
        return; 
    }

    // ... (Phần payload và fetch PUT bên dưới ông giữ nguyên)
    const payload = {
        thoiGian: document.getElementById('edit-cx-thoigian').value,
        maTuyen: document.getElementById('edit-cx-tuyen').value,
        maXe: document.getElementById('edit-cx-xe').value,
        maTaiXe: maTaiXe,
        trangThai: 'Sẵn sàng'
    };

    try {
        const res = await fetch(`/api/chuyen/${ma}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Cập nhật thành công!");
            await initChuyenForm(); // Refresh cho các form khác
            
            // Tắt modal một cách an toàn (không tạo thêm backdrop)
            const modalEl = document.getElementById('editChuyenModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
            
            loadChuyenXe();
        } else {
            alert("Cập nhật thất bại!");
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}