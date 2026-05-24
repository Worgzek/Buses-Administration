// 1. Load Nhân Viên (Mã, Họ tên, Chức vụ, SĐT, Bến)
// 1. Load Nhân Viên
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
                    <td>${sdt}</td>
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

// 2. Load Tài Xế
function loadTaiXe() {
    const tbody = document.getElementById('table-body-tx');
    if (!tbody) return;

    fetch('/api/taixe')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(tx => {
                // SỬA TẠI ĐÂY: Dùng tên Key khớp với ảnh Console
                const ma = tx.Ma || 'N/A';
                const ten = tx.Ten || 'N/A';
                const bangLai = tx.BangLai || 'N/A';
                const sdt = tx.SDT || 'N/A';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="fw-bold text-success">${ma}</span></td>
                    <td>${ten}</td>
                    <td><span class="badge bg-dark">${bangLai}</span></td>
                    <td>${sdt}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-light text-primary me-1" onclick="editTaiXe('${ma}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-light text-danger" onclick="deleteTaiXe('${ma}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error('Lỗi load tài xế:', err));
}
// 3. Xử lý thêm Nhân Viên
async function handleAddNhanVien() {
    const data = {
        ma: document.getElementById('nv-ma').value,
        ten: document.getElementById('nv-ten').value,
        chucvu: document.getElementById('nv-chucvu').value,
        sdt: document.getElementById('nv-sdt').value,
        ben: document.getElementById('nv-benxe').value
    };

    const res = await fetch('/api/nhanvien', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (res.ok) { loadNhanVien(); }
}

// 4. Xử lý thêm Tài Xế
async function handleAddTaiXe() {
    const data = {
        ma: document.getElementById('tx-ma').value,
        ten: document.getElementById('tx-ten').value,
        bang: document.getElementById('tx-bang').value,
        sdt: document.getElementById('tx-sdt').value
    };

    const res = await fetch('/api/taixe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (res.ok) { loadTaiXe(); }
}