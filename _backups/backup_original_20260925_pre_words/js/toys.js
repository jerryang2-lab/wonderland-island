/**
 * 奇幻歡樂島 (Wonderland Island) - 魔法玩具箱模組
 * 內容：8 音敲擊鐵琴、調色魔法實驗室、玩具創客手作圖鑑
 */

class ToysManager {
  constructor() {
    this.notesMap = {
      "C4": { freq: 261.63, name: "Do", key: "1" },
      "D4": { freq: 293.66, name: "Re", key: "2" },
      "E4": { freq: 329.63, name: "Mi", key: "3" },
      "F4": { freq: 349.23, name: "Fa", key: "4" },
      "G4": { freq: 392.00, name: "Sol", key: "5" },
      "A4": { freq: 440.00, name: "La", key: "6" },
      "B4": { freq: 493.88, name: "Si", key: "7" },
      "C5": { freq: 523.25, name: "Do↑", key: "8" }
    };

    this.notesPlayedCount = 0;
    this.cauldronColors = []; // ['red', 'blue', ...]
    this.isDemoPlaying = false;
  }

  init() {
    this.bindXylophone();
    this.bindAlchemy();
    this.bindDIYCards();
  }

  // --------------------------------------------------------------------------
  // 1. 敲擊鐵琴
  // --------------------------------------------------------------------------
  bindXylophone() {
    const keys = document.querySelectorAll(".xylo-key");
    keys.forEach(key => {
      key.addEventListener("click", () => {
        const note = key.dataset.note;
        this.playKey(note, key);
      });
    });

    // 鍵盤數字鍵支援 (1~8)
    window.addEventListener("keydown", (e) => {
      const activeTab = document.querySelector(".nav-tab-btn.active");
      if (!activeTab || activeTab.dataset.tab !== "toys") return;

      for (const [note, item] of Object.entries(this.notesMap)) {
        if (e.key === item.key) {
          const keyEl = document.querySelector(`.xylo-key[data-note="${note}"]`);
          if (keyEl) this.playKey(note, keyEl);
        }
      }
    });

    // 自動演奏《小星星》示範按鈕
    const demoBtn = document.getElementById("xyloDemoBtn");
    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        this.playLittleStarSong();
      });
    }
  }

  playKey(note, element) {
    const data = this.notesMap[note];
    if (!data) return;

    window.soundEngine.playNote(data.freq);

    if (element) {
      element.classList.add("playing");
      setTimeout(() => {
        element.classList.remove("playing");
      }, 150);
    }

    this.notesPlayedCount++;
    if (this.notesPlayedCount >= 8 && window.appManager) {
      window.appManager.unlockBadge("musician");
    }
  }

  playLittleStarSong() {
    if (this.isDemoPlaying) return;
    this.isDemoPlaying = true;

    // 小星星簡譜：1 1 5 5 6 6 5 - 4 4 3 3 2 2 1
    const melody = [
      "C4", "C4", "G4", "G4", "A4", "A4", "G4",
      "F4", "F4", "E4", "E4", "D4", "D4", "C4"
    ];

    melody.forEach((note, idx) => {
      setTimeout(() => {
        const keyEl = document.querySelector(`.xylo-key[data-note="${note}"]`);
        this.playKey(note, keyEl);

        if (idx === melody.length - 1) {
          this.isDemoPlaying = false;
          if (window.appManager) {
            window.appManager.addStars(2);
            window.appManager.unlockBadge("musician");
          }
        }
      }, idx * 450);
    });
  }

  // --------------------------------------------------------------------------
  // 2. 神奇調色盤實驗室
  // --------------------------------------------------------------------------
  bindAlchemy() {
    const flasks = document.querySelectorAll(".color-flask");
    flasks.forEach(flask => {
      flask.addEventListener("click", () => {
        const color = flask.dataset.color;
        this.addColorToCauldron(color);
      });
    });

    const resetBtn = document.getElementById("alchemyResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetCauldron();
      });
    }
  }

  addColorToCauldron(color) {
    window.soundEngine.playSplash();

    if (!this.cauldronColors.includes(color)) {
      this.cauldronColors.push(color);
    }

    this.updateCauldron();
  }

  updateCauldron() {
    const liquid = document.getElementById("cauldronLiquid");
    const resultTitle = document.getElementById("alchemyResultTitle");
    const resultDesc = document.getElementById("alchemyResultDesc");

    if (!liquid || !resultTitle || !resultDesc) return;

    liquid.style.transform = "scale(1.15)";
    setTimeout(() => { liquid.style.transform = "scale(1)"; }, 250);

    const colors = [...this.cauldronColors].sort();

    if (colors.length === 1) {
      const c = colors[0];
      if (c === "red") {
        liquid.style.background = "#EF4444";
        liquid.textContent = "🍎";
        resultTitle.textContent = "熱情紅色精靈！";
        resultDesc.textContent = "你加入了紅色藥水，咕嚕嚕冒起了蘋果香氣的泡泡～";
      } else if (c === "yellow") {
        liquid.style.background = "#FBBF24";
        liquid.textContent = "⭐";
        resultTitle.textContent = "陽光黃色精靈！";
        resultDesc.textContent = "金色陽光照進了大鍋，宛如閃亮的小星星！";
      } else if (c === "blue") {
        liquid.style.background = "#3B82F6";
        liquid.textContent = "💧";
        resultTitle.textContent = "海洋藍色精靈！";
        resultDesc.textContent = "大海的潮汐微風在鍋中打轉，清涼舒爽！";
      }
    } else if (colors.length === 2) {
      if (colors.includes("red") && colors.includes("yellow")) {
        // 橙色
        liquid.style.background = "#F97316";
        liquid.textContent = "🦊";
        resultTitle.textContent = "🎉 召喚：陽光小火狐！";
        resultDesc.textContent = "紅 + 黃 = 橙色！小火狐在鍋邊開心地翻跟斗～";
        window.soundEngine.playMagic();
        if (window.appManager) window.appManager.unlockBadge("colorMaster");
      } else if (colors.includes("blue") && colors.includes("yellow")) {
        // 綠色
        liquid.style.background = "#10B981";
        liquid.textContent = "🧚";
        resultTitle.textContent = "🎉 召喚：森林翡翠精靈！";
        resultDesc.textContent = "藍 + 黃 = 綠色！帶來了大自然的清新氣息與綠意嫩芽～";
        window.soundEngine.playMagic();
        if (window.appManager) window.appManager.unlockBadge("colorMaster");
      } else if (colors.includes("red") && colors.includes("blue")) {
        // 紫色
        liquid.style.background = "#A855F7";
        liquid.textContent = "🐉";
        resultTitle.textContent = "🎉 召喚：星空紫晶小龍！";
        resultDesc.textContent = "紅 + 藍 = 紫色！天空中閃過神秘夢幻的流星雨！";
        window.soundEngine.playMagic();
        if (window.appManager) window.appManager.unlockBadge("colorMaster");
      }
    } else if (colors.length >= 3) {
      // 三色合成
      liquid.style.background = "#4B5563";
      liquid.textContent = "🐻";
      resultTitle.textContent = "🌟 傳奇：大地守護熊！";
      resultDesc.textContent = "紅 + 黃 + 藍 三原色融合為奇幻大地色！解鎖了自然守護力量！";
      window.soundEngine.playSuccess();
      if (window.appManager) {
        window.appManager.spawnConfetti();
        window.appManager.addStars(3);
        window.appManager.unlockBadge("colorMaster");
      }
    }
  }

  resetCauldron() {
    window.soundEngine.playPop();
    this.cauldronColors = [];
    const liquid = document.getElementById("cauldronLiquid");
    const resultTitle = document.getElementById("alchemyResultTitle");
    const resultDesc = document.getElementById("alchemyResultDesc");

    if (liquid) {
      liquid.style.background = "#9CA3AF";
      liquid.textContent = "✨";
    }
    if (resultTitle) resultTitle.textContent = "魔法大鍋已清空";
    if (resultDesc) resultDesc.textContent = "請點擊上方燒瓶加入顏色，看看會合成出什麼神奇精靈！";
  }

  // --------------------------------------------------------------------------
  // 3. DIY 玩具創客指南
  // --------------------------------------------------------------------------
  bindDIYCards() {
    const diyCards = document.querySelectorAll(".diy-guide-card");
    diyCards.forEach(card => {
      card.addEventListener("click", () => {
        window.soundEngine.playPop();
        const content = card.querySelector(".diy-steps");
        if (content) {
          const isOpen = content.style.display === "block";
          content.style.display = isOpen ? "none" : "block";
          card.classList.toggle("open", !isOpen);
        }
      });
    });
  }
}

window.toysManager = new ToysManager();
