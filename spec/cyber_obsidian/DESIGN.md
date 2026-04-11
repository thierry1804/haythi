# Design System Strategy: The Cyber-Editorial Protocol

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Archive."** 

We are moving away from the "gamer" tropes of sci-fi and moving toward a high-end, IT-centric professional aesthetic. This system balances the cold precision of a terminal interface with the sophisticated layout of a luxury editorial magazine. We achieve this through intentional asymmetry, massive typographic scale shifts, and a "HUD" (Heads-Up Display) layout philosophy where information feels projected rather than printed.

The goal is to break the "web-template" feel. Instead of centered, boxy layouts, we utilize the "Data-Edge" approach: pushing secondary metadata to the extreme corners of the viewport, leaving the center for high-contrast, impactful content.

## 2. Colors: The Void and the Pulse
This palette is rooted in a deep, "Vantablack" inspired foundation, accented by high-frequency pulses of energy.

*   **Foundation:** The core is `surface` (#131313). This isn't just black; it’s a deep, obsidian base that allows neon elements to vibrate.
*   **The Pulse:** `tertiary` (#00daf3) and `primary` (#ffb4a7) act as the system’s energy source. Use `tertiary` for functional data-visualization and `primary` for high-priority alerts or "destructive" professional actions.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. We define space through "Tonal Shifts." To separate a header from a body, transition from `surface` to `surface_container_low`. If a sidebar is required, define it by shifting the background to `surface_container_lowest`. 

### Surface Hierarchy & Nesting
Think of the UI as a series of physical layers. 
*   **Base:** `surface` (The Background).
*   **Layer 1:** `surface_container` (Content Blocks).
*   **Layer 2:** `surface_container_high` (Interactive Elements/Hover States).
*   **Layer 3:** `surface_bright` (Floating Modals).

### The "Glass & Gradient" Rule
To achieve the Sci-Fi "HUD" look, floating elements must use **Glassmorphism**. Apply `surface_container_low` at 60% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Texture:** Use a subtle linear gradient on main CTAs (e.g., `primary_container` to `primary`) with a 45-degree angle. This creates a "backlit" effect common in high-tech instrumentation.

## 3. Typography: Monospaced Precision
The system uses a high-contrast pairing of **Space Grotesk** and **Inter**.

*   **The Technical Anchor:** `Space Grotesk` is our voice of authority. Use it for all `display`, `headline`, and `label` styles. Its idiosyncratic terminals feel engineered, not written.
*   **The Functional Layer:** `Inter` handles the heavy lifting for `body` and `title` scales. It ensures that complex technical documentation remains legible.
*   **Visual Hierarchy:** Use `display-lg` for hero statements but pair it immediately with `label-sm` in all-caps. This "Gigantic vs. Minute" scale creates a sophisticated, technical rhythm that feels like a professional dashboard.

## 4. Elevation & Depth
In a sci-fi environment, depth is light. We do not use traditional drop shadows that mimic sunlight; we use "Ambient Glows."

*   **The Layering Principle:** Stack `surface_container` tiers to create depth. A `surface_container_highest` card sitting on a `surface` background provides enough "lift" through color alone.
*   **Ambient Shadows:** For floating modals, use a diffuse glow. Shadow: `0px 20px 40px rgba(0, 0, 0, 0.4)`. The shadow color must be a tinted version of `surface_container_lowest`.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at 15% opacity. It should be barely perceptible—a "whisper" of a boundary.
*   **Subtle Grid Patterns:** Apply a 24px or 32px repeating dot or micro-grid pattern to the `surface` background at 5% opacity. This reinforces the "IT/System" aesthetic without cluttering the UI.

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` with `on_primary_container` text. 0.25rem (sm) corner radius. No border.
*   **Secondary (The HUD Button):** Background `transparent`, "Ghost Border" using `outline`, text in `tertiary`.
*   **Tertiary:** All-caps `label-md` text with a `tertiary` underline that only spans 50% of the text width.

### Input Fields
*   **Styling:** Forgo the four-sided box. Use a bottom-border only (the "Terminal" style) using `outline_variant`.
*   **States:** On focus, the bottom border transitions to `tertiary`, and a subtle 2% `tertiary` glow fills the input background.

### Cards
*   **Rule:** No dividers. Use `surface_container_low` for the card body and `surface_container_high` for the header/footer of the card. 
*   **Radius:** Stick to `sm` (0.125rem) or `none` for a more brutalist, IT-centric feel.

### Chips (Data Tags)
*   **Styling:** `surface_container_highest` background, `monospace` font, all-caps. These should look like lines of code or system tags.

### Specialized Component: The "Status Pulse"
A small (8px) circle using the `tertiary` color with a CSS animation "ripple" effect. Use this next to system status labels to provide a "live" high-tech feel.

## 6. Do’s and Don’ts

### Do:
*   **DO** use extreme typographic contrast (e.g., a 12pt label next to a 64pt headline).
*   **DO** use "Data-Density." High-tech interfaces often have small, precisely placed metadata (timestamps, version numbers) in corners.
*   **DO** embrace asymmetry. Align a headline to the left and its subtext to the extreme right.

### Don’t:
*   **DON'T** use soft, rounded corners (large `xl` or `full` radius). It breaks the "sober/professional" IT aesthetic. Keep it sharp (`sm` or `none`).
*   **DON'T** use 100% opaque, high-contrast borders. They feel "web 1.0" and amateur.
*   **DON'T** use standard blue (#0000FF). Use the specified `tertiary` (#00daf3) for a neon, futuristic glow.
*   **DON'T** crowd the interface. The "Sober" aesthetic requires significant "Dark Space" (negative space) to feel premium.