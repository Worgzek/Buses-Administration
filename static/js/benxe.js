document.addEventListener('DOMContentLoaded', function() {
    console.log("Hệ thống Bus Admin của Quốc Jack đã sẵn sàng!");
    loadStations();

    const saveBtn = document.querySelector('.btn-custom');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleAddStation);
    }
});

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

function renderTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; 

    data.forEach(station => {
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


function handleAddStation() {
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
            inputs.forEach(input => input.value = '');
            loadStations();
        } else {
            return response.json().then(err => { throw new Error(err.error); });
        }
    })
    .catch(error => alert('Lỗi: ' + error.message));
}

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

function editStation(ma) {
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let row of rows) {
        if (row.cells[0].innerText === ma) {
            const tenCu = row.cells[1].innerText;
            const dcCu = row.cells[2].innerText;

            // Đổ dữ liệu vào các ô trong Modal
            document.getElementById('display-ma-bx').innerText = ma;
            document.getElementById('edit-ma').value = ma;
            document.getElementById('edit-ten').value = tenCu;
            document.getElementById('edit-diachi').value = dcCu;

            const myModal = new bootstrap.Modal(document.getElementById('editModal'));
            myModal.show();
            break;
        }
    }
}

function submitEdit() {
    const ma = document.getElementById('edit-ma').value;
    const ten = document.getElementById('edit-ten').value.trim();
    const diachi = document.getElementById('edit-diachi').value.trim();

    if (!ten || !diachi) {
        alert('Vui lòng không để trống thông tin!');
        return;
    }

    const payload = { ten, diachi };

    fetch(`/api/stations/${ma}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) {
            alert('Cập nhật thành công!');
            location.reload();
        } else {
            alert('Lỗi cập nhật!');
        }
    })
    .catch(err => console.error('Lỗi:', err));
}