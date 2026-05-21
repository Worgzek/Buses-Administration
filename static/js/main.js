function showSection(sectionId) {
    const benXeSec = document.getElementById('section-benxe');
    const tuyenXeSec = document.getElementById('section-tuyenxe');

    // Reset hiển thị
    if (sectionId === 'benxe') {
        benXeSec.style.display = 'block';
        tuyenXeSec.style.display = 'none';
        document.getElementById('main-title').innerText = "Quản lý Bến xe";
        
        // Gọi hàm từ benxe.js
        if (typeof loadStations === 'function') loadStations(); 
    } 
    else if (sectionId === 'tuyenxe') {
        benXeSec.style.display = 'none';
        tuyenXeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Tuyến xe";

        // Load cả bảng và dropbox ngay khi chuyển sang tab Tuyến xe
        if (typeof loadTuyenXe === 'function') loadTuyenXe();
        if (typeof loadAllStationSelects === 'function') loadAllStationSelects();
    }

    // Cập nhật menu active
    document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
    const activeMenu = document.getElementById('menu-' + sectionId);
    if (activeMenu) activeMenu.classList.add('active');
}

// Khởi tạo ngay khi vừa load trang
document.addEventListener('DOMContentLoaded', () => {
    showSection('benxe');
});