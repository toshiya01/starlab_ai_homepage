export function isWebGLSupported(win) {
  try {
    const currentWindow = win || (typeof window !== 'undefined' ? window : null);
    if (!currentWindow) return false;
    const canvas = currentWindow.document.createElement('canvas');
    return !!(currentWindow.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

