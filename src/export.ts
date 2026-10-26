/**
 * BaristaLens Export & Snapshot Utilities
 * Composites high-resolution comparison views, metrics, and scorecard into downloadable PNG reports.
 */

export interface ExportData {
  cup1Src: string;
  cup2Src: string;
  cup1Name: string;
  cup2Name: string;
  mode: string;
  splitPosition: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotate: number;
  scores: {
    symmetry: number;
    contrast: number;
    cut: number;
    texture: number;
    harmony: number;
    total: number;
    grade: string;
  };
  notes: string;
  milkTemp?: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { resolve(img); };
    img.onerror = reject;
    img.src = src;
  });
}

export async function exportComparisonReport(data: ExportData): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  ctx.fillStyle = '#0f1216';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load both images
  const [img1, img2] = await Promise.all([
    loadImage(data.cup1Src),
    loadImage(data.cup2Src),
  ]);

  // Header Bar
  ctx.fillStyle = '#171b21';
  ctx.fillRect(0, 0, canvas.width, 90);
  ctx.strokeStyle = '#262c36';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.lineTo(canvas.width, 90);
  ctx.stroke();

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('BaristaLens', 48, 56);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Latte Art Comparative Pour Analysis Report', 230, 55);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, canvas.width - 48, 55);
  ctx.textAlign = 'left';

  // Left Section: Main Comparison Canvas (900 x 900)
  const viewX = 48;
  const viewY = 130;
  const viewSize = 900;

  // Checkerboard backdrop
  ctx.fillStyle = '#14181e';
  ctx.fillRect(viewX, viewY, viewSize, viewSize);
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 2;
  ctx.strokeRect(viewX, viewY, viewSize, viewSize);

  // Render Cup 2 (with transformations)
  ctx.save();
  ctx.beginPath();
  ctx.rect(viewX, viewY, viewSize, viewSize);
  ctx.clip();

  // Apply Cup 2 transform
  ctx.save();
  const cup2CenterX = viewX + viewSize / 2 + (data.offsetX * (viewSize / 600));
  const cup2CenterY = viewY + viewSize / 2 + (data.offsetY * (viewSize / 600));
  ctx.translate(cup2CenterX, cup2CenterY);
  ctx.rotate((data.rotate * Math.PI) / 180);
  ctx.scale(data.scale, data.scale);
  ctx.drawImage(img2, -viewSize / 2, -viewSize / 2, viewSize, viewSize);
  ctx.restore();

  // Render Cup 1 based on mode
  if (data.mode === 'split') {
    const splitX = viewX + (viewSize * (data.splitPosition / 100));
    ctx.save();
    ctx.beginPath();
    ctx.rect(viewX, viewY, splitX - viewX, viewSize);
    ctx.clip();
    ctx.drawImage(img1, viewX, viewY, viewSize, viewSize);
    ctx.restore();

    // Divider line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(splitX, viewY);
    ctx.lineTo(splitX, viewY + viewSize);
    ctx.stroke();
  } else if (data.mode === 'crossfade') {
    ctx.save();
    ctx.globalAlpha = 1 - data.splitPosition / 100;
    ctx.drawImage(img1, viewX, viewY, viewSize, viewSize);
    ctx.restore();
  } else if (data.mode === 'diff') {
    ctx.save();
    ctx.globalCompositeOperation = 'difference';
    ctx.drawImage(img1, viewX, viewY, viewSize, viewSize);
    ctx.restore();
  } else {
    // Side by side in canvas
    ctx.restore(); // remove clip
    ctx.save();
    ctx.beginPath();
    ctx.rect(viewX, viewY, viewSize / 2 - 4, viewSize);
    ctx.clip();
    ctx.drawImage(img1, viewX, viewY, viewSize / 2, viewSize);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(viewX + viewSize / 2 + 4, viewY, viewSize / 2 - 4, viewSize);
    ctx.clip();
    ctx.drawImage(img2, viewX + viewSize / 2 + 4, viewY, viewSize / 2, viewSize);
    ctx.restore();
  }
  ctx.restore();

  // Subtle Cup Labels
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(viewX + 16, viewY + 16, 200, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Goal: ${data.cup1Name || 'Cup 1'}`, viewX + 28, viewY + 37);

  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(viewX + viewSize - 220, viewY + viewSize - 48, 204, 32);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`Practice: ${data.cup2Name || 'Cup 2'}`, viewX + viewSize - 208, viewY + viewSize - 27);

  // Right Section: Calibration & Scorecard Panel
  const panelX = 988;
  const panelY = 130;
  const panelWidth = 564;

  // Panel Background
  ctx.fillStyle = '#171b21';
  ctx.fillRect(panelX, panelY, panelWidth, viewSize);
  ctx.strokeStyle = '#262c36';
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelWidth, viewSize);

  // Scorecard Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Evaluation & Rubric', panelX + 32, panelY + 48);

  // Total Score Card Box
  ctx.fillStyle = '#1f242c';
  ctx.fillRect(panelX + 32, panelY + 70, panelWidth - 64, 100);
  ctx.strokeStyle = '#333b47';
  ctx.strokeRect(panelX + 32, panelY + 70, panelWidth - 64, 100);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SCA COMPETITION SCORE', panelX + 52, panelY + 102);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText(`${data.scores.total}`, panelX + 52, panelY + 150);

  ctx.fillStyle = '#6b7280';
  ctx.font = '20px "JetBrains Mono", monospace';
  ctx.fillText('/ 50', panelX + 115, panelY + 150);

  // Grade
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(data.scores.grade, panelX + panelWidth - 52, panelY + 130);
  ctx.textAlign = 'left';

  // Individual Criteria Rows
  const criteria = [
    { label: 'Symmetry & Bilateral Balance', score: data.scores.symmetry },
    { label: 'Contrast & Crema Definition', score: data.scores.contrast },
    { label: 'Stem Cut & Axis Alignment', score: data.scores.cut },
    { label: 'Microfoam Gloss & Texture', score: data.scores.texture },
    { label: 'Cup Placement & Harmony', score: data.scores.harmony },
  ];

  let currentY = panelY + 205;
  criteria.forEach((crit) => {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(crit.label, panelX + 32, currentY);

    // Score
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${crit.score} / 10`, panelX + panelWidth - 32, currentY);
    ctx.textAlign = 'left';

    // Progress bar
    ctx.fillStyle = '#262c36';
    ctx.fillRect(panelX + 32, currentY + 8, panelWidth - 64, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(panelX + 32, currentY + 8, (panelWidth - 64) * (crit.score / 10), 6);

    currentY += 46;
  });

  // Calibration Values Table
  currentY += 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Cup 2 Geometric Calibration', panelX + 32, currentY);

  currentY += 30;
  const calibRows = [
    { name: 'X / Y Offset', val: `${data.offsetX}px, ${data.offsetY}px` },
    { name: 'Magnification Scale', val: `${Math.round(data.scale * 100)}%` },
    { name: 'Rotational Offset', val: `${data.rotate.toFixed(1)}°` },
  ];

  calibRows.forEach((row) => {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(row.name, panelX + 32, currentY);

    ctx.fillStyle = '#f3f4f6';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(row.val, panelX + panelWidth - 32, currentY);
    ctx.textAlign = 'left';
    currentY += 26;
  });

  // Notes Box
  if (data.notes) {
    currentY += 20;
    ctx.fillStyle = '#1f242c';
    ctx.fillRect(panelX + 32, currentY, panelWidth - 64, 110);
    ctx.strokeStyle = '#333b47';
    ctx.strokeRect(panelX + 32, currentY, panelWidth - 64, 110);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BARISTA LOG NOTES:', panelX + 48, currentY + 28);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(data.notes.slice(0, 110), panelX + 48, currentY + 56);
  }

  // Trigger Download
  const link = document.createElement('a');
  link.download = `baristalens-analysis-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
