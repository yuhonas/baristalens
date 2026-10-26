/**
 * Procedural Latte Art Canvas Generators
 * Provides crisp, high-resolution procedural bitmaps for reference goals and practice pours.
 */

export interface PatternPreset {
  id: string;
  name: string;
  category: 'Goal' | 'Practice';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
  generate: () => string;
}

function drawTulipPetal(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h);
  ctx.bezierCurveTo(cx + w, cy - h * 0.4, cx + w * 0.8, cy + h * 0.4, cx, cy + h);
  ctx.bezierCurveTo(cx - w * 0.8, cy + h * 0.4, cx - w, cy - h * 0.4, cx, cy - h);
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(cx, cy + size * 0.6);
  ctx.bezierCurveTo(cx - size, cy, cx - size, cy - topCurveHeight, cx, cy - topCurveHeight * 0.1);
  ctx.bezierCurveTo(cx + size, cy - topCurveHeight, cx + size, cy, cx, cy + size * 0.6);
  ctx.fill();
}

// 1. Championship 5-Tier Tulip (Reference Goal)
export function createChampionshipTulip(): string {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Studio light background
  const bgGrad = ctx.createRadialGradient(500, 500, 100, 500, 500, 600);
  bgGrad.addColorStop(0, '#1c1f24');
  bgGrad.addColorStop(0.7, '#14171a');
  bgGrad.addColorStop(1, '#0c0e11');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1000, 1000);

  // Soft cup drop shadow
  ctx.beginPath();
  ctx.arc(510, 510, 435, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.filter = 'blur(20px)';
  ctx.fill();
  ctx.filter = 'none';

  // Ceramic mug handle (bottom-right)
  ctx.save();
  ctx.translate(500, 500);
  ctx.rotate(0.85);
  ctx.beginPath();
  ctx.roundRect(330, 140, 140, 65, [16, 32, 32, 16]);
  ctx.fillStyle = '#222830';
  ctx.fill();
  ctx.restore();

  // Dark Matte Ceramic Rim
  ctx.beginPath();
  ctx.arc(500, 500, 430, 0, Math.PI * 2);
  const rimGrad = ctx.createLinearGradient(150, 150, 850, 850);
  rimGrad.addColorStop(0, '#3a4049');
  rimGrad.addColorStop(0.5, '#22272e');
  rimGrad.addColorStop(1, '#15181c');
  ctx.fillStyle = rimGrad;
  ctx.fill();

  // Inner Lip
  ctx.beginPath();
  ctx.arc(500, 500, 405, 0, Math.PI * 2);
  ctx.fillStyle = '#4a505b';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(500, 500, 395, 0, Math.PI * 2);
  ctx.fillStyle = '#1c1815';
  ctx.fill();

  // Espresso Crema Surface
  ctx.beginPath();
  ctx.arc(500, 500, 390, 0, Math.PI * 2);
  const cremaGrad = ctx.createRadialGradient(500, 490, 30, 500, 500, 390);
  cremaGrad.addColorStop(0, '#dc822d');
  cremaGrad.addColorStop(0.35, '#c56f21');
  cremaGrad.addColorStop(0.7, '#9e4e11');
  cremaGrad.addColorStop(0.92, '#723407');
  cremaGrad.addColorStop(1, '#441d03');
  ctx.fillStyle = cremaGrad;
  ctx.fill();

  // Microfoam flecks in crema
  ctx.fillStyle = 'rgba(255, 230, 190, 0.07)';
  for (let i = 0; i < 350; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.random() * 370;
    ctx.beginPath();
    ctx.arc(500 + Math.cos(angle) * rad, 500 + Math.sin(angle) * rad, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pure silky white microfoam
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  // Base Horseshoe Wing Wrap
  ctx.beginPath();
  ctx.lineWidth = 36;
  ctx.lineCap = 'round';
  ctx.arc(500, 500, 260, 0.72 * Math.PI, 0.28 * Math.PI, true);
  ctx.stroke();

  // 5 Symmetrical Tulip Tiers
  drawTulipPetal(ctx, 500, 680, 215, 130);
  drawTulipPetal(ctx, 500, 600, 178, 110);
  drawTulipPetal(ctx, 500, 520, 142, 95);
  drawTulipPetal(ctx, 500, 450, 108, 80);
  drawHeart(ctx, 500, 290, 80);

  // Razor-sharp center stem cut
  ctx.beginPath();
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#ffffff';
  ctx.moveTo(500, 240);
  ctx.lineTo(500, 750);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

// 2. Practice Pour Attempt (With slight asymmetry and tilt for calibration)
export function createPracticeTulipAttempt(): string {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Warm café tabletop background
  ctx.fillStyle = '#2a2420';
  ctx.fillRect(0, 0, 1000, 1000);

  // Bamboo Coaster
  ctx.beginPath();
  ctx.arc(505, 510, 475, 0, Math.PI * 2);
  const woodGrad = ctx.createRadialGradient(505, 510, 40, 505, 510, 475);
  woodGrad.addColorStop(0, '#b8834d');
  woodGrad.addColorStop(0.75, '#8c5a27');
  woodGrad.addColorStop(1, '#653c15');
  ctx.fillStyle = woodGrad;
  ctx.fill();

  // White ceramic mug
  ctx.beginPath();
  ctx.arc(500, 495, 435, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.filter = 'blur(14px)';
  ctx.fill();
  ctx.filter = 'none';

  // White mug rim
  ctx.beginPath();
  ctx.arc(500, 495, 430, 0, Math.PI * 2);
  const mugGrad = ctx.createLinearGradient(180, 180, 820, 820);
  mugGrad.addColorStop(0, '#fbf8f3');
  mugGrad.addColorStop(0.6, '#eae4d9');
  mugGrad.addColorStop(1, '#cec4b5');
  ctx.fillStyle = mugGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(500, 495, 395, 0, Math.PI * 2);
  ctx.fillStyle = '#4c2e17';
  ctx.fill();

  // Crema
  ctx.beginPath();
  ctx.arc(500, 495, 388, 0, Math.PI * 2);
  const cremaGrad = ctx.createRadialGradient(496, 492, 30, 500, 495, 388);
  cremaGrad.addColorStop(0, '#c7782b');
  cremaGrad.addColorStop(0.5, '#ad611f');
  cremaGrad.addColorStop(0.85, '#82400f');
  cremaGrad.addColorStop(1, '#532506');
  ctx.fillStyle = cremaGrad;
  ctx.fill();

  // Practice pour (organic, slightly softer wings, 3px right offset, slight 2° tilt)
  ctx.save();
  ctx.translate(506, 502);
  ctx.rotate(0.035); // ~2 degree tilt typical in hand pours

  ctx.fillStyle = '#faf7f0';
  ctx.strokeStyle = '#faf7f0';

  // Wing wrap
  ctx.beginPath();
  ctx.lineWidth = 32;
  ctx.lineCap = 'round';
  ctx.arc(0, 0, 252, 0.74 * Math.PI, 0.26 * Math.PI, true);
  ctx.stroke();

  drawTulipPetal(ctx, -2, 175, 222, 134);
  drawTulipPetal(ctx, 3, 98, 182, 115);
  drawTulipPetal(ctx, 0, 18, 146, 100);
  drawTulipPetal(ctx, -1, -54, 112, 85);
  drawHeart(ctx, 2, -215, 84);

  // Hand-poured center cut
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#faf7f0';
  ctx.moveTo(3, -260);
  ctx.quadraticCurveTo(0, 0, -2, 250);
  ctx.stroke();

  ctx.restore();

  return c.toDataURL('image/jpeg', 0.95);
}

// 3. Classic 12-Leaf Rosetta (Reference Goal)
export function createClassicRosetta(): string {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  ctx.fillStyle = '#121417';
  ctx.fillRect(0, 0, 1000, 1000);

  // Cup Rim
  ctx.beginPath();
  ctx.arc(500, 500, 430, 0, Math.PI * 2);
  ctx.fillStyle = '#26292e';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(500, 500, 400, 0, Math.PI * 2);
  ctx.fillStyle = '#3f2514';
  ctx.fill();

  // Crema
  ctx.beginPath();
  ctx.arc(500, 500, 392, 0, Math.PI * 2);
  const cremaGrad = ctx.createRadialGradient(500, 490, 40, 500, 500, 392);
  cremaGrad.addColorStop(0, '#d47b25');
  cremaGrad.addColorStop(0.5, '#b45a12');
  cremaGrad.addColorStop(0.85, '#7d3809');
  cremaGrad.addColorStop(1, '#421a02');
  ctx.fillStyle = cremaGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  // Base crescent
  ctx.beginPath();
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.arc(500, 680, 140, 0.8 * Math.PI, 0.2 * Math.PI, true);
  ctx.stroke();

  // Rosetta Leaves (12 graduated lateral ribs)
  const leafCount = 11;
  const startY = 660;
  const endY = 320;
  for (let i = 0; i <= leafCount; i++) {
    const t = i / leafCount;
    const y = startY - t * (startY - endY);
    const span = 190 * (1 - t * 0.45);
    const thickness = 22 * (1 - t * 0.35);

    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.moveTo(500 - span, y + Math.sin(t * Math.PI) * 15);
    ctx.quadraticCurveTo(500, y - 8, 500 + span, y + Math.sin(t * Math.PI) * 15);
    ctx.stroke();
  }

  // Top crowning heart
  drawHeart(ctx, 500, 260, 65);

  // Center cut
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ffffff';
  ctx.moveTo(500, 210);
  ctx.lineTo(500, 750);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

// 4. Barista Winged Swan (Master Pattern)
export function createSwanPattern(): string {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#101216';
  ctx.fillRect(0, 0, 1000, 1000);

  // Cup Rim
  ctx.beginPath();
  ctx.arc(500, 500, 430, 0, Math.PI * 2);
  ctx.fillStyle = '#2c2724';
  ctx.fill();

  // Crema
  ctx.beginPath();
  ctx.arc(500, 500, 390, 0, Math.PI * 2);
  const cremaGrad = ctx.createRadialGradient(500, 500, 50, 500, 500, 390);
  cremaGrad.addColorStop(0, '#ce7523');
  cremaGrad.addColorStop(0.6, '#9b470d');
  cremaGrad.addColorStop(1, '#4a1d03');
  ctx.fillStyle = cremaGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  // Swan Base Body (Rosetta Wing on left/center)
  ctx.save();
  ctx.translate(460, 540);
  ctx.rotate(-0.35);

  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    const y = 140 - t * 240;
    const span = 160 * (1 - t * 0.4);
    ctx.beginPath();
    ctx.lineWidth = 20 * (1 - t * 0.3);
    ctx.lineCap = 'round';
    ctx.moveTo(-span, y);
    ctx.quadraticCurveTo(0, y - 10, span * 0.5, y);
    ctx.stroke();
  }
  ctx.restore();

  // Swan Arched Neck & Head (Graceful S-Curve to the right)
  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.moveTo(480, 620);
  ctx.bezierCurveTo(620, 540, 620, 340, 530, 320);
  ctx.stroke();

  // Swan Head & Beak
  drawHeart(ctx, 510, 320, 42);

  // Beak point
  ctx.beginPath();
  ctx.moveTo(485, 320);
  ctx.lineTo(440, 335);
  ctx.lineTo(485, 345);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Wing feather flourishes
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.arc(560, 380, 50, 0.2 * Math.PI, 0.8 * Math.PI, false);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

// 5. Winged Heart (Single Push Base)
export function createWingedHeart(): string {
  const c = document.createElement('canvas');
  c.width = 1000;
  c.height = 1000;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, 1000, 1000);

  // Cup Rim
  ctx.beginPath();
  ctx.arc(500, 500, 430, 0, Math.PI * 2);
  ctx.fillStyle = '#25292e';
  ctx.fill();

  // Crema
  ctx.beginPath();
  ctx.arc(500, 500, 390, 0, Math.PI * 2);
  const cremaGrad = ctx.createRadialGradient(500, 490, 40, 500, 500, 390);
  cremaGrad.addColorStop(0, '#dc8126');
  cremaGrad.addColorStop(0.55, '#af5914');
  cremaGrad.addColorStop(1, '#4e2004');
  ctx.fillStyle = cremaGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  // Broad rippled base wings (3 nested ripples)
  for (let r = 280; r >= 190; r -= 40) {
    ctx.beginPath();
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.arc(500, 520, r, 0.75 * Math.PI, 0.25 * Math.PI, true);
    ctx.stroke();
  }

  // Large crowned solid heart
  drawHeart(ctx, 500, 380, 140);

  // Stem cut
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  ctx.moveTo(500, 300);
  ctx.lineTo(500, 770);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

// Preset Catalog
export const PRESETS: PatternPreset[] = [
  {
    id: 'championship-tulip',
    name: '5-Tier Championship Tulip',
    category: 'Goal',
    description: 'Crisp tiered symmetry with wide horseshoe wings and centered cut-through.',
    difficulty: 'Master',
    generate: createChampionshipTulip,
  },
  {
    id: 'practice-tulip',
    name: 'Practice Pour (Tulip Attempt)',
    category: 'Practice',
    description: 'Realistic morning practice pour with mild tilt (~2°) and organic foam texture.',
    difficulty: 'Intermediate',
    generate: createPracticeTulipAttempt,
  },
  {
    id: 'classic-rosetta',
    name: '12-Rib Classic Rosetta',
    category: 'Goal',
    description: 'Delicate graduated flutes with wide bottom base wrap and balanced heart cap.',
    difficulty: 'Master',
    generate: createClassicRosetta,
  },
  {
    id: 'barista-swan',
    name: 'Winged Barista Swan',
    category: 'Goal',
    description: 'Dramatic asymmetrical pour featuring feathered wing and curved neck.',
    difficulty: 'Master',
    generate: createSwanPattern,
  },
  {
    id: 'winged-heart',
    name: 'Framed Winged Heart',
    category: 'Goal',
    description: 'Bold single-push base ripple cradling an elevated high-contrast heart.',
    difficulty: 'Beginner',
    generate: createWingedHeart,
  },
];
