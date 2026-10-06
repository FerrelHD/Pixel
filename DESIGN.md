# DESIGN.md: Design System & Visual Direction
## Retro Pixel-Art RPG Portfolio (Spider-Man Theme)

> **Design Read**: Developer portfolio hero for creative tech & game leads, in a 16-bit retro RPG arcade visual language, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

---

### 1. Identity & Personality
- **Identity**: Ferrel Rashad, a Friendly Neighborhood Web & Game Developer.
- **Personality**: Grounded, nostalgic, technically competent, playful yet structured. Inspired by golden-era 16-bit SNES/Genesis RPGs (Chrono Trigger, EarthBound, Spider-Man: Maximum Carnage) combined with modern clean web development craft.
- **Mood**: Midnight rooftop vigilante, city lights flickering below, retro game HUD alive with responsive tactile controls.

---

### 2. Dials (Antislop Part 3)
- **ENERGY: 2 (Balanced)**
  - Why: Strong thematic personality (Spider-Man + 16-bit pixel aesthetics) without chaotic sensory overload. Confident hero presence with deliberate focus.
- **RHYTHM: 2 (Consistent with clear breaks)**
  - Why: Clear separation between environmental backdrop (skyline canvas), protagonist focal point (Spider-Man avatar), dialogue narrative (RPG text box), and interactive deck (command menu buttons).
- **MOTION: 2 (Stepped transitions & idle loops)**
  - Why: Retro games rely on discrete frame-based animation (4-frame breathing idle, stepped typewriter, crisp button depressions) rather than generic floaty AI easings.

---

### 3. Palette & Color System (R-29 Compliant)
We restrict the active palette strictly to 2 core colors + 1 accent color, supported by deep retro neutrals:

| Token | Hex Value | Role | Why this color? (R-31) |
|---|---|---|---|
| **Core Primary (Spidey Crimson)** | `#e11d48` / `#dc2626` | Hero avatar accents, Daily Bugle neon, HP bar | Canonical Spider-Man suit red, gives immediate brand recognition. |
| **Core Secondary (Midnight Navy)** | `#0a0e1a` / `#161f38` | Sky gradient, dialogue card background, HUD borders | Replaces harsh generic pure black with atmospheric 16-bit New York night sky. |
| **Deliberate Accent (Arcade Gold)** | `#facc15` / `#f59e0b` | Dialogue prompt arrow `▼`, level badge, active button highlight | High visibility interactive indicator reminiscent of classic coin-op and RPG selection cursors. |
| **Retro Neutral Light** | `#f8fafc` | Dialogue text, button labels | Crisp readable high-contrast text meeting WCAG AAA (contrast ratio > 12:1 on dark backgrounds). |
| **Retro Neutral Shadow** | `#030712` | 1-bit solid drop-shadows and borders | Hard pixel edges without muddy blur. |

*Palette Rule Compliance*: No rainbow gradients, no generic blue-purple glow slop. Exactly 2 core hues + 1 arcade accent.

---

### 4. Typography (R-06 Compliant)
Fonts are selected strictly for authentic retro readability and nostalgia:

1. **Primary Pixel Display**: `'Press Start 2P'` (Google Fonts)
   - *Role*: Hero name header, HUD statistics (`LVL 99`, `HP`, `SP`), button labels (`STATUS`, `MISSIONS`, `SKILLS`, `SIGNAL`).
   - *Reason (R-31)*: Authentic 8x8 bitmap glyph proportion; gives indisputable arcade credibility without blur.
2. **Dialogue & Subtext**: `'Silkscreen'` / `'VT323'` (Google Fonts)
   - *Role*: RPG typewriter dialogue line, modal descriptions, project summaries.
   - *Reason (R-31)*: Higher character density and superior legibility at smaller text sizes compared to bulky pixel fonts.

---

### 5. Purpose-Gate Justifications (R-31 & Group 2)

#### Why pixelated shadows (`box-shadow: 0 4px 0 #000`)?
- *Purpose*: Recreates authentic 16-bit physical cartridge push-button depth. When clicked, the element shifts down 2px (`translate-y-[2px]`) with reduced shadow (`0 2px 0`), providing instant tactile haptic feedback for mouse and touch.

#### Why double-line pixel border on the dialogue box?
- *Purpose*: Directly references classic JRPG dialogue UI (Final Fantasy, Chrono Trigger, EarthBound). Defines visual hierarchy so the user immediately recognizes text as conversational character dialogue.

#### Why Web Audio API sound synthesis?
- *Purpose*: Zero network latency and zero asset dependency. Generates clean 8-bit square-wave bleeps for typewriter cadence and low-noise frequency-modulated clicks for buttons.

#### Why CRT Scanlines overlay?
- *Purpose*: Nostalgic atmosphere enhancing the pixel art raster grid. Built with a user-toggleable control (`[CRT: ON/OFF]`) so users who prefer flat crisp edges can disable it instantly.

---

### 6. Accessibility & Resilience (R-03, R-25, R-32)
1. **WCAG Contrast**: White text `#f8fafc` on `#0a0e1a` yields a contrast ratio of `17.4:1` (far above WCAG AA 4.5:1 requirement).
2. **Keyboard Operability**:
   - Every button is in standard `tabindex` order.
   - Custom high-contrast gold pixel focus outline (`focus-visible:outline-2 focus-visible:outline-amber-400`).
   - `Space` / `Enter` triggers button and dialogue skip.
   - `Escape` closes any opened modal.
3. **Mobile Layout**:
   - Flexbox with wrapping on screens below 768px.
   - Minimum touch target for all buttons: 44px height x 44px width.
   - Character scales down proportionally while retaining crisp pixel ratio (`image-rendering: pixelated`).

---

### 7. Anti-Slop Checkpoints
- **No Em Dashes (R-02)**: Only colons, slashes, or commas used in copy.
- **No Dead Controls (R-26)**: All 4 menu buttons open fully functioning retro dialog modals with real content.
- **No Fake Data (R-17, R-18, R-36)**: Ferrel Rashad's real skills, focus areas, and contact links are used without fabricated numbers.
