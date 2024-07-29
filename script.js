document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('main');

  async function getImagesFromR2() {
    try {
      // Gọi API từ server để lấy danh sách hình ảnh
      const response = await fetch('http://localhost:3000/api/images');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Chuyển đổi phản hồi thành định dạng JSON
      const images = await response.json();
      return images;
    } catch (error) {
      console.error('Error fetching images:', error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  }

  getImagesFromR2().then(artworks => {
    artworks.forEach(art => {
      // Tạo một div container cho mỗi hình ảnh
      const container = document.createElement('div');
      container.classList.add('image-container');

      // Tạo phần tử hình ảnh và thiết lập thuộc tính
      const imgElement = document.createElement('img');
      imgElement.src = art.file; // URL hình ảnh từ API
      imgElement.alt = art.title;
      imgElement.dataset.title = art.title;

      // Thêm hình ảnh vào container và container vào gallery
      container.appendChild(imgElement);
      gallery.appendChild(container);
    });

    // Thêm sự kiện click cho các container hình ảnh sau khi chúng đã được tạo
    setupImageZoom();
  });

  // Xử lý sự kiện click cho hamburger menu
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    main.classList.toggle('dimmed');
  });

  // Tạo overlay toàn màn hình để phóng to hình ảnh
  const fullscreenOverlay = document.createElement('div');
  fullscreenOverlay.className = 'fullscreen-overlay';
  document.body.appendChild(fullscreenOverlay);

  // Tạo container zoom và các nội dung của nó
  const zoomContainer = document.createElement('div');
  zoomContainer.className = 'zoom-container';
  fullscreenOverlay.appendChild(zoomContainer);

  const zoomedImage = document.createElement('img');
  zoomedImage.className = 'zoomed-image';
  zoomContainer.appendChild(zoomedImage);

  const imageInfo = document.createElement('div');
  imageInfo.className = 'image-info';
  zoomContainer.appendChild(imageInfo);

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '&times;';
  zoomContainer.appendChild(closeButton);

  function setupImageZoom() {
    // Thêm sự kiện click cho các container hình ảnh
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
      container.addEventListener('click', function() {
        const img = this.querySelector('img');
        zoomedImage.src = img.src;
        imageInfo.textContent = img.dataset.title;
        fullscreenOverlay.classList.add('active');
      });
    });
  }

  // Xử lý sự kiện đóng zoom
  function closeZoom() {
    fullscreenOverlay.classList.remove('active');
  }

  closeButton.addEventListener('click', closeZoom);

  fullscreenOverlay.addEventListener('click', function(e) {
    if (e.target === fullscreenOverlay) {
      closeZoom();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
      closeZoom();
    }
  });
});
