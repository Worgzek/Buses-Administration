function showSection(sectionId) {
    const benXeSec = document.getElementById('section-benxe');
    const tuyenXeSec = document.getElementById('section-tuyenxe');
    const xeSec = document.getElementById('section-xe');


    if (sectionId === 'benxe') {
        benXeSec.style.display = 'block';
        tuyenXeSec.style.display = 'none';
        xeSec.style.display = 'none';

        document.getElementById('main-title').innerText = "Quản lý Bến xe";
        
        if (typeof loadStations === 'function') loadStations(); 
    } 
    else if (sectionId === 'tuyenxe') {
        benXeSec.style.display = 'none';
        tuyenXeSec.style.display = 'block';
        xeSec.style.display = 'none';

        document.getElementById('main-title').innerText = "Quản lý Tuyến xe";

        if (typeof loadTuyenXe === 'function') loadTuyenXe();
        if (typeof loadAllStationSelects === 'function') loadAllStationSelects();
    }

    else if (sectionId === 'xe') {
        benXeSec.style.display = 'none';
        tuyenXeSec.style.display = 'none';
        xeSec.style.display = 'block';
        document.getElementById('main-title').innerText = "Quản lý Xe Bus";
        loadXeBus();
        loadTuyenSelect(); // Để có dữ liệu chọn tuyến cho xe
    }

    document.querySelectorAll('#sidebar li').forEach(li => li.classList.remove('active'));
    const activeMenu = document.getElementById('menu-' + sectionId);
    if (activeMenu) activeMenu.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('benxe');
});