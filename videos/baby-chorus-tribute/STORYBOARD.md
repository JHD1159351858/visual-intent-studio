---
compositionId: bgm
duration_s: 39.2
canvas: {"w":1920,"h":1080,"fps":30}
mode: autonomous
style:
  font: "Inter / Space Grotesk"
  palette: ["#000000", "#FFFFFF", "#FE90E8", "#C0F7FE", "#F7CB46", "#FFFDF5"]
assets: false
build_notes:
  - "one paused timeline per frame"
  - "no remote assets; fonts live at assets/fonts"
  - "all visuals are procedural CSS/SVG/canvas; no stock footage"
avoid:
  - "lyric captions or long lyric text"
  - "official-looking artist branding or logos"
  - "flat rainbow gradients without chrome structure"
  - "small unreadable hero text"
---

## Frame 1 — f1

- src: compositions/frames/01-f1.html
- duration: 8.057s
- span_sec: [0.0, 8.057]
- pacing: beat_cut
- mood: [dark, cinematic, tense]
- feel: sparse sub-heavy build with a steady pulse, four bars of pressure before a held downbeat

### Groups

- **g1** — free_design
  - span_sec: [0.0, 6.247]
  - free_design: { dominant_system: "a single chrome heart held in a slow orbital camera push over a black flow-field bed", primitives: ["bg-flow-field", "chrome-sweep", "dolly-zoom", "kinetic-letter-in", "screen-shake"], density_topology: "hold → orbit → accumulate orbiters" }
  - anchors: [0.673, 2.058, 3.442, 4.319, 5.596, 6.211]
  - copy: ["BABY"]
  - direction: "Black stage, one 42%-scale chrome heart centered at 50/48, rotating ±8° with a specular sweep on every downbeat. A faint ring of 12 small hearts sits at 60% radius, dark chrome, barely lit. Four tiled letterforms B A B Y float at the edges as texture, never all readable at once. Beat pulses are light, not cuts: 1px white rim flash + 1.02 scale."
- **g2** — free_design
  - span_sec: [6.247, 8.057]
  - free_design: { dominant_system: "convergence into a single point of white", primitives: ["dolly-zoom", "chrome-sweep", "screen-shake", "blur-resolve", "flash-cut"], density_topology: "converge → compress → flash" }
  - anchors: [6.247, 6.673, 7.134, 7.596, 8.057]
  - copy: []
  - direction: "The orbit ring accelerates and spirals inward. Camera pushes from 42% to 78% scale; hearts blur into chrome streaks. At 7.596 the heart compresses to a 6px white point and the frame holds black for one beat before the drop. No text."

## Frame 2 — f2

- src: compositions/frames/02-f2.html
- duration: 7.384s
- span_sec: [8.057, 15.441]
- pacing: beat_cut
- mood: [hype, playful, aggressive]
- feel: the drop, then a dense four-bar run of kick/snare hits with a big vocal-sized hole for the title

### Groups

- **g1** — free_design
  - span_sec: [8.057, 12.632]
  - free_design: { dominant_system: "chrome title detonation: the heart shatters into the word BABY", primitives: ["system-replace", "braam-punch", "particle-burst", "radial-burst-lines", "content-swap", "hard-cut", "screen-shake", "chromatic-split", "flash-cut"], density_topology: "explode → stamp → syncopate" }
  - anchors: [8.057, 8.475, 8.963, 9.442, 9.903, 10.365, 10.827, 11.288, 11.750, 12.211]
  - copy: ["BABY", "BABY", "BABY"]
  - direction: "On the drop: a white flash, the chrome heart explodes into 180 shards, and BABY stamps in at 560px, chrome fill with a 4px black offset shadow. On 8.963 a second BABY punches in from screen-right at 70% scale; on 10.365 a third rises from the bottom edge. Between stamps the fill swaps between chrome, bubblegum pink, and ice blue (0ms content-swap). Pink and ice-blue shards remain in the air. Every kick adds a 2–4px camera shake; every snare adds a 1-frame RGB split."
