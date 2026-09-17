# Eco with Shatomin - Design & Architecture Guidelines

## Core Principles

### 1. 100% Touch-First UI (Zero Keyboard Required)
- **NO Text Inputs**: Strictly avoid text input fields (`<input type="text">`, `<textarea>`, etc.).
- **Pure Touch Interactions**: All user actions must be completed via taps:
  - Preset action catalogs with one-tap add/remove
  - Cards, pills, toggles, icon buttons
  - Easy-to-tap targets (minimum 44px on mobile/tablet)
- Designed for comfortable, barrier-free usage on iPads, tablets, and smartphones for all ages.

### 2. Minimal Clean Aesthetic
- **Color Palette**:
  - Background: Warm White / Ivory (`#FBF8F2`, `#FAF7F0`)
  - Accent / Primary: Forest Deep Green (`#275236`, `#387249`)
  - Neutrals: Soft Stone Grays & Earthy Muted Tones
- **Generous Spacing & Balanced Whitespace**: Avoid dense cards-inside-cards or dark, heavy cyber containers. Keep elements calm, spacious, and readable.
- **Single-Purpose Focus**: Each view should clearly present its main action without overwhelming visual clutter.

### 3. Open-Source Map Infrastructure (OpenStreetMap)
- Uses **OpenStreetMap + Leaflet** for real-world GPS patrols and planetary hotspots.
- **Zero API Keys & Zero Credentials**: No OAuth tokens, credit cards, or external proprietary API keys required.
- Minimalist map tiles (such as CartoDB Positron / OpenStreetMap light) matching the calm, nature-inspired palette.
