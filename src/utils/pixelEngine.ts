// Authentic In-Situ Pixel Engine based on Samuel Rizzon's DOM-to-canvas rasterizer
// and Spring-Physics Spider-Bot Agent Swarm

export interface PixelPiece {
  tx: number;       // target X on canvas
  ty: number;       // target Y on canvas
  tw: number;       // target width
  th: number;       // target height
  x: number;        // current X
  y: number;        // current Y
  w: number;        // current width
  h: number;        // current height
  vx: number;       // velocity x
  vy: number;       // velocity y
  ox: number;       // origin X
  oy: number;       // origin Y
  f: number;        // progress 0..1
  lineTop: number;  // baseline Y
  color: string;    // pixel color
  state: 'waiting' | 'flying' | 'home' | 'fading' | 'gone';
}

export function makePiece(
  tx: number,
  ty: number,
  tw: number,
  th: number,
  color: string,
  lineTop = ty
): PixelPiece {
  return {
    tx,
    ty,
    tw,
    th,
    x: tx,
    y: ty,
    w: tw,
    h: th,
    vx: 0,
    vy: 0,
    ox: tx,
    oy: ty,
    f: 0,
    lineTop,
    color,
    state: 'waiting',
  };
}

export interface TextRun {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Extracts all text runs and their exact screen bounding boxes from a DOM element
 */
export function getTextRuns(element: HTMLElement, containerRect: DOMRect): TextRun[] {
  const runs: TextRun[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  let node = walker.nextNode();
  while (node) {
    if (node.parentElement?.closest('[data-no-build]')) {
      node = walker.nextNode();
      continue;
    }

    const text = node.textContent ?? '';
    for (let i = 0; i < text.length; i++) {
      if (text[i].trim() === '') continue; // Skip standalone spaces in runs

      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects || rects.length === 0) continue;

      const r = rects[0];
      const relTop = Math.round(r.top - containerRect.top);
      const relLeft = Math.round(r.left - containerRect.left);

      const last = runs[runs.length - 1];
      // Group nearby characters on the same line into word/run blocks
      if (last && Math.abs(last.top - relTop) < 3 && Math.abs((last.left + last.width) - relLeft) < 14) {
        last.text += text[i];
        last.width = (relLeft + r.width) - last.left;
      } else {
        runs.push({
          text: text[i],
          left: relLeft,
          top: relTop,
          width: r.width,
          height: r.height,
        });
      }
    }
    node = walker.nextNode();
  }

  return runs;
}

/**
 * Rasterizes a string into an array of pixel offset points using an offscreen canvas
 */
export function rasterizeText(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: string,
  cellSize: number
): { x: number; y: number }[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  const metrics = ctx.measureText(text);
  const ascent = Math.ceil(metrics.fontBoundingBoxAscent || fontSize * 0.85);
  const descent = Math.ceil(metrics.fontBoundingBoxDescent || fontSize * 0.25);

  canvas.width = Math.max(1, Math.ceil(metrics.width) + 4);
  canvas.height = Math.max(1, ascent + descent + 4);

  // Redraw with font settings after resize
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 0, ascent);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const pixels: { x: number; y: number }[] = [];

  const step = Math.max(2, Math.round(cellSize));

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx + 3] > 100) {
        pixels.push({ x, y: y - ascent });
      }
    }
  }

  return pixels;
}

/**
 * Extract pixel pieces for any DOM element (text, box, ring, image)
 */
