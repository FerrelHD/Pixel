# Spider-Bot Pixel Build Design

## 1. Intent and Context

The user wants the hero section build animation in the Spidey Pixel portfolio to authentically construct elements in their actual visual geometry (exact borders, gold corner brackets, text glyphs, badges, and sprites), inspired directly by Samuel Rizzon's portfolio (`samuelrizzon.dev`), adapted to the Spider-Man retro superhero theme.

Rather than generic floating pixel chunks, a dedicated crew of miniature Spider-Bots will actively assemble the interface on an in-situ canvas overlay before seamlessly transitioning to interactive DOM elements.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Authentic Shape Rasterization**: Every element marked for build (`[data-build]`) must be rasterized to its real visual silhouette:
  - Text: exact glyph rasterization per character matching font family (`Silkscreen`, `Press Start 2P`), size, weight, and baseline.
  - RPG Dialogue Box: outer beveled frame, arcade gold corner brackets, transmission nameplate, subtitle, and action arrow.
  - Pixel Spidey / Sprites: pixel-by-pixel color blocks matching the sprite.
  - Buttons & Badges: exact border lines, background fills, and icons.
- **Spider-Bot Crew Choreography**: A crew of 3 specialized Spider-Bots divides the workload across components so the animation remains legible, dynamic, and fast (target total build duration: 2 to 3 seconds).
- **Post-Build Idle Transition**: Once building finishes, the bots smoothly transition to idle modes (perching on the dialogue box frame or hovering in the background) and stay interactive (reacting to pointer proximity and clicks).
- **Per-Reload Intro Execution**: The build animation runs on initial load and replays on every browser refresh (no persistent storage lockout), ensuring the authentic pixel build experience is always viewable on reload while remaining skippable via Escape.
- **Escape & Skip Control**: Provide an accessible "Skip Intro [Esc]" button that instantly resolves all elements to solid DOM without delay.
- **Audio Feedback**: Integrate 8-bit chiptune sound effects (web thwips, pixel placement blips) honoring the global mute toggle.

### Non-Goals
- Animating builds on scroll for lower sections (user explicitly chose initial load only).
- Replacing standard DOM interactive controls with canvas-only elements (the canvas is strictly an overlay for the assembly phase; real HTML buttons, links, and accessibility trees take over as solid elements).

### Anti-Goals
- Slow, sluggish loading sequences exceeding 3.5 seconds.
- Blocky, unrecognizable pixel squares that do not resemble the target components.
- Blocking keyboard navigation or breaking mobile responsive viewports.

---

## 3. Constraints
- **Performance**: High 60fps canvas animation with minimal garbage collection. All pixel rasterization occurs once into cached arrays during init.
- **Antislop & Quality**: Clean, deliberate visual identity. No fake buzzwords, no dead buttons, no unhandled states.
- **Device Support**: Handle DPR scaling up to 2x cleanly without blurring pixel art. Responsive layouts down to 360px mobile viewports.
- **No Em Dashes**: Respect R-02 across all copy and text strings.

---

## 4. Detailed Architecture and User Decisions

### 4.1 Trigger & Lifecycle
1. **Initial Load**:
   - `HeroSection` mounts with `HeroPixelBuilder`.
   - `[data-build]` elements in Hero have `inert` and are visually hidden (`opacity: 0`, `pointer-events: none`).
   - The primary focusable control is the "Skip Intro [Esc]" button.
   - Global `FlyingSpiderBotCompanion` remains dormant/silent during the Hero build phase to prevent audio/bubble chatter conflict.
2. **Staged Work Distribution & Choreography**:
   - Total animation duration budget: 2.4 to 2.8 seconds.
   - Phase 1 (t=0.0s - 1.2s): Bot 1 ("The Weaver") begins tracing the outer frame, border trim, and arcade gold corner brackets with energy threads.
   - Phase 2 (t=0.6s - 2.2s): Bot 2 ("The Typist") starts laser-rasterizing text glyphs line-by-line inside the dialogue box once the frame is defined.
   - Phase 3 (t=0.8s - 2.4s): Bot 3 ("The Armorer") installs the nameplate badge, action indicators, Spidey sprite, and CTA buttons.
3. **Landing & Settle**:
   - Each pixel piece travels from the bot's position to its target `(tx, ty)` using spring/ease physics.
   - When all pieces for an element job arrive, the element switches to `data-solid="true"` with a brief 0.12s hold and 0.2s crossfade.
   - `inert` is removed from DOM elements as they become solid.
4. **Completion & Idle**:
   - Skip button smoothly fades out.
   - Bots transition to perched / floating idle states with occasional speech bubbles ("All clear, Spidey!", "Grid calibrated.").
   - Global `FlyingSpiderBotCompanion` resumes its normal ambient patrol.

### 4.2 Rasterization Pipeline
- **Text Rasterizer**: Offscreen scratch canvas renders each visible character in the styled font. Pixels with alpha coverage >= 35% produce `PixelPiece` units matching container lattice coordinates.
- **Box & Frame Rasterizer**: Analyzes CSS computed styles (borders, radius, background) and extracts:
  - Exact border edge spans (1 to 4px crisp lines).
  - Corner brackets (3x3 / 4x4 gold square accents).
  - Solid background fill in crisp grid cells.
- **Pixel Art / SVG**: Downsamples SVGs and icons directly into cell units so their real shapes appear on the canvas.

### 4.3 Sound Synth Integration
- Uses `soundSynth` to trigger brief, non-fatiguing 8-bit frequency clicks at a throttled rate (max ~15-20 sound triggers per second) so audio stays punchy and doesn't distort.

---

## 5. What is Left to the Builder
- Fine-tuning exact spring constants (`k`, `d`) and flight speed multipliers to hit precisely 2.4 - 2.8 seconds total duration.
- Exact styling and positioning of the "Skip intro [Esc]" HUD pill in the top-right corner of the Hero container.
- Specific speech bubble quip strings tailored to Spidey lore.

