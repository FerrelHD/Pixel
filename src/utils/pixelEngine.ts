// Authentic In-Situ Pixel Engine based on Samuel Rizzon's DOM-to-canvas rasterizer
// with Varied Spider-Bot Build Styles & Persistent Floating/Perching Idle Behavior

export interface PixelPiece {
  tx: number;       // target X on canvas
  ty: number;       // target Y on canvas
  tw: number;       // target width
  th: number;       // target height
  x: number;        // current X
  y: number;        // current Y
  ox: number;       // origin X
  oy: number;       // origin Y
  f: number;        // progress 0..1 (flight) / seconds (fading)
  dur: number;      // flight duration in seconds
  lineTop: number;  // baseline Y
  color: string;    // pixel color
  owner: number;    // index of the element job this piece belongs to
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
    ox: tx,
    oy: ty,
    f: 0,
    dur: 0.36 + Math.random() * 0.16,
    lineTop,
    color,
    owner: -1,
    state: 'waiting',
  };
}

const isTransparent = (c: string | null | undefined) =>
  !c || c === 'none' || c === 'transparent' || c === 'rgba(0, 0, 0, 0)' || c.startsWith('url(');

/* ------------------------------------------------------------------ */
/* Text: rasterize every glyph exactly where the browser laid it out   */
/* ------------------------------------------------------------------ */

let scratchCtx: CanvasRenderingContext2D | null = null;

function getScratch(w: number, h: number): CanvasRenderingContext2D | null {
  if (!scratchCtx) {
    const c = document.createElement('canvas');
    scratchCtx = c.getContext('2d', { willReadFrequently: true });
  }
  const ctx = scratchCtx;
  if (!ctx) return null;
  if (ctx.canvas.width < w || ctx.canvas.height < h) {
    ctx.canvas.width = Math.max(ctx.canvas.width, w);
    ctx.canvas.height = Math.max(ctx.canvas.height, h);
  }
  return ctx;
}

const COVERAGE_THRESHOLD = 0.35;

function rasterizeGlyph(
  ch: string,
  font: string,
  fontSize: number,
  cell: number,
  left: number,
  top: number,
  rectW: number,
  rectH: number,
  color: string,
  out: PixelPiece[]
) {
  const probe = getScratch(1, 1);
  if (!probe) return;
  probe.font = font;
  const m = probe.measureText(ch);
  const asc = m.fontBoundingBoxAscent || fontSize * 0.8;
  const desc = m.fontBoundingBoxDescent || fontSize * 0.2;
  // The DOM rect is the font's content box, centred in the line box -> exact baseline.
  const baseline = top + (rectH - (asc + desc)) / 2 + asc;
  const glyphW = Math.max(rectW, m.actualBoundingBoxRight || 0);

  // Snap to a container-wide grid so neighbouring glyphs share the same pixel lattice.
  const gx0 = Math.floor(left / cell) * cell;
  const gy0 = Math.floor(top / cell) * cell;
  const cols = Math.ceil((left + glyphW - gx0) / cell) + 1;
  const rows = Math.ceil((top + rectH - gy0) / cell) + 1;
  const W = cols * cell;
  const H = rows * cell;

  const ctx = getScratch(W, H);
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  ctx.fillText(ch, left - gx0, baseline - gy0);
  const data = ctx.getImageData(0, 0, W, H).data;

  const full = cell * cell * 255;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let y = r * cell; y < (r + 1) * cell; y++) {
        let idx = (y * W + c * cell) * 4 + 3;
        for (let x = 0; x < cell; x++, idx += 4) sum += data[idx];
      }
      if (sum / full >= COVERAGE_THRESHOLD) {
        out.push(makePiece(gx0 + c * cell, gy0 + r * cell, cell, cell, color, top));
      }
    }
  }
}

