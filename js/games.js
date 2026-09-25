/**
 * 奇幻歡樂島 (Wonderland Island) - 趣味遊樂場模組
 * 內容：萌萌動物記憶翻牌、快樂氣球消消樂、彩虹魔法塗鴉畫板
 */

class GamesManager {
  constructor() {
    this.activeSubgame = "memory";

    // 1. 記憶翻牌狀態
    this.memoryAnimals = ["🐼", "🦁", "🐰", "🦊", "🐨", "🦄"];
    this.memoryCards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.flipsCount = 0;
    this.memoryTimer = null;
    this.memorySeconds = 0;
    this.isChecking = false;

    // 2. 氣球消消樂狀態
    this.balloonScore = 0;
    this.balloonInterval = null;
    this.isBalloonRunning = false;

    // 3. 塗鴉畫板狀態
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = "#FF70A6";
    this.isRainbowBrush = false;
    this.rainbowHue = 0;
    this.brushSize = 8;
    this.currentTool = "brush"; // "brush", "eraser", "stamp"
    this.activeStamp = "⭐";
  }

  init() {
    this.bindSubnav();
    this.initMemoryGame();
    this.initBalloonGame();
    this.initCanvas();
  }

  // 子遊戲選單切換
  bindSubnav() {
    const subnavBtns = document.querySelectorAll(".game-subnav-btn");
    subnavBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.soundEngine.playPop();
        subnavBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.dataset.subgame;
        this.activeSubgame = target;

        document.getElementById("subgameMemory").style.display = (target === "memory") ? "block" : "none";
        document.getElementById("subgameBalloon").style.display = (target === "balloon") ? "block" : "none";
        document.getElementById("subgameCanvas").style.display = (target === "canvas") ? "block" : "none";

        if (target === "balloon" && !this.isBalloonRunning) {
          this.startBalloonGame();
        } else if (target !== "balloon") {
          this.stopBalloonGame();
        }

        if (target === "canvas") {
          setTimeout(() => this.resizeCanvas(), 30);
        }
      });
    });
  }

  // ==========================================================================
  // 1. 萌萌動物記憶翻牌
  // ==========================================================================
  initMemoryGame() {
    const resetBtn = document.getElementById("memoryResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.resetMemoryGame();
      });
    }
    this.resetMemoryGame();
  }

  resetMemoryGame() {
    clearInterval(this.memoryTimer);
    this.memorySeconds = 0;
    this.flipsCount = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isChecking = false;

    const timerEl = document.getElementById("memoryTimerText");
    const flipsEl = document.getElementById("memoryFlipsText");
    if (timerEl) timerEl.textContent = "0 秒";
    if (flipsEl) flipsEl.textContent = "0 次";

    // 產生並洗牌 (6對 = 12張卡)
    const deck = [...this.memoryAnimals, ...this.memoryAnimals];
    this.memoryCards = deck.sort(() => Math.random() - 0.5);

    const grid = document.getElementById("memoryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    this.memoryCards.forEach((animal, index) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = index;
      card.dataset.animal = animal;

      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">❓</div>
          <div class="memory-card-back">${animal}</div>
        </div>
      `;

      card.addEventListener("click", () => this.flipMemoryCard(card));
      grid.appendChild(card);
    });

    // 啟動計時
    this.memoryTimer = setInterval(() => {
      this.memorySeconds++;
      if (timerEl) timerEl.textContent = `${this.memorySeconds} 秒`;
    }, 1000);
  }

  flipMemoryCard(card) {
    if (this.isChecking) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    window.soundEngine.playBoing();
    card.classList.add("flipped");
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.flipsCount++;
      const flipsEl = document.getElementById("memoryFlipsText");
      if (flipsEl) flipsEl.textContent = `${this.flipsCount} 次`;

      this.checkMemoryMatch();
    }
  }

  checkMemoryMatch() {
    this.isChecking = true;
    const [card1, card2] = this.flippedCards;
    const animal1 = card1.dataset.animal;
    const animal2 = card2.dataset.animal;

    if (animal1 === animal2) {
      // 配對成功
      setTimeout(() => {
        window.soundEngine.playSuccess();
        card1.classList.add("matched");
        card2.classList.add("matched");
        this.matchedPairs++;
        this.flippedCards = [];
        this.isChecking = false;

        if (this.matchedPairs === this.memoryAnimals.length) {
          clearInterval(this.memoryTimer);
          if (window.appManager) {
            window.appManager.spawnConfetti();
            window.appManager.addStars(4);
            window.appManager.unlockBadge("memoryMaster");
          }
          setTimeout(() => {
            alert(`🎉 恭喜通關！\n用時：${this.memorySeconds} 秒，翻牌：${this.flipsCount} 次！獲得「記憶力超人」徽章！`);
          }, 300);
        }
      }, 400);
    } else {
      // 配對失敗，翻回
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        this.flippedCards = [];
        this.isChecking = false;
      }, 800);
    }
  }

  // ==========================================================================
  // 2. 快樂氣球消消樂
  // ==========================================================================
  initBalloonGame() {
    const startBtn = document.getElementById("balloonToggleBtn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        if (this.isBalloonRunning) {
          this.stopBalloonGame();
          startBtn.textContent = "開始戳氣球 🎈";
        } else {
          this.startBalloonGame();
          startBtn.textContent = "暫停遊戲 ⏸️";
        }
      });
    }
  }

  startBalloonGame() {
    this.isBalloonRunning = true;
    const stage = document.getElementById("balloonStage");
    if (!stage) return;

    this.balloonInterval = setInterval(() => {
      this.spawnBalloon(stage);
    }, 1100);
  }

  stopBalloonGame() {
    this.isBalloonRunning = false;
    clearInterval(this.balloonInterval);
  }

  spawnBalloon(stage) {
    if (!this.isBalloonRunning) return;

    const balloon = document.createElement("div");
    balloon.className = "balloon-item";

    const colors = ["#FF5964", "#FF8811", "#FFD166", "#06D6A0", "#118AB2", "#9B5DE5", "#F15BB5"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;

    // 隨機左側位置 (10% ~ 85%)
    const leftPos = Math.floor(Math.random() * 75) + 10;
    balloon.style.left = `${leftPos}%`;

    // 氣球圖案/文字
    const contents = ["1", "2", "3", "A", "B", "C", "⭐", "❤️", "🎈"];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];
    balloon.textContent = randomContent;

    // 點擊消除
    balloon.addEventListener("click", (e) => {
      e.stopPropagation();
      window.soundEngine.playPop();

      balloon.style.transform = "scale(1.4)";
      balloon.style.opacity = "0";
      setTimeout(() => balloon.remove(), 180);

      this.balloonScore += 10;
      const scoreEl = document.getElementById("balloonScoreText");
      if (scoreEl) scoreEl.textContent = this.balloonScore;

      if (this.balloonScore >= 100 && window.appManager) {
        window.appManager.unlockBadge("balloonPopper");
      }
    });

    // 浮出畫面後自動移除
    balloon.addEventListener("animationend", () => {
      balloon.remove();
    });

    stage.appendChild(balloon);
  }

  // ==========================================================================
  // 3. 彩虹魔法小畫板
  // ==========================================================================
  initCanvas() {
    this.canvas = document.getElementById("drawingCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    // 響應式設置畫布尺寸
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // 綁定繪畫事件 (支援滑鼠與觸控)
    this.canvas.addEventListener("mousedown", (e) => this.startDraw(e));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    window.addEventListener("mouseup", () => this.stopDraw());

    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDraw(touch);
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.draw(touch);
    }, { passive: false });

    window.addEventListener("touchend", () => this.stopDraw());

    // 色票選擇
    const swatches = document.querySelectorAll(".color-swatch");
    swatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
        window.soundEngine.playPop();
        swatches.forEach(s => s.classList.remove("active"));
        swatch.classList.add("active");

        this.currentTool = "brush";
        if (swatch.dataset.color === "rainbow") {
          this.isRainbowBrush = true;
        } else {
          this.isRainbowBrush = false;
          this.currentColor = swatch.dataset.color;
        }
      });
    });

    // 筆刷大小滑桿
    const brushSizeSlider = document.getElementById("brushSizeRange");
    if (brushSizeSlider) {
      brushSizeSlider.addEventListener("input", (e) => {
        this.brushSize = parseInt(e.target.value, 10);
      });
    }

    // 橡皮擦按鈕
    const eraserBtn = document.getElementById("canvasEraserBtn");
    if (eraserBtn) {
      eraserBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.currentTool = "eraser";
        swatches.forEach(s => s.classList.remove("active"));
      });
    }

    // 清空畫布按鈕
    const clearBtn = document.getElementById("canvasClearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.clearCanvas();
      });
    }

    // 印章貼紙按鈕
    const stampBtns = document.querySelectorAll(".stamp-btn");
    stampBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.soundEngine.playBoing();
        this.currentTool = "stamp";
        this.activeStamp = btn.dataset.stamp;
        stampBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // 下載作品按鈕
    const downloadBtn = document.getElementById("canvasDownloadBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        this.downloadArtwork();
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.closest(".game-arena") || this.canvas.parentElement;
    const parentWidth = (parent && parent.clientWidth > 0) ? parent.clientWidth : 720;
    const targetWidth = Math.max(320, Math.min(parentWidth - 48, 680));
    const targetHeight = 400;

    if (this.canvas.width === targetWidth && this.canvas.height === targetHeight) {
      return;
    }

    // 保留既有內容避免縮放被重置
    const tempCanvas = document.createElement("canvas");
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    if (oldW > 0 && oldH > 0) {
      tempCanvas.width = oldW;
      tempCanvas.height = oldH;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(this.canvas, 0, 0);
    }

    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;

    // 白色背景初始化
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
      this.ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  getCanvasPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDraw(e) {
    this.isDrawing = true;
    const pos = this.getCanvasPos(e);

    if (this.currentTool === "stamp") {
      this.stampEmoji(pos.x, pos.y);
      this.isDrawing = false;
      return;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getCanvasPos(e);

    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = this.brushSize;

    if (this.currentTool === "eraser") {
      this.ctx.strokeStyle = "#FFFFFF";
    } else if (this.isRainbowBrush) {
      this.rainbowHue = (this.rainbowHue + 3) % 360;
      this.ctx.strokeStyle = `hsl(${this.rainbowHue}, 90%, 60%)`;
    } else {
      this.ctx.strokeStyle = this.currentColor;
    }

    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDraw() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.ctx.closePath();
      if (window.appManager) {
        window.appManager.unlockBadge("artist");
      }
    }
  }

  stampEmoji(x, y) {
    window.soundEngine.playBoing();
    this.ctx.font = `${this.brushSize * 4 + 24}px sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.activeStamp, x, y);

    if (window.appManager) {
      window.appManager.unlockBadge("artist");
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  downloadArtwork() {
    window.soundEngine.playSuccess();
    const link = document.createElement("a");
    link.download = "my-wonderland-art.png";
    link.href = this.canvas.toDataURL("image/png");
    link.click();

    if (window.appManager) {
      window.appManager.addStars(2);
      window.appManager.spawnConfetti();
    }
    alert("🎨 畫作已下載！太有創意了！獲得 2 顆星星！");
  }
}

window.gamesManager = new GamesManager();