export function piecesOf(
  element: HTMLElement,
  containerRect: DOMRect,
  type: 'text' | 'box' | 'ring' = 'text',
  defaultColor = '#ffffff'
): PixelPiece[] {
  const style = getComputedStyle(element);
  const elemRect = element.getBoundingClientRect();
  const pieces: PixelPiece[] = [];

  if (type === 'text') {
    const fontSize = parseFloat(style.fontSize) || 14;
    const fontFamily = style.fontFamily || 'monospace';
    const fontWeight = style.fontWeight || '400';
    const color = style.color || defaultColor;
    const cellSize = Math.max(2, Math.min(4, Math.round(fontSize / 5.5)));

    const runs = getTextRuns(element, containerRect);

    for (const run of runs) {
      const charPixels = rasterizeText(run.text, fontFamily, fontSize, fontWeight, cellSize);
      for (const p of charPixels) {
        pieces.push(
          makePiece(
            run.left + p.x,
            run.top + p.y + fontSize * 0.8,
            cellSize,
            cellSize,
            color,
            run.top
          )
        );
      }
    }
  } else if (type === 'box') {
    const boxLeft = Math.round(elemRect.left - containerRect.left);
    const boxTop = Math.round(elemRect.top - containerRect.top);
    const boxWidth = Math.round(elemRect.width);
    const boxHeight = Math.round(elemRect.height);

    const step = 8;
    const cols = Math.max(2, Math.round(boxWidth / step));
    const rows = Math.max(2, Math.round(boxHeight / step));
    const stepW = boxWidth / cols;
    const stepH = boxHeight / rows;

    const bg = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent'
      ? style.backgroundColor
      : '#090d1a';
    const border = style.borderColor || '#38bdf8';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isBorder = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
        const color = isBorder ? border : bg;
        pieces.push(
          makePiece(
            Math.round(boxLeft + c * stepW),
            Math.round(boxTop + r * stepH),
            Math.max(2, Math.round(stepW - 1)),
            Math.max(2, Math.round(stepH - 1)),
            color,
            boxTop
          )
        );
      }
    }
  } else if (type === 'ring') {
    const boxLeft = Math.round(elemRect.left - containerRect.left);
    const boxTop = Math.round(elemRect.top - containerRect.top);
    const boxWidth = Math.round(elemRect.width);
    const boxHeight = Math.round(elemRect.height);

    const step = 6;
    const cols = Math.max(2, Math.round(boxWidth / step));
    const rows = Math.max(2, Math.round(boxHeight / step));
    const stepW = boxWidth / cols;
    const stepH = boxHeight / rows;
    const border = style.borderColor || defaultColor;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          pieces.push(
            makePiece(
              Math.round(boxLeft + c * stepW),
              Math.round(boxTop + r * stepH),
              Math.max(2, Math.round(stepW - 1)),
              Math.max(2, Math.round(stepH - 1)),
              border,
              boxTop
            )
          );
        }
      }
    }
  }

  // Sort pieces by line top, then left, for natural top-to-bottom, left-to-right assembly
  pieces.sort((a, b) => a.lineTop - b.lineTop || a.tx - b.tx || a.ty - b.ty);
  return pieces;
}

export interface SpiderBotAgent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  face: number; // 1 = right, -1 = left
  walk: number;
  blink: number;
  fly: boolean;
  job: PixelPiece[];
  t: number;
  delay: number;
  leaving: boolean;
  gone: boolean;
  primaryColor: string;
  eyeColor: string;
}

export const BOT_SHADES = [
  { primary: '#dc2626', eye: '#38bdf8' }, // Spidey Red & Cyan
  { primary: '#0284c7', eye: '#facc15' }, // Web Navy & Gold
  { primary: '#991b1b', eye: '#22d3ee' }, // Crimson & Blue
  { primary: '#ca8a04', eye: '#38bdf8' }, // Gold & Cyan
];

/**
 * 12x8 pixel Spider-Bot sprite with arachnid body, glowing visor eyes,
 * mechanical legs, and animated cyan web-thruster trails.
 */
const SPIDER_BOT_SPRITE = [
  '...rrrrrr...',
  '..rreeeerr..',
  '.rrreeeerrr.',
  'rrrrrrrrrrrr',
  '.rrrrrrrrrr.',
  '.ll.rrrr.ll.',
  'l..l....l..l',
];

export function drawSpiderBot(
  ctx: CanvasRenderingContext2D,
  bot: SpiderBotAgent,
  scale: number,
  time: number
) {
  const spriteW = 12 * scale;
  const spriteH = 7 * scale;
  const startX = Math.round(bot.x - spriteW / 2);
  const startY = Math.round(bot.y - spriteH);

  SPIDER_BOT_SPRITE.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (char === '.') continue;

      const colIdx = bot.face < 0 ? row.length - 1 - c : c;
      const px = startX + colIdx * scale;
      const py = startY + r * scale;

      if (char === 'r') {
        ctx.fillStyle = bot.primaryColor;
      } else if (char === 'e') {
        ctx.fillStyle = bot.blink > 0 ? bot.primaryColor : bot.eyeColor;
      } else if (char === 'l') {
        ctx.fillStyle = '#1e293b';
      }

      ctx.fillRect(px, py, scale, scale);
    }
  });

  // Animated cyan thruster jet flame / web trail under bot
  if (bot.fly) {
    const pulse = Math.floor(time / 70) % 2;
    ctx.fillStyle = '#38bdf8';
    ctx.globalAlpha = 0.85;
    const jetY = startY + spriteH;
    const flameH = scale * (pulse ? 1.5 : 2.5);
    ctx.fillRect(startX + 3 * scale, jetY, scale * 2, flameH);
    ctx.fillRect(startX + 7 * scale, jetY, scale * 2, flameH);
    ctx.globalAlpha = 1.0;
  }
}