- **g2** — free_design
  - span_sec: [12.632, 15.441]
  - free_design: { dominant_system: "the three titles stack into a chrome wall, then a single OH opens the frame", primitives: ["content-swap", "hard-cut", "braam-punch", "radial-burst-lines", "screen-shake", "flash-cut", "chrome-sweep"], density_topology: "stack → lock → whiteout" }
  - anchors: [12.632, 13.134, 13.596, 14.058, 14.519, 14.981, 15.441]
  - copy: ["BABY", "BABY", "BABY", "OH"]
  - direction: "The three BABYs snap into a stacked left-aligned block (three lines, 220px each, tight leading). On 14.519 the block compresses to a single line and OH slams in at 700px in warm cream with a black outline. Radial speed-lines fire; on 15.441 the frame floods white for 2 frames."

## Frame 3 — f3

- src: compositions/frames/03-f3.html
- duration: 7.384s
- span_sec: [15.441, 22.825]
- pacing: beat_cut
- mood: [dreamy, hype, cinematic]
- feel: continuous forward motion, four bars of steady four-on-the-floor with hi-hat motion and two strong kick accents

### Groups

- **g1** — free_design
  - span_sec: [15.441, 19.108]
  - free_design: { dominant_system: "forward flight through a tunnel of chrome hearts and iridescent CDs", primitives: ["dolly-zoom", "staggered-reveal", "content-swap", "palette-flip", "hypercut-whip", "3d-card-flip"], density_topology: "enter → spawn rings → accelerate" }
  - anchors: [15.441, 15.903, 16.324, 16.826, 17.252, 17.749, 18.211, 18.672]
  - copy: ["BABY", "BABY"]
  - direction: "Full-bleed tunnel: 7 concentric rings of hearts at Z depths 200–2400px, each ring spawning on a beat. CDs and hearts alternate; CDs are conic-gradient iridescent discs rotating slowly. BABY appears on the tunnel wall in 3D perspective at 15.903 and 17.252, then whips away. Palette flips from black/pink to black/ice-blue on 16.826. Camera pushes forward continuously; no static frame."
- **g2** — free_design
  - span_sec: [19.108, 22.825]
  - free_design: { dominant_system: "the tunnel tightens into a chrome vortex and collapses", primitives: ["hypercut-whip", "dolly-zoom", "radial-burst-lines", "staggered-exit", "palette-flip", "hard-cut", "screen-shake"], density_topology: "accelerate → vortex → collapse" }
  - anchors: [19.134, 19.595, 20.016, 20.519, 20.921, 21.442, 21.873, 22.365, 22.825]
  - copy: ["BABY", "BABY", "BABY"]
  - direction: "The rings compress toward the center; camera speed doubles. On 20.921 a hard whip-cut to a side-on view of the vortex, then back. BABY flashes on the three kicks at 20.921, 21.873, 22.365. At 22.825 the vortex closes to a black circle with a thin chrome rim, setting up the grid."

## Frame 4 — f4

- src: compositions/frames/04-f4.html
- duration: 7.384s
- span_sec: [22.825, 30.209]
- pacing: beat_cut
- mood: [glitch, playful, tense]
- feel: dense syncopated run with a hard snare at 26.5; a wall of short hits that wants a grid, then a collapse

### Groups

- **g1** — free_design
  - span_sec: [22.825, 26.494]
  - free_design: { dominant_system: "a 4×4 wall of BABY tiles, one tile flipping per hit", primitives: ["word-grid-burst", "content-swap", "hard-cut", "palette-flip", "chromatic-split", "screen-shake"], density_topology: "grid build → per-hit flip → full wall" }
  - anchors: [22.825, 23.287, 23.748, 24.210, 24.672, 24.985, 25.133, 25.595, 26.056, 26.494]
  - copy: ["BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY", "BABY"]
  - direction: "4×4 grid, 440×240 tiles, 10px black gaps, 60px outer margin. Each tile starts as black with a 1px #333 outline. On each beat one tile flips to a different treatment, cycling chrome / pink / ice-blue / cream / scanline; the word BABY is set in Inter 900 at 120px, centered. By 26.056 every tile is lit. 0ms flips, no easing."
