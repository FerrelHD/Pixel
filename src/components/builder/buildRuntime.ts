// Shared simulation for the in-situ pixel builders (hero + sections).
import { piecesOf, PixelPiece, SpiderBotAgent } from '../../utils/pixelEngine';

/** Pieces stay fully opaque while the DOM fades in underneath, then drop out. */
export const HOLD_TIME = 0.12;
export const FADE_TIME = 0.2;

const MIN_RATE = 450;       // pieces / second for small elements
const MAX_BUILD_TIME = 2.4; // big elements never take longer than this
const AIM_WINDOW = 48;      // bot aims at the centre of the last N launched pieces

export const buildRate = (total: number) => Math.max(MIN_RATE, total / MAX_BUILD_TIME);

export interface ElementJob {
  el: HTMLElement;
  group: string;
  pieces: PixelPiece[];
  remaining: number;
  ready: boolean;   // all pieces landed
  isSolid: boolean; // DOM shown
  parent: number;   // nearest [data-build] ancestor job, -1 if none
}

type BuildType = 'pixel-art' | 'text' | 'box' | 'ring';

export function createJobs(container: HTMLElement, containerRect: DOMRect, alreadySolid: boolean): ElementJob[] {
  const els = Array.from(container.querySelectorAll<HTMLElement>('[data-build]'));
  const jobs: ElementJob[] = els.map((el, i) => {
    const pieces = alreadySolid ? [] : piecesOf(el, containerRect, (el.dataset.build as BuildType) || 'text');
    pieces.forEach((p) => (p.owner = i));
    return {
      el,
      group: el.dataset.crew || el.dataset.build || 'default',
      pieces,
      remaining: pieces.length,
      ready: alreadySolid,
      isSolid: alreadySolid,
      parent: -1,
    };
  });
  jobs.forEach((job) => {
    const anc = job.el.parentElement?.closest<HTMLElement>('[data-build]');
    if (anc) job.parent = els.indexOf(anc);
  });
  jobs.forEach((job, i) => {
    if (!job.isSolid && job.pieces.length === 0) markReady(jobs, i);
  });
  return jobs;
}

/** Show the DOM only once its own pixels landed AND its [data-build] container is visible. */
function settle(jobs: ElementJob[], i: number) {
  const job = jobs[i];
  if (job.isSolid || !job.ready) return;
  if (job.parent >= 0 && !jobs[job.parent].isSolid) return;
  job.isSolid = true;
  job.el.setAttribute('data-solid', 'true');
  job.pieces.forEach((p) => {
    p.state = 'fading';
    p.f = 0;
  });
  jobs.forEach((j, k) => {
    if (j.parent === i) settle(jobs, k);
  });
}

function markReady(jobs: ElementJob[], i: number) {
  jobs[i].ready = true;
  settle(jobs, i);
}

export function finishAll(jobs: ElementJob[], agents: SpiderBotAgent[], idleMode: (a: SpiderBotAgent) => 'floating' | 'perched') {
  jobs.forEach((job) => {
    job.ready = job.isSolid = true;
    job.remaining = 0;
    job.el.setAttribute('data-solid', 'true');
    job.pieces.forEach((p) => (p.state = 'gone'));
  });
  agents.forEach((a) => {
    a.cursor = a.landed = a.job.length;
    if (a.mode === 'building') {
      a.mode = idleMode(a);
      a.x = a.idleTargetX;
      a.y = a.idleTargetY;
      a.vx = a.vy = 0;
    }
  });
}

function spring(a: SpiderBotAgent, tx: number, ty: number, k: number, d: number, dt: number) {
  a.vx += ((tx - a.x) * k - d * a.vx) * dt;
  a.vy += ((ty - a.y) * k - d * a.vy) * dt;
  a.x += a.vx * dt;
  a.y += a.vy * dt;
}

export function stepTimers(a: SpiderBotAgent, dt: number, sonarMax: number) {
  // One clean 360° roll, then stop exactly upright.
  if (a.stuntAngle > 0) {
    a.stuntAngle += 720 * dt;
    if (a.stuntAngle >= 360) a.stuntAngle = 0;
  }
  if (a.emoteTimer > 0) {
    a.emoteTimer -= dt;
    if (a.emoteTimer <= 0) a.emote = null;
  }
  a.sonarTimer -= dt;
  if (a.sonarTimer <= 0) {
    a.sonarRadius = 1;
    a.sonarTimer = 6 + Math.random() * 5;
  }
  if (a.sonarRadius > 0) {
    a.sonarRadius += sonarMax * dt;
    if (a.sonarRadius > sonarMax) a.sonarRadius = 0;
  }
  a.blink -= dt;
  if (a.blink <= -3) a.blink = 0.15;
}

