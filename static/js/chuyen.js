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
            const trangThai = c[4] || 'Chưa cập nhật';
            
            const time = thoiGian ? thoiGian.substring(0, 16) : 'N/A';

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