# Spider-Bot Pixel Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an authentic retro pixel assembly animation for the Spidey Pixel hero section, where a crew of 3 specialized Spider-Bots constructs the interface in its true geometric shape (text glyphs, beveled frames, gold corner brackets, badges, and buttons) before transitioning to solid DOM.

**Architecture:** An in-situ HTML5 canvas overlay in `HeroPixelBuilder` uses an offscreen rasterization pipeline (`pixelEngine.ts`) to extract exact pixel coordinates and colors from styled DOM nodes. A choreographed 3-phase runtime (`buildRuntime.ts`) dispatches pieces across 3 Spider-Bots (Weaver, Typist, Armorer) over 2.4 - 2.8 seconds. Elements stay `inert` and hidden during build, transitioning to solid DOM on piece arrival or instant Escape key press.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, HTML5 Canvas 2D, Web Audio API (`soundSynth`).

**Spec:** `docs/superpowers/specs/2026-10-19-spider-bot-pixel-build-design.md`

## Global Constraints
- Target total animation duration: 2.4 to 2.8 seconds.
- Replays on every browser refresh; skippable immediately via Escape or "Skip intro [Esc]" button.
- Strictly hero-scoped; lower sections remain solid DOM immediately.
- Must support device pixel ratios up to 2x without blurry scaling.
- Audio events must respect the global mute state and throttle to a maximum of 15-20 sound triggers per second.
- Absolutely no em dash (`—`) characters in copy, labels, or code comments per R-02.

## Review Focus
1. Escape key pressed immediately at t=0s before fonts or layouts finish computing: must immediately solid-render all elements and clear canvas without throwing null reference errors.
2. High DPR (Retina/2x) scaling: canvas width/height must scale by DPR while CSS size matches container to keep crisp square pixels.
3. Rapid clicking / hover near Spider-Bots during flight: stunts and emotes must not corrupt flight physics or piece landing coordinates.
4. Mute toggle pressed mid-flight: audio synthesis must instantly silence without hanging oscillators.
5. Window resize during active build: canvas size and container bounds must recalibrate without losing in-flight piece targets.

---

### Task 1: Authentic Pixel Rasterization Pipeline & Unit Tests

**Files:**
- Modify: `src/utils/pixelEngine.ts`
- Create: `tests/pixelEngine.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: DOM nodes with `[data-build]`, computed styles, font declarations.
- Produces: `piecesOf(element: HTMLElement, containerRect: DOMRect, type: BuildType): PixelPiece[]` returning exact pixel geometry for text, beveled boxes, gold corner accents, and SVGs.

- [ ] **Step 1: Install Vitest for engine testing**

Run: `npm install -D vitest`

- [ ] **Step 2: Write failing tests in `tests/pixelEngine.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { makePiece, circlePieces } from '../src/utils/pixelEngine';

describe('pixelEngine pieces creation', () => {
  it('creates a pixel piece with proper initial state', () => {
    const piece = makePiece(10, 20, 2, 2, '#ff0000');
    expect(piece.tx).toBe(10);
    expect(piece.ty).toBe(20);
    expect(piece.state).toBe('waiting');
  });

  it('generates circle pieces with exact bounds', () => {
    const pieces = circlePieces(0, 0, 20, 20, 2, '#ffffff', '#000000');
    expect(pieces.length).toBeGreaterThan(0);
    pieces.forEach((p) => {
      expect(p.tx).toBeGreaterThanOrEqual(0);
      expect(p.tx).toBeLessThanOrEqual(20);
    });
  });
});
```

- [ ] **Step 3: Run Vitest to verify test runner works**

Run: `npx vitest run tests/pixelEngine.test.ts`
Expected: PASS

- [ ] **Step 4: Enhance `src/utils/pixelEngine.ts` for exact shape rasterization**

Refactor `boxPieces` in `src/utils/pixelEngine.ts`:
- Ensure corners support 16-bit JRPG bevels and gold bracket corner coordinates (`.absolute.-top-1.5.-left-1.5`).
- Ensure segment sizing (`SEG`) scales down to 2-4px grid cells so borders and fills look like authentic pixel art rather than coarse 8px blocks.
- Ensure `textPieces` accounts for letter-spacing and uppercase transforms.

- [ ] **Step 5: Add rasterizer tests and verify PASS**

Add tests checking `makePiece` bounds, text rasterization fallback, and border geometry in `tests/pixelEngine.test.ts`, then run:
Run: `npx vitest run tests/pixelEngine.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/utils/pixelEngine.ts tests/pixelEngine.test.ts
git commit -m "feat(engine): enhance authentic pixel rasterization and add unit tests"
```

---

### Task 2: Staged 3-Phase Spider-Bot Runtime Orchestration

**Files:**
- Modify: `src/components/builder/buildRuntime.ts`
- Create: `tests/buildRuntime.test.ts`

**Interfaces:**
- Consumes: `ElementJob[]`, `SpiderBotAgent[]`.
- Produces: `stepBuildingStaged(agents: SpiderBotAgent[], jobs: ElementJob[], elapsed: number, dt: number): void`, `finishAll(jobs, agents, idleMode)`.

- [ ] **Step 1: Write failing test for phase scheduling in `tests/buildRuntime.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { ElementJob } from '../src/components/builder/buildRuntime';

