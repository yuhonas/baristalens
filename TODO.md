# BaristaLens — Roadmap & Planned Improvements

This document tracks upcoming features and architectural enhancements for the BaristaLens Latte Art Photo Comparator & Calibration Studio.

---

## 1. Live Camera Overlay (WebRTC / Device Feed)
- [ ] **Real-time Camera Stream**: Integrate `navigator.mediaDevices.getUserMedia` to stream video directly into Cup 2 (Practice Pour) slot.
- [ ] **Overhead Rig Mode**: Baristas mounting a phone or iPad over their drip tray can see the target goal pattern ghosted over the live pour in real time.
- [ ] **Snapshot Trigger**: Add a foot-pedal / voice / delay-timer capture trigger to snap the final pour photo hands-free without touching the screen with steamed-milk hands.

---

## 2. Computer Vision Cup Rim Detection & Auto-Alignment
- [ ] **Automated Circular Hough Transform / Edge Detection**: Process the canvas image data to automatically detect the cup's circular outer lip and inner rim.
- [ ] **One-Click Auto-Center**: Calculate geometric delta between Cup 1 rim center and Cup 2 rim center, automatically computing `offsetX`, `offsetY`, and `scale`.
- [ ] **Perspective De-Warping**: Correct minor elliptical distortion when photos are captured at slight oblique angles rather than top-down nadir view.

---

## 3. Barista Team Profiles & Milk Variety Tracking
- [ ] **Multi-Milk Benchmarking**: Tag sessions by milk type (`Whole Dairy`, `Oat`, `Almond`, `Soy`) to correlate foam density, stretch volume, and contrast retention with milk brand.
- [ ] **Pitcher Spout Geometry Profiles**: Log pitcher model (sharp spout vs. round spout vs. narrow v-spout) and volume (350ml / 450ml / 600ml).
- [ ] **Barista Roster**: Support multiple baristas per shop to track practice progression across training apprenticeships.

---

## 4. Export & Competition Formats
- [ ] **SCA Official Score Sheet PDF Export**: Generate official World Latte Art Championship (WLAC) style scoring summary sheets for judging panels.
- [ ] **Side-by-Side Video / GIF Export**: Export animated split wipe or blink comparison clips for social sharing and coaching reels.