function textPieces(element: HTMLElement, containerRect: DOMRect): PixelPiece[] {
  const pieces: PixelPiece[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || parent.closest('[data-no-build]')) continue;

    // Style per text node, so coloured / resized spans come out right.
    const cs = getComputedStyle(parent);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const fontSize = parseFloat(cs.fontSize) || 14;
    const font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const cell = Math.max(2, Math.min(4, Math.round(fontSize / 5.5)));

    const text = node.textContent ?? '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const len = code >= 0xd800 && code <= 0xdbff ? 2 : 1;
      let ch = text.slice(i, i + len);
      const start = i;
      i += len - 1;
      if (ch.trim() === '') continue;

      range.setStart(node, start);
      range.setEnd(node, start + len);
      const r = range.getClientRects()[0];
      if (!r || r.width === 0) continue;

      if (cs.textTransform === 'uppercase') ch = ch.toUpperCase();
      else if (cs.textTransform === 'lowercase') ch = ch.toLowerCase();

      rasterizeGlyph(
        ch,
        font,
        fontSize,
        cell,
        r.left - containerRect.left,
        r.top - containerRect.top,
        r.width,
        r.height,
        cs.color,
        pieces
      );
    }
  }

  // "Handwriting" order: line by line, glyph columns left -> right, top -> bottom.
  pieces.sort(
    (a, b) => Math.round(a.lineTop / 4) - Math.round(b.lineTop / 4) || a.tx - b.tx || a.ty - b.ty
  );
  return pieces;
}

/* ------------------------------------------------------------------ */
/* SVG pixel art: paint rects onto a unit grid (later rects win)       */
/* ------------------------------------------------------------------ */

function svgPieces(svg: SVGSVGElement, containerRect: DOMRect): PixelPiece[] {
  const sr = svg.getBoundingClientRect();
  if (sr.width === 0 || sr.height === 0) return [];
  const vb = svg.viewBox?.baseVal;
  const vw = vb && vb.width ? vb.width : sr.width;
  const vh = vb && vb.height ? vb.height : sr.height;
  const vx0 = vb?.x || 0;
  const vy0 = vb?.y || 0;

  // Default preserveAspectRatio = xMidYMid meet
  const s = Math.min(sr.width / vw, sr.height / vh);
  const ox = sr.left - containerRect.left + (sr.width - vw * s) / 2;
  const oy = sr.top - containerRect.top + (sr.height - vh * s) / 2;

  const cols = Math.ceil(vw);
  const grid = new Map<number, string>();

  svg.querySelectorAll('rect').forEach((r) => {
    let fill = r.getAttribute('fill');
    if (!fill || fill === 'currentColor') fill = getComputedStyle(r).fill;
    if (isTransparent(fill)) return;
    const x = (parseFloat(r.getAttribute('x') || '0') || 0) - vx0;
    const y = (parseFloat(r.getAttribute('y') || '0') || 0) - vy0;
    const w = parseFloat(r.getAttribute('width') || '0') || 0;
    const h = parseFloat(r.getAttribute('height') || '0') || 0;
    for (let uy = Math.floor(y); uy < Math.ceil(y + h); uy++) {
      for (let ux = Math.floor(x); ux < Math.ceil(x + w); ux++) {
        if (ux >= 0 && uy >= 0 && ux < cols) grid.set(uy * cols + ux, fill!);
      }
    }
  });

  const pieces: PixelPiece[] = [];
  grid.forEach((color, key) => {
    const ux = key % cols;
    const uy = Math.floor(key / cols);
    // Rounded edges from neighbouring cells -> no seams between pixels.
    const px = Math.round(ox + ux * s);
    const py = Math.round(oy + uy * s);
    const pw = Math.round(ox + (ux + 1) * s) - px;
    const ph = Math.round(oy + (uy + 1) * s) - py;
    pieces.push(makePiece(px, py, pw, ph, color, py));
  });
  return pieces;
}

/* ------------------------------------------------------------------ */
/* Boxes & rings: real border widths, colours and radius               */
/* ------------------------------------------------------------------ */

