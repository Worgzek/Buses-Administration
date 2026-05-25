// 1. Khi trang web tải xong, tự động load dữ liệu
document.addEventListener('DOMContentLoaded', function() {
    loadChuyenActive();
    loadRecentTickets();
});

// 1. Cập nhật hàm load để debug và đảm bảo dữ liệu
async function loadChuyenActive() {
    try {
        const response = await fetch('/api/chuyen-active');
        const data = await response.json();
        
        console.log("Dữ liệu chuyến nhận được:", data); // Xem kỹ trong F12 Console
        
        const select = document.getElementById('ticket-chuyen');
        select.innerHTML = '<option value="">-- Chọn Chuyến Xe --</option>';
        
        data.forEach(c => {
            // Đảm bảo dùng đúng tên key: c.maChuyen, c.tuyen, c.gia, c.soCho (hoặc c.cho)
            // Nếu F12 Console báo lỗi "undefined" ở đây, nghĩa là key không khớp
            select.innerHTML += `
                <option value="${c.maChuyen || c.ma}" 
                        data-tuyen="${c.tuyen}" 
                        data-gia="${c.gia}" 
                        data-ghe="${c.soCho || c.cho || 0}">
                    ${c.maChuyen || c.ma} - ${c.tuyen}
                </option>`;
        });
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// 2. Hàm Preview an toàn
function updateTicketPreview() {
    const select = document.getElementById('ticket-chuyen');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value !== "") {
        // Lấy giá trị thô
        const tuyen = selectedOption.getAttribute('data-tuyen');
        const gia = selectedOption.getAttribute('data-gia');
        const ghe = selectedOption.getAttribute('data-ghe');
        
        console.log("Preview data:", {tuyen, gia, ghe}); // Kiểm tra xem cái nào bị null/undefined
        
        // Cập nhật HTML (dùng toán tử || để thay thế undefined bằng giá trị mặc định)
        document.getElementById('preview-tuyen').innerText = (tuyen !== "undefined" && tuyen) ? tuyen : "N/A";
        document.getElementById('preview-gia').innerText = (gia !== "undefined" && gia) ? parseInt(gia).toLocaleString('vi-VN') + " VNĐ" : "0 VNĐ";
        document.getElementById('preview-ghe').innerText = (ghe !== "undefined" && ghe) ? ghe + " chỗ" : "0 chỗ";
    } else {
        document.getElementById('preview-tuyen').innerText = "N/A";
        document.getElementById('preview-gia').innerText = "0 VNĐ";
        document.getElementById('preview-ghe').innerText = "-- chỗ";
    }
}
// 3. Load danh sách vé đã bán vào Bảng
async function loadRecentTickets() {
    const response = await fetch('/api/ve');
    const data = await response.json();
    
    console.log("Dữ liệu từ API:", data); // Kiểm tra xem key là 'tuyen' hay 'maChuyen'
    
    const tbody = document.getElementById('table-recent-tickets');
    tbody.innerHTML = ''; 
    
    data.forEach(v => {
        // Đảm bảo v.tuyen và v.tenKhach khớp với key trong app.py
        tbody.innerHTML += `
            <tr>
                <td>${v.maVe}</td>
                <td>${v.tenKhach || 'N/A'}</td>
                <td>${v.tuyen || 'N/A'}</td>
                <td>${parseInt(v.gia).toLocaleString()} VNĐ</td>
            </tr>
        `;
    });
}

// 4. Xử lý logic bán vé
async function submitTicket() {
    const selectChuyen = document.getElementById('ticket-chuyen');
    const selectedOption = selectChuyen.options[selectChuyen.selectedIndex];
    
    const ticketData = {
        maChuyen: selectChuyen.value,
        sdt: document.getElementById('ticket-khach-sdt').value,
        ten: document.getElementById('ticket-khach-ten').value,
        gia: selectedOption ? selectedOption.getAttribute('data-gia') : null
    };

    if (!ticketData.maChuyen || !ticketData.sdt || !ticketData.ten || !ticketData.gia) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const response = await fetch('/api/ban-ve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message || "Bán vé thành công!");
        
        // 1. CHỜ loadChuyenActive chạy xong rồi mới thực hiện các bước tiếp theo
        await loadChuyenActive(); 
        
        // 2. Refresh lại danh sách vé đã bán
        loadRecentTickets(); 
        
        // 3. Reset form
        document.getElementById('ticket-khach-sdt').value = '';
        document.getElementById('ticket-khach-ten').value = '';
        
        // 4. Reset dropdown về mặc định
        selectChuyen.value = "";
        
        // 5. ÉP CẬP NHẬT LẠI GIAO DIỆN (Quan trọng)
        // Nếu bạn có hàm updatePreview, hãy gọi nó ở đây
        if (typeof updateTicketPreview === 'function') {
            updateTicketPreview();
        } else {
            // Hoặc cập nhật thủ công nếu không có hàm đó
            document.getElementById('preview-gia').innerText = "0 VNĐ";
        }
        
    } else {
        alert("Lỗi: " + (result.error || "Không xác định"));
    }
}


// 6. Kiểm tra khách hàng tự động
async function checkPassengerExist() {
    const sdt = document.getElementById('ticket-khach-sdt').value;
    const tenInput = document.getElementById('ticket-khach-ten');
    
    if (sdt.length < 10) return;

    try {
        const response = await fetch(`/api/khachhang/${sdt}`);
        const data = await response.json();
        if (data.exists) {
            tenInput.value = data.ten;
        } else {
            tenInput.value = '';
        }
    } catch (error) {
        console.error("Lỗi API check khách:", error);
    }
}