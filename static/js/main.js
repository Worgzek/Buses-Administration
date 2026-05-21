function showSection(name) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('#sidebar ul li').forEach(li => li.classList.remove('active'));
    
    const targetSection = document.getElementById('section-' + name);
    const targetMenu = document.getElementById('menu-' + name);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetMenu) targetMenu.classList.add('active');

    // QUAN TRỌNG: Gọi hàm load dữ liệu tương ứng
    if (name === 'tuyenxe') {
        console.log("Đang chuyển sang tab Tuyến xe..."); 
        loadTuyenXe();
        loadStationsForSelect();
    } else if (name === 'benxe') {
        loadStations(); 
    }
}