function boxPieces(element: Element, containerRect: DOMRect, borderOnly: boolean): PixelPiece[] {
  const cs = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const L = rect.left - containerRect.left;
  const T = rect.top - containerRect.top;
  const W = rect.width;
  const H = rect.height;
  if (W === 0 || H === 0) return [];

  const bt = parseFloat(cs.borderTopWidth) || 0;
  const br = parseFloat(cs.borderRightWidth) || 0;
  const bb = parseFloat(cs.borderBottomWidth) || 0;
  const bl = parseFloat(cs.borderLeftWidth) || 0;
  const radius = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, W / 2, H / 2);

  let fill: string | null = null;
  if (!borderOnly) {
    if (!isTransparent(cs.backgroundColor)) fill = cs.backgroundColor;
    else if (cs.backgroundImage !== 'none') fill = '#090d1a';
  }

  // Fully round element -> pixel circle
  if (radius >= Math.min(W, H) / 2 - 1 && Math.min(W, H) > 8) {
    return circlePieces(L, T, W, H, Math.max(bt, 2), cs.borderTopColor, fill);
  }

  const SEG = 8;
  const pieces: PixelPiece[] = [];
  const insideRounded = (x: number, y: number) => {
    if (radius < 3) return true;
    const cx = Math.min(Math.max(x, radius), W - radius);
    const cy = Math.min(Math.max(y, radius), H - radius);
    return Math.hypot(x - cx, y - cy) <= radius;
  };
  const span = (from: number, to: number) => {
    const out: [number, number][] = [];
    for (let p = from; p < to - 0.5; p += SEG) out.push([p, Math.min(SEG, to - p)]);
    return out;
  };

  // Outline first, traced clockwise from the top-left corner.
  if (bt > 0)
    for (const [x, w] of span(0, W))
      if (insideRounded(x + w / 2, bt / 2)) pieces.push(makePiece(L + x, T, w, bt, cs.borderTopColor, T));
  if (br > 0)
    for (const [y, h] of span(bt, H - bb))
      if (insideRounded(W - br / 2, y + h / 2))
        pieces.push(makePiece(L + W - br, T + y, br, h, cs.borderRightColor, T));
  if (bb > 0)
    for (const [x, w] of span(0, W).reverse())
      if (insideRounded(x + w / 2, H - bb / 2))
        pieces.push(makePiece(L + x, T + H - bb, w, bb, cs.borderBottomColor, T));
  if (bl > 0)
    for (const [y, h] of span(bt, H - bb).reverse())
      if (insideRounded(bl / 2, y + h / 2)) pieces.push(makePiece(L, T + y, bl, h, cs.borderLeftColor, T));

  // Then fill the inside, top -> bottom.
  if (fill) {
    for (const [y, h] of span(bt, H - bb))
      for (const [x, w] of span(bl, W - br))
        if (insideRounded(x + w / 2, y + h / 2)) pieces.push(makePiece(L + x, T + y, w, h, fill, T));
  }
  return pieces;
}

function circlePieces(
  L: number,
  T: number,
  W: number,
  H: number,
  bw: number,
  border: string,
  fill: string | null
): PixelPiece[] {
  const cell = Math.max(2, Math.min(4, Math.round(bw)));
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2;
  const ring: { p: PixelPiece; a: number }[] = [];
  const inner: { p: PixelPiece; d: number }[] = [];

  for (let y = 0; y < H; y += cell) {
    for (let x = 0; x < W; x += cell) {
      const d = Math.hypot(x + cell / 2 - cx, y + cell / 2 - cy);
      if (d > R) continue;
      if (d >= R - bw) {
        ring.push({
          p: makePiece(L + x, T + y, cell, cell, border, T),
          a: (Math.atan2(y - cy, x - cx) + Math.PI * 2.5) % (Math.PI * 2),
        });
      } else if (fill) {
        inner.push({ p: makePiece(L + x, T + y, cell, cell, fill, T), d });
      }
    }
  }
  ring.sort((a, b) => a.a - b.a);
  inner.sort((a, b) => b.d - a.d);
  return [...ring.map((r) => r.p), ...inner.map((r) => r.p)];
}

/**
 * Extract pixel pieces for any DOM element (pixel-art, text, box, ring)
 */
export function piecesOf(
  element: HTMLElement,
  containerRect: DOMRect,
  type: 'pixel-art' | 'text' | 'box' | 'ring' = 'text'
): PixelPiece[] {
  if (type === 'pixel-art') {
    const svgs = Array.from(element.querySelectorAll('svg'));
    if (element instanceof SVGSVGElement) svgs.push(element);
    const pieces = svgs.flatMap((svg) => svgPieces(svg, containerRect));

    // Built from the ground up, centre outwards.
    const cx = pieces.reduce((s, p) => s + p.tx, 0) / Math.max(1, pieces.length);
    pieces.sort((a, b) => b.ty - a.ty || Math.abs(a.tx - cx) - Math.abs(b.tx - cx));

    // Perch / support block underneath goes in first.
    const perch = element.querySelector('.shadow-pixel');
    return perch ? [...boxPieces(perch, containerRect, false), ...pieces] : pieces;
  }

  if (type === 'text') return textPieces(element, containerRect);
  return boxPieces(element, containerRect, type === 'ring');
}

