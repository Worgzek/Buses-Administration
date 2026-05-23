// Dữ liệu giả lập ban đầu
let danhSachNhanVien = [
    { ma: 'NV01', ten: 'Nguyễn Văn A', chucVu: 'Ban ve', sdt: '0912345678', ben: 'Bến xe Miền Đông' }
];

let danhSachTaiXe = [
    { ma: 'TX01', ten: 'Trần Văn B', bang: 'Hạng E', sdt: '0987654321' }
];

// 1. Hàm load Nhân Viên lên Table
function loadNhanVien() {
    const tbody = document.getElementById('table-body-nv');
    if (!tbody) return;

    tbody.innerHTML = danhSachNhanVien.map(nv => `
        <tr>
            <td><span class="fw-bold">${nv.ma}</span></td>
            <td>${nv.ten}</td>
            <td><span class="badge bg-info text-dark">${nv.chucVu}</span></td>
            <td>${nv.sdt}</td>
            <td>${nv.ben}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-warning me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 2. Hàm load Tài Xế lên Table
function loadTaiXe() {
    const tbody = document.getElementById('table-body-tx');
    if (!tbody) return;

    tbody.innerHTML = danhSachTaiXe.map(tx => `
        <tr>
            <td><span class="fw-bold">${tx.ma}</span></td>
            <td>${tx.ten}</td>
            <td>${tx.bang}</td>
            <td>${tx.sdt}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-warning me-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 3. Xử lý thêm Nhân Viên (Mã, Tên, Chức vụ, SĐT, Bến)
function handleAddNhanVien() {
    const ma = document.getElementById('nv-ma').value;
    const ten = document.getElementById('nv-ten').value;
    const chucVu = document.getElementById('nv-chucvu').value;
    const sdt = document.getElementById('nv-sdt').value;
    const ben = document.getElementById('nv-benxe').value;

    if (!ma || !ten || !sdt) {
        alert("Vui lòng nhập đầy đủ thông tin nhân viên!");
        return;
    }

    danhSachNhanVien.push({ ma, ten, chucVu, sdt, ben });
    loadNhanVien();
    
    // Reset form
    document.getElementById('nv-ma').value = '';
    document.getElementById('nv-ten').value = '';
    document.getElementById('nv-sdt').value = '';
}

// 4. Xử lý thêm Tài Xế (Mã, Họ tên, Bằng lái, SĐT)
function handleAddTaiXe() {
    const ma = document.getElementById('tx-ma').value;
    const ten = document.getElementById('tx-ten').value;
    const bang = document.getElementById('tx-bang').value;
    const sdt = document.getElementById('tx-sdt').value;

    if (!ma || !ten || !sdt) {
        alert("Vui lòng nhập đầy đủ thông tin tài xế!");
        return;
    }

    danhSachTaiXe.push({ ma, ten, bang, sdt });
    loadTaiXe();
    
    // Reset form
    document.getElementById('tx-ma').value = '';
    document.getElementById('tx-ten').value = '';
    document.getElementById('tx-bang').value = '';
    document.getElementById('tx-sdt').value = '';
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadNhanVien();
    loadTaiXe();
});