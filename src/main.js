import { isWebGLSupported } from './utils.js';

window.addEventListener('DOMContentLoaded', () => {
  const fallbackEl = document.querySelector('.panorama-fallback');

  // Check if WebGL is supported
  if (!isWebGLSupported(window)) {
    console.warn('WebGL is not supported. Displaying fallback gradient.');
    return;
  }

  // Initialize Pannellum if lib loaded and WebGL supported
  if (typeof pannellum !== 'undefined') {
    const viewer = pannellum.viewer('panorama', {
      type: 'equirectangular',
      panorama: '/public/assets/starlab-studio-360.webp',
      autoLoad: true,
      autoRotate: -0.8,
      mouseZoom: true,
      hfov: 95,
      minHfov: 50,
      maxHfov: 120,
      showControls: false
    });

    viewer.on('load', () => {
      if (fallbackEl) {
        fallbackEl.style.opacity = '0';
        setTimeout(() => {
          fallbackEl.style.display = 'none';
        }, 1000);
      }
    });
  } else {
    console.error('Pannellum is not loaded from CDN.');
  }
});
