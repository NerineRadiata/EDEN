document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('main');

  async function getImagesFromR2() {
    // URL đến API từ Cloudflare R2
    const baseUrl = 'https://pub-2ff7ec69b90f4a739fae5c7852ab6e6a.r2.dev';
    
    // Danh sách URL ảnh (Thay đổi nếu bạn có một cách khác để lấy danh sách)
    const imageFilenames = [
      { file: baseUrl + 'image1.jpg', title: 'Image 1' },
      { file: baseUrl + 'image2.jpg', title: 'Image 2' }
    ];

    return imageFilenames;
  }

  getImagesFromR2().then(artworks => {
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

    // Add event listeners cho image containers sau khi được tạo
    setupImageZoom();
  });

  // Các sự kiện khác
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    main.classList.toggle('dimmed');
  });

  // Create fullscreen overlay
  const fullscreenOverlay = document.createElement('div');
  fullscreenOverlay.className = 'fullscreen-overlay';
  document.body.appendChild(fullscreenOverlay);

  // Create zoom container and its contents
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
    // Add click event to image containers
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

  // Close zoom functionality
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