/** Launch pieces at a steady rate and glide the bot over the work. Returns true when its job is done. */
export function stepBuilding(a: SpiderBotAgent, dt: number, now: number, onLaunch: () => void): boolean {
  if (a.delay > 0) {
    a.delay -= dt;
    return false;
  }
  a.t += dt;
  const job = a.job;
  const target = Math.min(job.length, Math.floor(a.t * a.rate) + 1);
  while (a.cursor < target) {
    const p = job[a.cursor++];
    if (p.state !== 'waiting') continue;
    p.state = 'flying';
    p.f = 0;
    p.ox = a.x + (Math.random() - 0.5) * 8;
    p.oy = a.y - 4;
    onLaunch();
  }

  const from = Math.max(0, a.cursor - AIM_WINDOW);
  const n = a.cursor - from;
  if (n > 0) {
    let sx = 0;
    let sy = 0;
    for (let i = from; i < a.cursor; i++) {
      sx += job[i].tx + job[i].tw / 2;
      sy += job[i].ty;
    }
    let tx = sx / n;
    let ty = sy / n - 26;
    if (a.buildStyle === 'kinetic') {
      tx += Math.cos(now / 220) * 8;
      ty -= 6;
    } else if (a.buildStyle === 'scan') {
      ty = sy / n - 34;
    } else if (a.buildStyle === 'drop') {
      ty = sy / n - 22;
    }
    // Slightly over-damped (critical ≈ 2√170 ≈ 26) -> glides without wobble.
    spring(a, tx, ty, 170, 28, dt);
    if (Math.abs(a.vx) > 20) a.face = Math.sign(a.vx);
  }
  return a.landed >= job.length;
}

export function stepIdle(a: SpiderBotAgent, dt: number, now: number, mouse: { x: number; y: number }) {
  const hoverBob = Math.sin((now / 1000) * a.floatFreq) * a.floatAmp;
  let tx = a.idleTargetX;
  let ty = a.idleTargetY + hoverBob;

  if (mouse.x > 0 && mouse.y > 0) {
    const dx = mouse.x - a.x;
    const dy = mouse.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (Math.abs(dx) > 4) a.face = dx > 0 ? 1 : -1;
    if (dist < 55) {
      tx -= (dx / dist) * 16;
      ty -= (dy / dist) * 16;
    }
  }
  if (a.id === 3 && a.mode === 'floating') tx += Math.sin(now / 1600) * 80;

  spring(a, tx, ty, 45, 13.5, dt);
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.3;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const quietAgents = new WeakSet<SpiderBotAgent>();

export function stepPieces(a: SpiderBotAgent, dt: number, jobs: ElementJob[]) {
  if (quietAgents.has(a)) return;
  let active = a.cursor < a.job.length;

  for (let i = 0; i < a.cursor; i++) {
    const p = a.job[i];
    if (p.state === 'flying') {
      active = true;
      p.f = Math.min(1, p.f + dt / p.dur);
      const f = p.f;
      const dx = p.tx - p.ox;
      const dy = p.ty - p.oy;

      if (a.buildStyle === 'kinetic') {
        const e = easeOutCubic(f);
        p.x = p.ox + dx * e;
        p.y = p.oy + dy * e - Math.sin(f * Math.PI) * 14;
      } else if (a.buildStyle === 'drop') {
        p.x = p.ox + dx * easeOutCubic(f);
        const g = f * f;
        const bounce = f > 0.82 ? Math.sin(((f - 0.82) / 0.18) * Math.PI) * 2 : 0;
        p.y = p.oy + dy * g - bounce;
      } else if (a.buildStyle === 'flank') {
        p.x = p.ox + dx * easeOutCubic(Math.min(1, f * 1.5));
        p.y = p.oy + dy * easeOutBack(f);
      } else {
        const e = easeOutBack(f);
        p.x = p.ox + dx * e;
        p.y = p.oy + dy * e;
      }

      if (f >= 1) {
        p.state = 'home';
        p.x = p.tx;
        p.y = p.ty;
        a.landed++;
        const job = jobs[p.owner];
        if (job && --job.remaining === 0) markReady(jobs, p.owner);
      }
    } else if (p.state === 'fading') {
      active = true;
      p.f += dt;
      if (p.f >= HOLD_TIME + FADE_TIME) p.state = 'gone';
    } else if (p.state === 'home') {
      active = true; // waiting on a parent container
    }
  }
  if (!active && a.mode !== 'building') quietAgents.add(a);
}

/** Draw in document order (containers under their children), snapped to device pixels. */
export function drawPieces(ctx: CanvasRenderingContext2D, jobs: ElementJob[], dpr: number) {
  let last = '';
  for (const job of jobs) {
    const n = job.pieces.length;
    if (n === 0 || (job.isSolid && job.pieces[n - 1].state === 'gone')) continue;
    for (const p of job.pieces) {
      if (p.state === 'waiting' || p.state === 'gone') continue;
      ctx.globalAlpha =
        p.state === 'fading' ? Math.max(0, 1 - Math.max(0, p.f - HOLD_TIME) / FADE_TIME) : 1;
      if (p.color !== last) {
        ctx.fillStyle = p.color;
        last = p.color;
      }
      ctx.fillRect(Math.round(p.x * dpr) / dpr, Math.round(p.y * dpr) / dpr, p.tw, p.th);
    }
  }
  ctx.globalAlpha = 1;
}
