import { describe, it, expect } from 'vitest';
import { isWebGLSupported } from '../src/utils.js';

describe('isWebGLSupported', () => {
  it('should return true when WebGL context is available', () => {
    const mockCanvas = {
      getContext: (type) => {
        if (type === 'webgl' || type === 'experimental-webgl') {
          return {};
        }
        return null;
      }
    };
    const mockWindow = {
      WebGLRenderingContext: {},
      document: {
        createElement: () => mockCanvas
      }
    };
    expect(isWebGLSupported(mockWindow)).toBe(true);
  });

  it('should return false when WebGL context is unavailable', () => {
    const mockCanvas = {
      getContext: () => null
    };
    const mockWindow = {
      WebGLRenderingContext: {},
      document: {
        createElement: () => mockCanvas
      }
    };
    expect(isWebGLSupported(mockWindow)).toBe(false);
  });

  it('should return false when canvas creation throws an error', () => {
    const mockWindow = {
      WebGLRenderingContext: {},
      document: {
        createElement: () => { throw new Error('Mock Canvas Error'); }
      }
    };
    expect(isWebGLSupported(mockWindow)).toBe(false);
  });
});

