// 1. Khi trang web tải xong, tự động load dữ liệu
document.addEventListener('DOMContentLoaded', function() {
    loadChuyenActive();
    loadRecentTickets();
});

async function loadChuyenActive() {
    try {
        const response = await fetch('/api/chuyen-active');
        const data = await response.json();        
        const select = document.getElementById('ticket-chuyen');
        
        // Giữ lại option mặc định
        select.innerHTML = '<option value="">-- Chọn Chuyến Xe --</option>';
        
        data.forEach(c => {

            const dateObj = new Date(c.gio);
            const timeString = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const dateString = dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

            select.innerHTML += `
                <option value="${c.ma}" 
                        data-tuyen="${c.tuyen}" 
                        data-gia="${c.gia}" 
                        data-ghe="${c.cho}">
                    ${c.ma} | ${timeString} ${dateString} | ${c.tuyen} (Còn ${c.cho} chỗ)
                </option>`;
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách chuyến:", error);
    }
}

function updateTicketPreview() {
    const select = document.getElementById('ticket-chuyen');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value !== "") {
        const tuyen = selectedOption.getAttribute('data-tuyen');
        const gia = selectedOption.getAttribute('data-gia');
        const ghe = selectedOption.getAttribute('data-ghe');
                
        document.getElementById('preview-tuyen').innerText = (tuyen !== "undefined" && tuyen) ? tuyen : "N/A";
        document.getElementById('preview-gia').innerText = (gia !== "undefined" && gia) ? parseInt(gia).toLocaleString('vi-VN') + " VNĐ" : "0 VNĐ";
        document.getElementById('preview-ghe').innerText = (ghe !== "undefined" && ghe) ? ghe + " chỗ" : "0 chỗ";
    } else {
        document.getElementById('preview-tuyen').innerText = "N/A";
        document.getElementById('preview-gia').innerText = "0 VNĐ";
        document.getElementById('preview-ghe').innerText = "-- chỗ";
    }
}
async function loadRecentTickets() {
    const response = await fetch('/api/ve');
    const data = await response.json();
    
    const tableBody = document.getElementById('table-recent-tickets');
    tableBody.innerHTML = '';

    data.forEach(ve => { 
        // Lấy thời gian rút gọn (nếu cần)
        const time = ve.thoiGian ? ve.thoiGian.substring(0, 16) : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="fw-bold text-primary">${ve.maVe}</span></td>
            <td>${ve.tenKhach}</td>
            <td>
                <div class="fw-bold text-dark">${ve.maChuyen || 'N/A'}</div>
                <div class="small text-muted">${time}</div>
            </td>
            <td>${ve.tuyen}</td>
            <td>${ve.gia.toLocaleString('vi-VN')} VNĐ</td>
            <td class="text-center">
                <button class="btn btn-sm btn-light text-danger" onclick="xoaVe('${ve.maVe}')">
                    <i class="fas fa-trash"></i>
                </button>            
            </td>
        `;
        tableBody.appendChild(row);
    });
}
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
        
        await loadChuyenActive(); 
        
        loadRecentTickets(); 
        loadDashboard();
              
        document.getElementById('ticket-khach-sdt').value = '';
        document.getElementById('ticket-khach-ten').value = '';
        
        selectChuyen.value = "";
        if (typeof updateTicketPreview === 'function') {
            updateTicketPreview();
        } else {
            document.getElementById('preview-gia').innerText = "0 VNĐ";
        }
        
    } else {
        alert("Lỗi: " + (result.error || "Không xác định"));
    }
}

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
    }
}

async function xoaVe(maVe) {
    if (!confirm("Bạn có chắc muốn hủy vé này không?")) return;

    const response = await fetch(`/api/ve/${maVe}`, { method: 'DELETE' });
    const result = await response.json();
    
    if (response.ok) {
        alert("Đã xóa vé!");

        loadRecentTickets();
        loadChuyenActive(); 
        loadDashboard();
    } else {
        alert("Lỗi: " + result.error);
    }
}