- **g2** — free_design
  - span_sec: [26.494, 30.209]
  - free_design: { dominant_system: "the tile wall inverts, shakes, and collapses into one chrome heart", primitives: ["hard-cut", "palette-flip", "screen-shake", "chromatic-split", "particle-burst", "staggered-exit", "crash-zoom-in"], density_topology: "invert → shatter → resolve" }
  - anchors: [26.494, 26.980, 27.441, 27.903, 28.365, 28.826, 29.257, 29.750, 30.209]
  - copy: ["BABY", "STILL", "BABY"]
  - direction: "At 26.494 the whole grid inverts to white tiles with black BABY text and the camera shakes hard. Tiles begin dropping out on 16th-note subdivisions from 27.441; the gaps reveal a chrome heart behind the wall. On 29.257 the last tiles blow away and STILL appears at 140px in the lower-left while the heart lands center. At 30.209 the heart is full-frame and the frame cuts to the bloom."

## Frame 5 — f5

- src: compositions/frames/05-f5.html
- duration: 7.245s
- span_sec: [30.209, 37.454]
- pacing: beat_cut
- mood: [hype, cinematic, dreamy]
- feel: the biggest four bars: dense kick/snare, rising energy, then the last held hit

### Groups

- **g1** — free_design
  - span_sec: [30.209, 34.273]
  - free_design: { dominant_system: "hero chrome wordmark blooming out of a heart-shaped sun", primitives: ["text-spectral-rays", "particle-burst", "chrome-sweep", "radial-burst-lines", "dolly-zoom", "flash-cut"], density_topology: "bloom → rays → title lock" }
  - anchors: [30.209, 31.092, 32.020, 32.979, 33.902, 34.273]
  - copy: ["BABY"]
  - direction: "A cream-to-pink radial sun blooms behind a giant chrome heart at 30.209; godrays fan out. BABY lands at 560px in chrome at 32.020. On every kick, chrome/white particles burst from the wordmark and the rays pulse. The camera slowly pulls back from 1.1× to 0.95× so the title and heart both breathe. No extra words."
- **g2** — free_design
  - span_sec: [34.273, 37.454]
  - free_design: { dominant_system: "pull-back to a ring of BABY copies, then everything converges into one word and whites out", primitives: ["dolly-zoom", "staggered-reveal", "content-swap", "chrome-sweep", "particle-burst", "flash-cut", "freeze-hold"], density_topology: "reveal ring → converge → whiteout" }
  - anchors: [34.273, 34.825, 35.286, 35.748, 36.210, 36.671, 37.133, 37.454]
  - copy: ["BABY", "BABY", "BABY", "OH"]
  - direction: "On the 34.273 kick the camera pulls back to reveal 12 BABY copies on a ring, each tilted toward center. They orbit one step per beat, then converge on 36.671. OH stamps at 36.671 in cream, 700px, centered. At 37.133 a final white flash freezes the word; at 37.454 cut to black."

## Frame 6 — f6

- src: compositions/frames/06-f6.html
- duration: 1.746s
- span_sec: [37.454, 39.2]
- pacing: phrase_flow
- mood: [elegant, cinematic]
- feel: short held tail, one snare accent, then silence for the end card

### Groups

- **g1** — free_design
  - span_sec: [37.454, 39.2]
  - free_design: { dominant_system: "negative-space end card with one chrome wordmark", primitives: ["negative-space-hold", "blur-resolve", "chrome-sweep"], density_topology: "hold → glint → fade" }
  - anchors: [37.454, 38.243, 39.2]
  - copy: ["BABY", "A FAN-MADE CHORUS STUDY", "MUSIC: JUSTIN BIEBER — “BABY” FT. LUDACRIS", "非官方粉丝视觉 · NO AFFILIATION"]
  - direction: "Black frame, no bed. BABY at 210px chrome, centered at 50/44. A 1px white rule runs 320px wide under it at 38.243 with a single chrome glint sweep. Below: A FAN-MADE CHORUS STUDY in Space Grotesk 18px, tracking .28em, white 80%. Music credit in 12px white 55%, and 非官方粉丝视觉 · NO AFFILIATION in 12px at the bottom. Everything fades to near-black by 39.1; the final frame holds a 2% glint on the wordmark."
