function showSection(sectionId) {
    const benXeSec = document.getElementById('section-benxe');
    const tuyenXeSec = document.getElementById('section-tuyenxe');
    const xeSec = document.getElementById('section-xe');
    const nhansuSec = document.getElementById('section-nhansu');
    const chuyenXeSec = document.getElementById('section-chuyen');
    const banVeSec = document.getElementById('section-banve');
    const mainSec = document.getElementById('dashboard-section');

    if (benXeSec) benXeSec.style.display = 'none';
    if (tuyenXeSec) tuyenXeSec.style.display = 'none';
    if (xeSec) xeSec.style.display = 'none';
    if (nhansuSec) nhansuSec.style.display = 'none';
    if (chuyenXeSec) chuyenXeSec.style.display = 'none';
    if (banVeSec) banVeSec.style.display = 'none';
    if (mainSec) mainSec.style.display = 'none';

    if (sectionId === 'benxe') {
        benXeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Bến xe";
        if (typeof loadStations === 'function') loadStations(); 
    } 
    else if (sectionId === 'tuyenxe') {
        tuyenXeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Tuyến xe";
        if (typeof loadTuyenXe === 'function') loadTuyenXe();
        if (typeof loadAllStationSelects === 'function') loadAllStationSelects();
    }
    else if (sectionId === 'xe') {
        xeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Xe Bus";
        if (typeof loadXeBus === 'function') loadXeBus();
        if (typeof loadTuyenSelect === 'function') loadTuyenSelect();
    }
    else if (sectionId === 'nhansu') {
        nhansuSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Nhân sự";
        if (typeof loadNhanVien === 'function') loadNhanVien();
        if (typeof loadTaiXe === 'function') loadTaiXe();
        if (typeof loadBenXeSelect === 'function') loadBenXeSelect();
        
    }
    else if (sectionId === 'chuyen') {
        chuyenXeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Chuyến Xe";
        if (typeof loadTaiXe === 'function') loadTaiXe();
        if (typeof loadChuyenXe === 'function') loadChuyenXe();
        if (typeof initChuyenForm === 'function') initChuyenForm(); 

    }
    else if (sectionId === 'banve') {
        banVeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Bán Vé";
        if (typeof loadChuyenXe === 'function') loadChuyenXe()
        if (typeof loadChuyenActive === 'function') loadChuyenActive()
    }

    else if (sectionId === 'main') {
    mainSec.style.display = 'block';
    document.getElementById('main-title').innerText = "Tổng quan";
        if (typeof loadDashboard === 'function') loadDashboard();
    }

    document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
    const activeMenu = document.getElementById('menu-' + sectionId);
    if (activeMenu) activeMenu.classList.add('active');
    
}

// main.js

async function loadDashboard() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        // Cập nhật số liệu vào HTML
        document.getElementById('stat-doanh-thu').innerText = 
            data.doanhThu.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('stat-dang-chay').innerText = data.dangHoatDong;
        document.getElementById('stat-khach').innerText = data.tongKhach;
        
        // CẬP NHẬT ID MỚI Ở ĐÂY
        document.getElementById('stat-chuyen-hom-nay').innerText = data.chuyenHomNay;

        // Cập nhật Top 5 tuyến
        const list = document.getElementById('top-tuyen-list');
        list.innerHTML = data.topTuyen.map(t => `
            <li class="list-group-item d-flex justify-content-between">
                <span>${t.name}</span>
                <span class="badge bg-primary rounded-pill">${t.value} vé</span>
            </li>
        `).join('');

        // Cập nhật biểu đồ
        updateChart(data.topTuyen);
        
    } catch (e) {
        console.error("Lỗi tải dashboard:", e);
    }
}

let myChart = null; // Biến toàn cục để lưu instance của biểu đồ

function updateChart(topTuyen) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Hủy biểu đồ cũ nếu đã tồn tại để tránh lỗi "hồ sơ đã tồn tại"
    if (myChart) {
        myChart.destroy();
    }
    
    // Vẽ mới
    myChart = new Chart(ctx, {
        type: 'bar', // Kiểu biểu đồ cột
        data: {
            labels: topTuyen.map(t => t.name), // Tên tuyến
            datasets: [{
                label: 'Số lượng vé đã bán',
                data: topTuyen.map(t => t.value), // Số vé
                backgroundColor: '#0d6efd', // Màu xanh Bootstrap
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}