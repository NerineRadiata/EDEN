document.addEventListener('DOMContentLoaded', () => {
  // Lấy các phần tử DOM
  const gallery = document.getElementById('gallery');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('main');

  //import ảnh vào artwork từ 1 file "Arts" bằng PHP
  fetch('get_artworks.php')
    .then(response => response.json())
    .then(artworks => {
      // Tạo các phần tử artworks và thêm vào gallery
      artworks.forEach(art => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        const imgElement = document.createElement('img');
        imgElement.src = art.file;
        imgElement.alt = art.title;
        imgElement.dataset.title = art.title;

        container.appendChild(imgElement);
        gallery.appendChild(container);
      });
    })
    .catch(error => console.error('Error:', error));
  // Tạo các phần tử artworks và thêm vào gallery
  artworks.forEach(art => {
    const container = document.createElement('div');
    container.classList.add('image-container');

    const imgElement = document.createElement('img');
    imgElement.src = art.file;
    imgElement.alt = art.title;
    imgElement.dataset.title = art.title;

    container.appendChild(imgElement);
    gallery.appendChild(container);
  });

  // Xử lý sự kiện click trên hamburger menu
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    main.classList.toggle('dimmed');
  });

  // Tạo fullscreen overlay
  const fullscreenOverlay = document.createElement('div');
  fullscreenOverlay.className = 'fullscreen-overlay';
  document.body.appendChild(fullscreenOverlay);

  // Tạo zoom container và các phần tử bên trong
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

  // Xử lý sự kiện click trên các phần tử thuộc artworks
  const imageContainers = document.querySelectorAll('.image-container');
  imageContainers.forEach(container => {
    container.addEventListener('click', function() {
      const img = this.querySelector('img');
      zoomedImage.src = img.src;
      imageInfo.textContent = img.dataset.title;
      fullscreenOverlay.classList.add('active');
    });
  });

  // Xử lý sự kiện click trên nút đóng(x)
  closeButton.addEventListener('click', closeZoom);
  function closeZoom() {
    fullscreenOverlay.classList.remove('active');
  }

  // Xử lý sự kiện click trên fullscreen overlay #chưa fix được
  let isZoomed = null;
  fullscreenOverlay.addEventListener('click', function(e) {
    if (isZoomed && !zoomContainer.contains(e.target)) {
      closeZoom();
    }
  });

  // Xử lý sự kiện nhấn phím Esc
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')){
      closeZoom();
    }
  });
  function closeZoom(){
    fullscreenOverlay.classList.remove('active');
  }
});