export type BuildStyle = 'kinetic' | 'scan' | 'drop' | 'flank';
export type BotMode = 'building' | 'floating' | 'perched';

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

  buildStyle: BuildStyle;
  mode: BotMode;
  idleTargetX: number;
  idleTargetY: number;
  floatFreq: number;
  floatAmp: number;
  stuntAngle: number;
  emote: string | null;
  emoteTimer: number;
  sonarRadius: number;
  sonarTimer: number;

  cursor: number; // next piece index to launch
  rate: number;   // pieces launched per second
  landed: number; // pieces that reached home
}

export const BOT_SHADES = [
  { primary: '#dc2626', eye: '#38bdf8' }, // Spidey Red & Cyan
  { primary: '#0284c7', eye: '#facc15' }, // Web Navy & Gold
  { primary: '#b91c1c', eye: '#22d3ee' }, // Crimson & Blue
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

const PERCHED_LEGS = [
  '..llll..llll..',
  '.l..........l.',
];

export function drawSpiderBot(
  ctx: CanvasRenderingContext2D,
  bot: SpiderBotAgent,
  scale: number,
  time: number
) {
  ctx.save();

  // Acrobatic flip / barrel roll rotation
  if (bot.stuntAngle > 0) {
    ctx.translate(bot.x, bot.y);
    ctx.rotate((bot.stuntAngle * Math.PI) / 180);
    ctx.translate(-bot.x, -bot.y);
  }

  const spriteW = 12 * scale;
  const spriteH = 7 * scale;
  const startX = Math.round(bot.x - spriteW / 2);
  const startY = Math.round(bot.y - spriteH);

  // 1. Draw Build-Style specific visual effects
  if (bot.mode === 'building') {
    if (bot.buildStyle === 'scan') {
      // Vertical cyan laser scanner beam
      const beamHeight = 45;
      const grad = ctx.createLinearGradient(bot.x, startY + spriteH, bot.x, startY + spriteH + beamHeight);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(bot.x - 7, startY + spriteH, 14, beamHeight);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bot.x - 0.75, startY + spriteH, 1.5, beamHeight * 0.75);
    }
  }

  // 2. Draw Main Spider-Bot Pixel Body
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

  // 3. Draw Legs (Grounded when perched, or jet thrusters when airborne)
  if (bot.mode === 'perched') {
    ctx.fillStyle = '#1e293b';
    PERCHED_LEGS.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 'l') {
          ctx.fillRect(startX + c * scale - 1, startY + spriteH + r * scale, scale, scale);
        }
      }
    });
  } else if (bot.fly) {
    const pulse = Math.floor(time / 70) % 2;
    ctx.fillStyle = '#38bdf8';
    ctx.globalAlpha = 0.85;
    const jetY = startY + spriteH;
    const flameH = scale * (pulse ? 1.4 : 2.2);
    ctx.fillRect(startX + 3 * scale, jetY, scale * 2, flameH);
    ctx.fillRect(startX + 7 * scale, jetY, scale * 2, flameH);
    ctx.globalAlpha = 1.0;

    if (bot.mode === 'floating' && pulse) {
      ctx.fillStyle = '#38bdf8';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(startX + 5 * scale, jetY + flameH + 2, 2, 2);
      ctx.globalAlpha = 1.0;
    }
  }

  // 4. Sonar Radar Pulse Ring
  if (bot.sonarRadius > 0) {
    ctx.strokeStyle = '#38bdf8';
    ctx.globalAlpha = Math.max(0, 1 - bot.sonarRadius / 40);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bot.x, bot.y, bot.sonarRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // 5. Mini Pixel Emote Speech Bubble
  if (bot.emote) {
    const bubbleW = 18;
    const bubbleH = 14;
    const bx = Math.round(bot.x - bubbleW / 2);
    const by = Math.round(startY - bubbleH - 4);

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(bx, by, bubbleW, bubbleH);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bubbleW, bubbleH);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(bot.x - 1, by + bubbleH, 2, 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bot.emote, bot.x, by + bubbleH / 2);
  }

  ctx.restore();
}
