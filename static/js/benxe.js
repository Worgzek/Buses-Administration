// benxe.js - Quản lý tương tác UI cho Bus Admin
// Được thiết kế bởi Quốc Jack

document.addEventListener('DOMContentLoaded', function() {
    console.log("Hệ thống Bus Admin của Quốc Jack đã sẵn sàng!");
    loadStations();

    // Tìm nút Lưu dựa trên class btn-custom
    const saveBtn = document.querySelector('.btn-custom');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleAddStation);
    }
});

// 1. Hàm lấy danh sách bến xe từ Flask API
function loadStations() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    fetch('/api/stations')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến server');
            return response.json();
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Lỗi:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Lỗi kết nối database: ${error.message}</td></tr>`;
        });
}

// 2. Hàm render dữ liệu vào bảng
function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; 

    data.forEach(station => {
        // Xác định chính xác mã bến xe trước khi đưa vào HTML
        const ma = station.mabenxe || station[0];
        const ten = station.tenbenxe || station[1];
        const dc = station.diachi || station[2];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="fw-bold text-dark">${ma}</span></td>
            <td>${ten}</td>
            <td>${dc}</td>
            <td><span class="badge bg-success-subtle text-success px-3">Sẵn sàng</span></td>
            <td class="text-center">
                <button class="btn btn-sm btn-light text-primary me-2" onclick="editStation('${ma}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger" onclick="deleteStation('${ma}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 3. Hàm thêm bến xe
function handleAddStation() {
    // Lấy form qua ID (Nhớ thêm id="main-form" vào thẻ <form> trong HTML)
    const inputs = document.querySelectorAll('.table-container input');
    const ma = inputs[0].value.trim();
    const ten = inputs[1].value.trim();
    const diachi = inputs[2].value.trim();

    if (!ma || !ten) {
        alert('Quốc Jack ơi, nhập thiếu Mã hoặc Tên kìa!');
        return;
    }

    const payload = { ma, ten, diachi };

    fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('Thêm bến xe thành công vào Postgres!');
            inputs.forEach(input => input.value = ''); // Xóa trắng input
            loadStations(); // Cập nhật lại bảng ngay lập tức
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .catch(error => alert('Lỗi: ' + error.message));
}

// 4. Xóa (Nhớ viết API DELETE bên Flask nhé)
function deleteStation(id) {
    if (confirm(`Quốc Jack chắc chắn muốn xóa bến ${id} không?`)) {
        fetch(`/api/stations/${id}`, { method: 'DELETE' })
        .then(res => {
            if (res.ok) {
                alert('Xóa xong!');
                loadStations();
            } else {
                alert('Không xóa được! Có thể bến này đang có Chuyến xe chạy.');
            }
        });
    }
}

function editStation(id) {
    alert('Tính năng Sửa cho bến ' + id + ' sẽ cập nhật sau nhé!');
}