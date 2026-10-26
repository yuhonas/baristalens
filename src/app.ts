import Alpine, { type AlpineComponent } from 'alpinejs';
import { createIcons, icons } from 'lucide';
import {
  PRESETS,
  PatternPreset,
  createChampionshipTulip,
  createPracticeTulipAttempt,
} from './patterns';
import { exportComparisonReport } from './export';

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  cup1Name: string;
  cup2Name: string;
  cup1Thumb: string;
  cup2Thumb: string;
  scores: {
    symmetry: number;
    contrast: number;
    cut: number;
    texture: number;
    harmony: number;
    total: number;
    grade: string;
  };
  calibration: {
    offsetX: number;
    offsetY: number;
    scale: number;
    rotate: number;
  };
  notes: string;
}

// Gives `this` Alpine's magics ($watch, $nextTick) inside the component object
function defineComponent<T>(component: AlpineComponent<T>): AlpineComponent<T> {
  return component;
}

export function baristaApp() {
  return defineComponent({
    // Navigation / view
    activeSection: 'workspace', // 'workspace' | 'presets' | 'scorecard' | 'history'

    // Display modes
    mode: 'split', // 'split' | 'crossfade' | 'side' | 'diff'
    orientation: 'vertical', // 'vertical' | 'horizontal'
    splitPosition: 50,
    isDraggingSplit: false,

    // Rapid Blink / Alternator Comparison
    isBlinking: false,
    blinkInterval: null as ReturnType<typeof setInterval> | null,
    blinkToggle: false,

    // Image Sources
    cup1Src: '',
    cup1Name: 'Championship 5-Tier Tulip',
    cup2Src: '',
    cup2Name: 'Morning Practice Attempt',
    activeSlot: 2,
    isDraggingFile: false,

    // Calibration settings for Cup 2 (Practice Pour)
    offsetX: 0,
    offsetY: 0,
    scale: 1.0,
    rotate: 0,
    flipH: false,
    flipV: false,
    cup2Opacity: 100,

    // Cup preset profiles
    cupProfile: 'acme180', // 'acme180' | 'loveramics250' | 'notneutral150' | 'custom'

    // Symmetry & Alignment Guides
    showGuides: false,
    guideRings: true,
    guideCrosshair: true,
    guideDiagonals: false,
    guideThirds: false,

    // SCA Rubric Scores (each 0 - 10)
    scoreSymmetry: 8,
    scoreContrast: 9,
    scoreCut: 7,
    scoreTexture: 8,
    scoreHarmony: 8,
    baristaNotes: 'Stem cut slightly drifted to the right at final push. Good foam aeration and high visual crema contrast.',
    milkTemp: '62°C',
    pitcherType: 'WPM 450ml Round Spout',

    // Presets catalog
    presets: PRESETS,

    // History (persisted in localStorage)
    history: [] as HistoryItem[],

    // Notification toast
    toastMessage: '',
    showToast: false,
    toastTimer: null as ReturnType<typeof setTimeout> | null,

    init() {
      // Load default high-res procedural images
      this.cup1Src = createChampionshipTulip();
      this.cup2Src = createPracticeTulipAttempt();

      // Load saved history if available
      try {
        const saved = localStorage.getItem('baristalens_history');
        if (saved) {
          this.history = JSON.parse(saved) as HistoryItem[];
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }

      // Initialize icons
      void this.$nextTick(() => {
        this.renderIcons();
      });

      // Watch split position or inputs for re-rendering
      this.$watch('mode', () => {
        if (this.isBlinking && this.mode !== 'crossfade') {
          this.stopBlink();
        }
        void this.$nextTick(() => { this.renderIcons(); });
      });

      this.$watch('activeSection', () => {
        void this.$nextTick(() => { this.renderIcons(); });
      });
    },

    renderIcons() {
      createIcons({ icons });
    },

    notify(msg: string) {
      this.toastMessage = msg;
      this.showToast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.showToast = false;
      }, 3200);
    },

    // Modes
    setMode(newMode: string) {
      this.mode = newMode;
      this.notify(`Switched to ${newMode.toUpperCase()} mode`);
    },

    toggleOrientation() {
      this.orientation = this.orientation === 'vertical' ? 'horizontal' : 'vertical';
      this.notify(`Divider: ${this.orientation.toUpperCase()}`);
    },

    toggleGuides() {
      this.showGuides = !this.showGuides;
      this.notify(this.showGuides ? 'Symmetry guides enabled' : 'Symmetry guides disabled');
    },

    toggleBlink() {
      if (this.isBlinking) {
        this.stopBlink();
      } else {
        this.startBlink();
      }
    },

    startBlink() {
      this.mode = 'crossfade';
      this.isBlinking = true;
      this.blinkInterval = setInterval(() => {
        this.blinkToggle = !this.blinkToggle;
        this.splitPosition = this.blinkToggle ? 0 : 100;
      }, 550);
      this.notify('Blink Comparator active');
    },

    stopBlink() {
      this.isBlinking = false;
      if (this.blinkInterval) {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
      }
      this.splitPosition = 50;
      this.notify('Blink Comparator stopped');
    },

    // Quick Split Jumps
    jumpSplit(val: number) {
      this.splitPosition = val;
    },

    // Calibration
    resetCalibration() {
      this.offsetX = 0;
      this.offsetY = 0;
      this.scale = 1.0;
      this.rotate = 0;
      this.flipH = false;
      this.flipV = false;
      this.cup2Opacity = 100;
      this.notify('Calibration reset to center');
    },

    nudge(dx: number, dy: number, dRot: number, dScale: number) {
      this.offsetX = Math.max(-150, Math.min(150, this.offsetX + dx));
      this.offsetY = Math.max(-150, Math.min(150, this.offsetY + dy));
      this.rotate = Math.max(-45, Math.min(45, parseFloat((this.rotate + dRot).toFixed(1))));
      this.scale = Math.max(0.5, Math.min(2.0, parseFloat((this.scale + dScale).toFixed(2))));
    },

    toggleFlipH() {
      this.flipH = !this.flipH;
      this.notify(this.flipH ? 'Horizontal mirror enabled' : 'Horizontal mirror disabled');
    },

    applyCupProfile(profile: string) {
      this.cupProfile = profile;
      if (profile === 'acme180') {
        this.scale = 1.0;
        this.notify('Acme 180ml Flat White Profile');
      } else if (profile === 'loveramics250') {
        this.scale = 1.12;
        this.notify('Loveramics 250ml Egg Profile');
      } else if (profile === 'notneutral150') {
        this.scale = 0.92;
        this.notify('NotNeutral 150ml Cortado Profile');
      }
    },

    // Transformations styling string for Cup 2
    getCup2Transform(): string {
      const scaleX = this.flipH ? -this.scale : this.scale;
      const scaleY = this.flipV ? -this.scale : this.scale;
      return `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${this.rotate}deg) scale(${scaleX}, ${scaleY})`;
    },

    // Split Clip-Path String
    getClipPath(): string {
      if (this.mode !== 'split') return 'none';
      const pos = this.splitPosition;
      if (this.orientation === 'vertical') {
        return `polygon(0% 0%, ${pos}% 0%, ${pos}% 100%, 0% 100%)`;
      } else {
        return `polygon(0% 0%, 100% 0%, 100% ${pos}%, 0% ${pos}%)`;
      }
    },

    // Dragging split on mouse / touch
    startDragSplit(e: MouseEvent | TouchEvent) {
      if (this.mode !== 'split') return;
      this.isDraggingSplit = true;
      this.updateSplitFromEvent(e);
    },

    onDragSplit(e: MouseEvent | TouchEvent) {
      if (!this.isDraggingSplit || this.mode !== 'split') return;
      this.updateSplitFromEvent(e);
    },

    stopDragSplit() {
      this.isDraggingSplit = false;
    },

    updateSplitFromEvent(e: MouseEvent | TouchEvent) {
      const stage = document.getElementById('viewportStage');
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const point = 'touches' in e ? e.touches.item(0) : e;
      if (!point) return;

      const pct =
        this.orientation === 'vertical'
          ? ((point.clientX - rect.left) / rect.width) * 100
          : ((point.clientY - rect.top) / rect.height) * 100;

      this.splitPosition = Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
    },

    // Swap Base vs Practice Cups
    swapCups() {
      const tempSrc = this.cup1Src;
      const tempName = this.cup1Name;
      this.cup1Src = this.cup2Src;
      this.cup1Name = this.cup2Name;
      this.cup2Src = tempSrc;
      this.cup2Name = tempName;
      this.resetCalibration();
      this.notify('Images swapped');
    },

    // Apply Catalog Preset
    loadPreset(preset: PatternPreset, targetSlot: 1 | 2) {
      const dataUrl = preset.generate();
      if (targetSlot === 1) {
        this.cup1Src = dataUrl;
        this.cup1Name = preset.name;
        this.notify(`Loaded ${preset.name} as Goal (Cup 1)`);
      } else {
        this.cup2Src = dataUrl;
        this.cup2Name = preset.name;
        this.notify(`Loaded ${preset.name} as Practice (Cup 2)`);
      }
      this.activeSection = 'workspace';
    },

    // File Upload and Drag-Drop
    handleFileInput(event: Event, targetSlot: 1 | 2) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.item(0);
      if (file) {
        this.processFile(file, targetSlot);
      }
    },

    processFile(file: File, targetSlot: 1 | 2) {
      if (!file.type.startsWith('image/')) {
        this.notify('Please upload a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (targetSlot === 1) {
          this.cup1Src = result;
          this.cup1Name = file.name.replace(/\.[^/.]+$/, '');
          this.notify(`Cup 1 loaded: ${this.cup1Name}`);
        } else {
          this.cup2Src = result;
          this.cup2Name = file.name.replace(/\.[^/.]+$/, '');
          this.notify(`Cup 2 loaded: ${this.cup2Name}`);
        }
      };
      reader.readAsDataURL(file);
    },

    onViewportDrop(e: DragEvent) {
      e.preventDefault();
      this.isDraggingFile = false;
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      if (files.length >= 2) {
        this.processFile(files[0], 1);
        this.processFile(files[1], 2);
        this.notify('Loaded 2 images into Cup 1 & Cup 2');
      } else {
        this.processFile(files[0], this.activeSlot as 1 | 2);
      }
    },

    // Scorecard Computations
    get totalScore(): number {
      return (
        this.scoreSymmetry +
        this.scoreContrast +
        this.scoreCut +
        this.scoreTexture +
        this.scoreHarmony
      );
    },

    get scoreGrade(): string {
      const score = this.totalScore;
      if (score >= 46) return 'Championship Gold';
      if (score >= 40) return 'Specialty Master';
      if (score >= 32) return 'Skilled Barista';
      if (score >= 24) return 'Developing Artisan';
      return 'Practice Foundation';
    },

    get scoreGradeColor(): string {
      const score = this.totalScore;
      if (score >= 46) return 'text-amber-400';
      if (score >= 40) return 'text-emerald-400';
      if (score >= 32) return 'text-sky-400';
      return 'text-stone-300';
    },

    // Save to History Log
    saveToHistory() {
      const item: HistoryItem = {
        id: `pour_${Date.now()}`,
        timestamp: Date.now(),
        dateStr: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        cup1Name: this.cup1Name,
        cup2Name: this.cup2Name,
        cup1Thumb: this.cup1Src,
        cup2Thumb: this.cup2Src,
        scores: {
          symmetry: this.scoreSymmetry,
          contrast: this.scoreContrast,
          cut: this.scoreCut,
          texture: this.scoreTexture,
          harmony: this.scoreHarmony,
          total: this.totalScore,
          grade: this.scoreGrade,
        },
        calibration: {
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          scale: this.scale,
          rotate: this.rotate,
        },
        notes: this.baristaNotes,
      };

      this.history.unshift(item);
      // Keep up to 20 logs
      if (this.history.length > 20) {
        this.history.pop();
      }

      try {
        localStorage.setItem('baristalens_history', JSON.stringify(this.history));
      } catch (e) {
        console.warn('Storage limit reached, keeping in-memory history', e);
      }

      this.notify('Saved pour to History log');
    },

    deleteHistoryItem(id: string) {
      this.history = this.history.filter((h) => h.id !== id);
      try {
        localStorage.setItem('baristalens_history', JSON.stringify(this.history));
      } catch (e) {
        console.error(e);
      }
      this.notify('Pour removed from history');
    },

    loadHistoryItem(item: HistoryItem) {
      this.cup1Src = item.cup1Thumb;
      this.cup2Src = item.cup2Thumb;
      this.cup1Name = item.cup1Name;
      this.cup2Name = item.cup2Name;
      this.offsetX = item.calibration.offsetX;
      this.offsetY = item.calibration.offsetY;
      this.scale = item.calibration.scale;
      this.rotate = item.calibration.rotate;
      this.scoreSymmetry = item.scores.symmetry;
      this.scoreContrast = item.scores.contrast;
      this.scoreCut = item.scores.cut;
      this.scoreTexture = item.scores.texture;
      this.scoreHarmony = item.scores.harmony;
      this.baristaNotes = item.notes;
      this.activeSection = 'workspace';
      this.notify(`Restored pour from ${item.dateStr}`);
    },

    // Export Analysis Card Snapshot
    async exportAnalysis() {
      try {
        this.notify('Generating high-resolution snapshot...');
        await exportComparisonReport({
          cup1Src: this.cup1Src,
          cup2Src: this.cup2Src,
          cup1Name: this.cup1Name,
          cup2Name: this.cup2Name,
          mode: this.mode,
          splitPosition: this.splitPosition,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          scale: this.scale,
          rotate: this.rotate,
          scores: {
            symmetry: this.scoreSymmetry,
            contrast: this.scoreContrast,
            cut: this.scoreCut,
            texture: this.scoreTexture,
            harmony: this.scoreHarmony,
            total: this.totalScore,
            grade: this.scoreGrade,
          },
          notes: this.baristaNotes,
          milkTemp: this.milkTemp,
        });
        this.notify('Comparison report downloaded!');
      } catch (err) {
        console.error('Export failed', err);
        this.notify('Failed to generate export image');
      }
    },
  });
}

Alpine.data('baristaApp', baristaApp);

// Exposed for Alpine devtools / console debugging
window.Alpine = Alpine;
Alpine.start();
