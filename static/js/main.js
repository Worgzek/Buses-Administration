function showSection(sectionId) {
    const benXeSec = document.getElementById('section-benxe');
    const tuyenXeSec = document.getElementById('section-tuyenxe');
    const xeSec = document.getElementById('section-xe');
    const nhansuSec = document.getElementById('section-nhansu');
    const chuyenXeSec = document.getElementById('section-chuyen');
    const banVeSec = document.getElementById('section-banve');



    benXeSec.style.display = 'none';
    tuyenXeSec.style.display = 'none';
    xeSec.style.display = 'none';
    nhansuSec.style.display = 'none';
    chuyenXeSec.style.display = 'none';
    banVeSec.style.display = 'none';

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
        console.log("Đang bắt đầu gọi hàm load data cho Chuyến xe...");
        if (typeof loadChuyenXe === 'function') loadChuyenXe()
        if (typeof loadChuyenActive === 'function') loadChuyenActive()
    }


    document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
    const activeMenu = document.getElementById('menu-' + sectionId);
    if (activeMenu) activeMenu.classList.add('active');
    
}