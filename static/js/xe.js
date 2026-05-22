function loadXeBus() {
    const tableBody = document.getElementById('table-body-xe');
    if (!tableBody) return;

    fetch('/api/xe')
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = '';
            data.forEach(x => {
                const ma = x[0];
                const bienSo = x[1];
                const soCho = x[2];
                const trangThai = x[3] || 'Sẵn sàng';
                const tenTuyen = x[4] || 'Chưa gán';

                // Logic gán màu (Giữ nguyên)
                let statusClass = '';
                if (trangThai.includes('hoạt động') || trangThai.includes('Hoạt động')) statusClass = 'bg-warning-subtle text-warning';
                else if (trangThai === 'Sẵn sàng') statusClass = 'bg-success-subtle text-success';
                else if (trangThai === 'Bảo trì') statusClass = 'bg-danger-subtle text-danger';
                else statusClass = 'bg-secondary-subtle text-secondary';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="align-middle"><span class="fw-bold">${ma}</span></td>
                    <td class="align-middle"><span class="badge bg-dark px-2">${bienSo}</span></td>
                    <td class="align-middle">${soCho} chỗ</td>

                    <td class="align-middle">
                        <i class="fas me-2 text-secondary"></i>
                        <span>${tenTuyen}</span>
                    </td>

                    <td class="align-middle">
                        <span class="badge ${statusClass} px-3">${trangThai}</span>
                    </td>

                    <td class="text-center align-middle">
                        <button class="btn btn-sm btn-light text-primary me-2" onclick="editXe('${ma}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-light text-danger" onclick="deleteXe('${ma}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error('Lỗi load xe bus:', err));
}

// Hàm này để load danh sách tuyến vào cái dropdown khi thêm xe mới
function loadTuyenSelect() {
    const select = document.getElementById('xe-tuyen');
    if (!select) return;

    fetch('/api/tuyenxe') // Giả định endpoint tuyến xe của ông
        .then(res => res.json())
        .then(data => {
            select.innerHTML = '<option value="">-- Chọn tuyến đảm nhận --</option>';
            data.forEach(t => {
                const ma = t[0];
                const ten = t[1];
                select.innerHTML += `<option value="${ma}">${ten}</option>`;
            });
        });
}