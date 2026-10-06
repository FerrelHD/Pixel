// 2D Flight Physics & Autonomous Waypoint Seeker for Flying Spider-Bots
// Inspired by boids flocking, steering behaviors, and Samuel Rizzon's agent builder

export interface Waypoint {
  x: number;
  y: number;
  action?: 'deposit' | 'web-stitch' | 'stamp' | 'patrol';
  color?: string;
  label?: string;
}

export interface FlyingBot {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  angle: number;
  size: number;
  eyeColor: string;
  armorColor: string;
  waypoints: Waypoint[];
  currentWaypointIndex: number;
  carryingBlock: { color: string; size: number } | null;
  trail: { x: number; y: number; alpha: number }[];
  isDone: boolean;
}

export interface PlacedBlock {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
}

export class FlightEngine {
  public bots: FlyingBot[] = [];
  public placedBlocks: PlacedBlock[] = [];
  public width = 1200;
  public height = 800;
  private onBlockPlaced?: (block: PlacedBlock) => void;

  constructor(width: number, height: number, onBlockPlaced?: (b: PlacedBlock) => void) {
    this.width = width;
    this.height = height;
    this.onBlockPlaced = onBlockPlaced;
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public initIntroCrew() {
    this.bots = [];
    this.placedBlocks = [];

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // BOT 01 (Alpha - Red Eyes): Name builder (flies across top)
    const nameY = centerY - 140;
    const nameWaypoints: Waypoint[] = [];
    const letters = 12; // "FERREL RASHAD"
    const startX = centerX - 180;
    for (let i = 0; i <= letters; i++) {
      nameWaypoints.push({
        x: startX + i * 30,
        y: nameY + (i % 2 === 0 ? -4 : 4),
        action: 'deposit',
        color: '#dc2626',
      });
    }

    this.bots.push({
      id: 'bot-01',
      x: -50,
      y: 100,
      vx: 6,
      vy: 2,
      speed: 6.5,
      angle: 0,
      size: 26,
      eyeColor: '#ef4444',
      armorColor: '#b91c1c',
      waypoints: nameWaypoints,
      currentWaypointIndex: 0,
      carryingBlock: { color: '#dc2626', size: 10 },
      trail: [],
      isDone: false,
    });

    // BOT 02 (Beta - Cyan Eyes): Dialogue Box Perimeter Weaver
    const boxX = centerX - 240;
    const boxY = centerY + 40;
    const boxW = 480;
    const boxH = 110;
    const boxWaypoints: Waypoint[] = [
      { x: boxX, y: boxY, action: 'web-stitch', color: '#38bdf8' },
      { x: boxX + boxW, y: boxY, action: 'web-stitch', color: '#38bdf8' },
      { x: boxX + boxW, y: boxY + boxH, action: 'web-stitch', color: '#38bdf8' },
      { x: boxX, y: boxY + boxH, action: 'web-stitch', color: '#38bdf8' },
      { x: boxX, y: boxY, action: 'web-stitch', color: '#38bdf8' },
    ];

    this.bots.push({
      id: 'bot-02',
      x: this.width + 50,
      y: centerY - 50,
      vx: -7,
      vy: 1,
      speed: 7.2,
      angle: Math.PI,
      size: 30,
      eyeColor: '#38bdf8',
      armorColor: '#1e3a8a',
      waypoints: boxWaypoints,
      currentWaypointIndex: 0,
      carryingBlock: { color: '#38bdf8', size: 12 },
      trail: [],
      isDone: false,
    });

    // BOT 03 (Gamma - Gold Eyes): Command Buttons Stamper
    const btnY = centerY + 190;
    const btnWaypoints: Waypoint[] = [
      { x: centerX - 180, y: btnY, action: 'stamp', color: '#facc15' },
      { x: centerX - 60, y: btnY, action: 'stamp', color: '#38bdf8' },
      { x: centerX + 60, y: btnY, action: 'stamp', color: '#10b981' },
      { x: centerX + 180, y: btnY, action: 'stamp', color: '#ef4444' },
      { x: this.width - 80, y: this.height - 80, action: 'patrol' },
    ];

    this.bots.push({
      id: 'bot-03',
      x: centerX,
      y: -60,
      vx: 0,
      vy: 8,
      speed: 8.0,
      angle: Math.PI / 2,
      size: 28,
      eyeColor: '#facc15',
      armorColor: '#b45309',
      waypoints: btnWaypoints,
      currentWaypointIndex: 0,
      carryingBlock: { color: '#facc15', size: 10 },
      trail: [],
      isDone: false,
    });
  }

  public update(): boolean {
    let allFinished = true;

    for (const bot of this.bots) {
      if (bot.currentWaypointIndex >= bot.waypoints.length) {
        bot.isDone = true;
        continue;
      }

      allFinished = false;
      const target = bot.waypoints[bot.currentWaypointIndex];

      // Steering towards target waypoint
      const dx = target.x - bot.x;
      const dy = target.y - bot.y;
      const dist = Math.hypot(dx, dy);

      // Desired velocity
      const targetAngle = Math.atan2(dy, dx);
      // Smooth angle interpolation
      bot.angle += (targetAngle - bot.angle) * 0.18;

      bot.vx = Math.cos(bot.angle) * bot.speed;
      bot.vy = Math.sin(bot.angle) * bot.speed;

      bot.x += bot.vx;
      bot.y += bot.vy;

      // Add web trail particle
      bot.trail.unshift({ x: bot.x, y: bot.y, alpha: 0.9 });
      if (bot.trail.length > 18) {
        bot.trail.pop();
      }

      // Check arrival at waypoint
      if (dist < 18) {
        // Deposit or stamp block
        if (target.action === 'deposit' || target.action === 'stamp') {
          const newBlock: PlacedBlock = {
            x: target.x,
            y: target.y,
            size: bot.carryingBlock?.size || 10,
            color: target.color || '#facc15',
            alpha: 1.0,
          };
          this.placedBlocks.push(newBlock);
          if (this.onBlockPlaced) this.onBlockPlaced(newBlock);
        } else if (target.action === 'web-stitch') {
          // Draw border segment
          for (let s = 0; s < 4; s++) {
            this.placedBlocks.push({
              x: target.x + (Math.random() - 0.5) * 16,
              y: target.y + (Math.random() - 0.5) * 16,
              size: 8,
              color: '#38bdf8',
              alpha: 0.9,
            });
          }
        }

        bot.currentWaypointIndex++;
      }
    }

    // Fade trail
    for (const bot of this.bots) {
      for (const t of bot.trail) {
        t.alpha -= 0.04;
      }
    }

    return allFinished;
  }

  public render(ctx: CanvasRenderingContext2D) {
    // 1. Draw web trails
    for (const bot of this.bots) {
      if (bot.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(bot.trail[0].x, bot.trail[0].y);
        for (let i = 1; i < bot.trail.length; i++) {
          ctx.lineTo(bot.trail[i].x, bot.trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // 2. Draw placed pixel blocks
    for (const block of this.placedBlocks) {
      ctx.fillStyle = block.color;
      ctx.globalAlpha = block.alpha;
      ctx.fillRect(
        block.x - block.size / 2,
        block.y - block.size / 2,
        block.size,
        block.size
      );
      // Dark border on pixel block
      ctx.strokeStyle = '#050710';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        block.x - block.size / 2,
        block.y - block.size / 2,
        block.size,
        block.size
      );
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw flying Spider-Bots
    for (const bot of this.bots) {
      ctx.save();
      ctx.translate(bot.x, bot.y);
      ctx.rotate(bot.angle + Math.PI / 2);

      // Bot Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(-bot.size / 2 + 3, -bot.size / 2 + 5, bot.size, bot.size);

      // Bot Shell (Armor)
      ctx.fillStyle = bot.armorColor;
      ctx.fillRect(-bot.size / 2, -bot.size / 2, bot.size, bot.size);

      // Glowing Core / Web Nozzle
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-bot.size / 4, -bot.size / 4, bot.size / 2, bot.size / 2);

      // Glowing Eyes
      ctx.fillStyle = bot.eyeColor;
      ctx.fillRect(-bot.size / 3, -bot.size / 3, 4, 4);
      ctx.fillRect(bot.size / 3 - 4, -bot.size / 3, 4, 4);

      // Thruster flame / Web jet behind bot
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-3, bot.size / 2, 6, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-2, bot.size / 2 + 4, 4, 6);

      // Carrying Block
      if (bot.carryingBlock && bot.currentWaypointIndex < bot.waypoints.length) {
        ctx.fillStyle = bot.carryingBlock.color;
        ctx.fillRect(
          -bot.carryingBlock.size / 2,
          -bot.size / 2 - bot.carryingBlock.size,
          bot.carryingBlock.size,
          bot.carryingBlock.size
        );
      }

      ctx.restore();
    }
  }
}