describe('buildRuntime phase logic', () => {
  it('identifies job group assignments correctly', () => {
    const job: ElementJob = {
      el: null as any,
      group: 'dialogue-frame',
      pieces: [],
      remaining: 0,
      ready: false,
      isSolid: false,
      parent: -1,
    };
    expect(job.group).toBe('dialogue-frame');
  });
});
```

- [ ] **Step 2: Run test to verify it passes baseline**

Run: `npx vitest run tests/buildRuntime.test.ts`
Expected: PASS

- [ ] **Step 3: Implement staged 3-phase execution in `src/components/builder/buildRuntime.ts`**

- Assign Phase 1 (Weaver, Agent ID 0): target groups `['dialogue-frame', 'hud', 'box']`, active at `elapsed >= 0.0s`.
- Assign Phase 2 (Typist, Agent ID 1): target groups `['dialogue-text', 'name', 'lore', 'text']`, active at `elapsed >= 0.6s`.
- Assign Phase 3 (Armorer, Agent ID 2): target groups `['dialogue-badge', 'spidey-perch', 'actions', 'cta']`, active at `elapsed >= 0.8s`.
- Calculate piece launch rate so each bot finishes its assigned queue before `t = 2.4s`.
- Ensure `finishAll` cleanly sets all jobs to `isSolid = true`, clears in-flight pieces, and transitions bots to idle states.

- [ ] **Step 4: Verify test suite and type check**

Run: `npx vitest run`
Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/builder/buildRuntime.ts tests/buildRuntime.test.ts
git commit -m "feat(builder): add staged 3-phase Spider-Bot runtime orchestration"
```

---

### Task 3: HeroPixelBuilder Component & Skip Control Integration

**Files:**
- Modify: `src/components/builder/HeroPixelBuilder.tsx`

**Interfaces:**
- Consumes: `containerRef: React.RefObject<HTMLElement | null>`, `isMuted?: boolean`, `onComplete?: () => void`.
- Produces: Renders the full 60fps canvas build overlay, spawns 3 Spider-Bots with distinct visual roles, handles pointer interactivity, Escape key listener, and renders the "Skip intro [Esc]" HUD pill.

- [ ] **Step 1: Update `HeroPixelBuilder.tsx` to mount 3 specialized Spider-Bots**

- Bot 0 ("The Weaver"): Neon cyan sensor eye, kinetic weave build style, builds RPG box frame and outer border.
- Bot 1 ("The Typist"): Arcade gold sensor eye, laser pulse build style, writes text letters line by line.
- Bot 2 ("The Armorer"): Crimson red sensor eye, drop bounce build style, builds nameplate, buttons, and badges.

- [ ] **Step 2: Add accessible Skip Intro button and Escape key handler**

- Add HUD button in top right of hero: `Skip intro [Esc]` styled with pixel font and crisp border.
- Bind `window.addEventListener('keydown', (e) => { if (e.key === 'Escape') handleSkip(); })`.
- Ensure clicking button or pressing Escape triggers `handleSkip()`, immediately revealing all `data-solid="true"` elements and fading out the canvas overlay.

- [ ] **Step 3: Integrate throttled audio clicks**

- Hook into `soundSynth.playButtonPress` and `playWebThwip` with a rate limiter (minimum 55ms interval between sounds, max ~18 triggers/sec) so audio stays punchy without distortion.
- Respect `mutedRef.current`.

- [ ] **Step 4: Verify build and runtime**

Run: `npm run build`
Expected: PASS with 0 TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/builder/HeroPixelBuilder.tsx
git commit -m "feat(hero): integrate specialized 3-bot hero canvas with skip intro pill"
```

---

### Task 4: RpgDialogueBox & Hero DOM Component Alignment

**Files:**
- Modify: `src/components/RpgDialogueBox.tsx`
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `HeroPixelBuilder`.
- Produces: DOM markup annotated with exact `data-build` and `data-crew` attributes corresponding to the 3-phase bots; coordinates with `FlyingSpiderBotCompanion` to keep it silent during Hero build.

- [ ] **Step 1: Annotate `RpgDialogueBox.tsx` with authentic shape metadata**

- Outer 16-bit box: `data-build="box" data-crew="dialogue-frame"`
- Corner brackets: `data-build="box" data-crew="dialogue-frame"`
- Transmission nameplate: `data-build="box" data-crew="dialogue-badge"`
- Main Title text: `data-build="text" data-crew="dialogue-text"`
- Subtitle lore: `data-build="text" data-crew="dialogue-text"`
- System status footer & blinking arrow: `data-build="text" data-crew="dialogue-badge"`

- [ ] **Step 2: Update `HeroSection.tsx` and `App.tsx` for companion coordination**

- Add `isIntroBuilding` state to `HeroSection` and bubble it or coordinate via simple state so `FlyingSpiderBotCompanion` stays silent/dormant while hero build runs.
- Ensure all lower sections (`StatusSection`, `MissionsSection`, `SkillsSection`, `SignalSection`) render as solid immediately without running duplicate builders.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/RpgDialogueBox.tsx src/components/HeroSection.tsx src/App.tsx
git commit -m "feat(rpg): annotate dialogue box geometry and coordinate companion dormancy"
```

---

### Task 5: End-to-End Build, Responsive & Regression Verification

**Files:**
- Test: Full site build & Vitest suite
- Manual Verification: Browser check at `http://localhost:5173`

- [ ] **Step 1: Run complete automated test suite**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 2: Run complete production TypeScript and Vite build**

Run: `npm run build`
Expected: Exit code 0, bundled cleanly.

- [ ] **Step 3: Verify interactive behavior**

- Start dev server: `npm run dev`
- Verify Hero intro:
  - 3 Spider-Bots construct the RPG dialogue box, text, and buttons in 2.5 seconds.
  - Pressing Escape immediately skips the build to solid.
  - Clicking "Skip intro [Esc]" immediately skips.
  - Refreshing the page (F5) runs the animation cleanly again.
  - Scrolling down to Status, Missions, Skills shows them fully solid and readable.

- [ ] **Step 4: Final commit and clean up**

```bash
git status
git add .
git commit -m "chore: complete authentic spider-bot pixel build feature verification"
```

