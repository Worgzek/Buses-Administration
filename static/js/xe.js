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
                    <td class="align-middle"><span class="fw-bold text-primary">${ma}</span></td>
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

function loadTuyenSelect() {
    const selectIds = ['xe-tuyen', 'edit-xe-tuyen'];

    fetch('/api/tuyenxe')
        .then(res => res.json())
        .then(data => {

            selectIds.forEach(id => {
                const select = document.getElementById(id);
                if (!select) return; // Nếu không tìm thấy ID này thì bỏ qua cái tiếp theo

                select.innerHTML = '<option value="">-- Chọn tuyến đảm nhận --</option>';
                data.forEach(t => {
                    const ma = t[0];
                    const ten = t[1];
                    select.innerHTML += `<option value="${ma}">${ten}</option>`;
                });
            });
        })
        .catch(err => console.error("Lỗi fetch tuyến:", err));
}

async function handleAddXe() {
    // 1. Lấy dữ liệu từ các ô Input (Ông check kỹ ID trong HTML xem có khớp không nhé)
    const data = {
        ma: document.getElementById('xe-ma').value,
        bien: document.getElementById('xe-bienso').value,
        cho: document.getElementById('xe-socho').value,
        tuyen: document.getElementById('xe-tuyen').value // Đây nên là Mã Tuyến (T01, T02...)
    };

    try {
        // 2. Gửi yêu cầu POST lên API
        const response = await fetch('/api/xe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // 3. Nếu thành công
            alert(result.message); // Hiện: "Thành công! Xe hiện ở trạng thái: Sẵn sàng"
            

            // Reset form cho lần sau
            document.getElementById('xe-ma').value = '';
            document.getElementById('xe-bienso').value = '';
            document.getElementById('xe-socho').value = '';
            document.getElementById('xe-tuyen').selectedIndex = 0; // Đưa select về cái đầu tiên
            loadXeBus(); 
        } else {
            // 4. Nếu lỗi (Trùng mã, thiếu trường...)
            alert("Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không thể kết nối đến server!");
    }
}

function deleteXe(ma) {
    if (!confirm(`Bạn có chắc muốn xóa xe ${ma} không?`)) return;

    fetch(`/api/xe/${ma}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        loadXeBus();
    });
}

async function editXe(ma) {
    try {
        const response = await fetch(`/api/xe/${ma}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Không thể lấy thông tin xe");
            return;
        }

        // Đổ dữ liệu vào Modal - Phải khớp với các Key viết Hoa ở app.py
        document.getElementById('display-ma-xe').innerText = ma;
        document.getElementById('edit-xe-ma').value = ma;
        document.getElementById('edit-xe-bienso').value = data.BienSo; // Viết Hoa chữ B
        document.getElementById('edit-xe-socho').value = data.SoCho;   // Viết Hoa chữ S
        document.getElementById('edit-xe-tuyen').value = data.MaTuyen || ""; // Viết Hoa chữ M

        const myModal = new bootstrap.Modal(document.getElementById('editXeModal'));
        myModal.show();
    } catch (error) {
        console.error("Lỗi Edit:", error);
    }
}

async function submitEditXe() {
    // 1. Lấy mã xe từ cái input hidden mà mình đã gán lúc mở Modal
    const maXe = document.getElementById('edit-xe-ma').value;
    
    // 2. Gom dữ liệu mới từ các ô input trong Modal
    const data = {
        bien: document.getElementById('edit-xe-bienso').value,
        cho: document.getElementById('edit-xe-socho').value,
        tuyen: document.getElementById('edit-xe-tuyen').value
    };

    // Kiểm tra nhanh tránh gửi dữ liệu rỗng
    if (!data.bien || !data.cho) {
        alert("Vui lòng nhập đầy đủ Biển số và Số chỗ!");
        return;
    }

    try {
        // 3. Gửi yêu cầu PUT lên Flask
        const response = await fetch(`/api/xe/${maXe}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // 4. Nếu thành công
            alert(result.message); // Hiện: "Cập nhật xe XE01 thành công!"

            // Đóng Modal (Dùng API của Bootstrap)
            const modalElement = document.getElementById('editXeModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }

            // 5. Cập nhật lại bảng mà không cần load lại trang
            loadXeBus(); 
        } else {
            // Hiển thị lỗi từ server (Ví dụ: Lỗi validation)
            alert("Lỗi: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Không thể kết nối đến máy chủ!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadXeBus();
    loadTuyenSelect();
});