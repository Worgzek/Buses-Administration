function showSection(name) {
    // Ẩn tất cả các phần nội dung
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('#sidebar ul li').forEach(li => li.classList.remove('active'));
    
    // Hiện phần được chọn
    const targetSection = document.getElementById('section-' + name);
    const targetMenu = document.getElementById('menu-' + name);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetMenu) targetMenu.classList.add('active');

    // QUAN TRỌNG: Gọi hàm load dữ liệu tương ứng
    if (name === 'tuyenxe') {
        console.log("Đang chuyển sang tab Tuyến xe..."); 
        loadTuyenXe();           // Hàm này phải nằm trong tuyenxe.js
        loadStationsForSelect(); // Hàm này để đổ dữ liệu vào ô chọn Bến xe
    } else if (name === 'benxe') {
        loadStations();          // Hàm của bảng bến xe
    }
}