import { describe, it, expect } from 'vitest';
import { makePiece, circlePieces } from '../src/utils/pixelEngine';

describe('pixelEngine authentic rasterization', () => {
  it('creates a pixel piece with proper initial state and coordinates', () => {
    const piece = makePiece(12, 24, 2, 2, '#e11d48');
    expect(piece.tx).toBe(12);
    expect(piece.ty).toBe(24);
    expect(piece.tw).toBe(2);
    expect(piece.th).toBe(2);
    expect(piece.color).toBe('#e11d48');
    expect(piece.state).toBe('waiting');
  });

  it('generates circle pieces correctly bounded within radius', () => {
    const L = 10;
    const T = 10;
    const W = 30;
    const H = 30;
    const pieces = circlePieces(L, T, W, H, 2, '#ffffff', '#000000');
    expect(pieces.length).toBeGreaterThan(0);
    pieces.forEach((p) => {
      expect(p.tx).toBeGreaterThanOrEqual(L);
      expect(p.tx).toBeLessThanOrEqual(L + W);
      expect(p.ty).toBeGreaterThanOrEqual(T);
      expect(p.ty).toBeLessThanOrEqual(T + H);
    });
  });
});

