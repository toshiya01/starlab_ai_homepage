export function isWebGLSupported(win = window) {
  try {
    const canvas = win.document.createElement('canvas');
    return !!(win.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
