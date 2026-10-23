/**
 * 奇幻歡樂島 (Wonderland Island) - 主應用協調器
 * 負責：角色模式切換、導航分頁、星星計數、成就徽章系統、彩帶微粒與護眼計時
 */

class AppManager {
  constructor() {
    this.currentRole = "kids"; // "kids", "parents", "teachers"
    this.activeTab = "lobby";
    this.stars = window.securityGuard ? window.securityGuard.secureGetItem("wl_stars", 10) : parseInt(localStorage.getItem("wl_stars") || "10", 10);
    this.badges = JSON.parse(localStorage.getItem("wl_badges") || "{}");

    // 護眼計時器（家長模式用）
    this.eyeTimerMinutes = 0;
    this.eyeTimerInterval = null;

    // 預設徽章字典
    this.badgeCatalog = {
      storyReader: { name: "故事小偵探", icon: "📖", desc: "完整閱讀並探索繪本島" },
      musician: { name: "小小音樂家", icon: "🎵", desc: "在彩色鐵琴上彈奏歡樂旋律" },
      colorMaster: { name: "色彩魔法師", icon: "🧪", desc: "在調色實驗室合成奇幻生物" },
      memoryMaster: { name: "記憶力超人", icon: "🦁", desc: "成功匹配所有萌萌動物卡片" },
      balloonPopper: { name: "戳戳神射手", icon: "🎈", desc: "氣球消消樂獲得 100 分以上" },
      artist: { name: "創意小畫家", icon: "🎨", desc: "在彩虹小畫板揮灑創意作品" },
      scholar: { name: "智慧小博士", icon: "💡", desc: "完成探索小百科的益智問答" },
      wordLearner: { name: "單字小探險家", icon: "🔤", desc: "探索翻閱 20 個常用單字卡片" },
      spellingChampion: { name: "拼字神射手", icon: "🎯", desc: "成功拼出 10 個正確字母單字" },
      quizMaster: { name: "單字智多星", icon: "🏆", desc: "在單字測驗挑戰中獲得 100 分滿分" }
    };
  }

  init() {
    this.bindRoleSwitcher();
    this.bindNavigationTabs();
    this.bindActionButtons();
    this.bindModals();
    this.updateStarsDisplay();
    this.initEyeTimer();

    // 初始化各子模組
    if (window.storyManager) window.storyManager.init();
    if (window.toysManager) window.toysManager.init();
    if (window.gamesManager) window.gamesManager.init();
    if (window.knowledgeManager) window.knowledgeManager.init();
    if (window.wordsManager) window.wordsManager.init();

    // 設置初始角色視角
    this.switchRole("kids");
  }

  // --------------------------------------------------------------------------
  // 1. 角色視角切換 (Kids / Parents / Teachers)
  // --------------------------------------------------------------------------
  bindRoleSwitcher() {
    const roleBtns = document.querySelectorAll(".role-btn");
    roleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.role;
        window.soundEngine.playPop();
        this.switchRole(role);
      });
    });
  }

  switchRole(role) {
    this.currentRole = role;
    document.body.dataset.role = role;

    // 更新角色按鈕狀態
    document.querySelectorAll(".role-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.role === role);
    });

    // 動態更新頂部橫幅文案與提示
    const banner = document.getElementById("roleBanner");
    const bannerIcon = document.getElementById("roleBannerIcon");
    const bannerTitle = document.getElementById("roleBannerTitle");
    const bannerDesc = document.getElementById("roleBannerDesc");
    const bannerAction = document.getElementById("roleBannerAction");

    if (role === "kids") {
      if (bannerIcon) bannerIcon.textContent = "🌟";
      if (bannerTitle) bannerTitle.textContent = "嗨！我是星寶！今天想要聽故事、玩鐵琴還是塗鴉呢？";
      if (bannerDesc) bannerDesc.textContent = "點點卡片開啟冒險，收集滿滿的金色星星與榮譽徽章！";
      if (bannerAction) {
        bannerAction.textContent = "🎁 開啟每日驚喜";
        bannerAction.onclick = () => this.openDailyGift();
      }
    } else if (role === "parents") {
      if (bannerIcon) bannerIcon.textContent = "👨‍👩‍👧";
      if (bannerTitle) bannerTitle.textContent = "親愛的家長您好！護眼計時器已啟動，建議每次陪伴 20 分鐘。";
      if (bannerDesc) bannerDesc.textContent = "各板塊底部均為您準備了「親子共讀對話錦囊」與生活觀察延伸活動引導。";
      if (bannerAction) {
        bannerAction.textContent = "⏱️ 護眼健康手冊";
        bannerAction.onclick = () => this.openEyeCareModal();
      }
    } else if (role === "teachers") {
      if (bannerIcon) bannerIcon.textContent = "👩‍🏫";
      if (bannerTitle) bannerTitle.textContent = "敬愛的老師！本站內容全面契合 STEAM 與幼兒核心素養指標。";
      if (bannerDesc) bannerDesc.textContent = "故事、音樂與調色均提供課堂分組討論題綱，適合投屏帶領全班探索。";
      if (bannerAction) {
        bannerAction.textContent = "📋 STEAM 素養指南";
        bannerAction.onclick = () => this.openCurriculumModal();
      }
    }

    // 提示給故事島切換共讀資訊面板
    if (window.storyManager && storyData) {
      window.storyManager.updateRolePanel(storyData[window.storyManager.currentPageIndex]);
    }
  }

  // --------------------------------------------------------------------------
  // 2. 主導航分頁 (Lobby / Story / Toys / Games / Knowledge)
  // --------------------------------------------------------------------------
  bindNavigationTabs() {
    const tabBtns = document.querySelectorAll(".nav-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.soundEngine.playPop();
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // 大廳主題探索卡片快捷跳轉
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach(card => {
      card.addEventListener("click", () => {
        window.soundEngine.playBoing();
        const theme = card.dataset.theme;
        this.switchTab(theme);
      });
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // 更新分頁按鈕外觀
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    // 顯示目標面板
    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }

    // 當切換到畫板時重新適配畫布尺寸
    if (tabId === "games" && window.gamesManager) {
      setTimeout(() => window.gamesManager.resizeCanvas(), 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --------------------------------------------------------------------------
  // 3. 星星計數與徽章系統
  // --------------------------------------------------------------------------
  addStars(amount) {
    this.stars += amount;
    if (window.securityGuard) { window.securityGuard.secureSetItem("wl_stars", this.stars); } else { localStorage.setItem("wl_stars", this.stars); }
    this.updateStarsDisplay();
  }

  updateStarsDisplay() {
    const starsEl = document.getElementById("headerStarCount");
    if (starsEl) {
      starsEl.textContent = this.stars;
    }
  }

  unlockBadge(badgeKey) {
    if (!this.badges[badgeKey]) {
      this.badges[badgeKey] = true;
      localStorage.setItem("wl_badges", JSON.stringify(this.badges));

      const info = this.badgeCatalog[badgeKey];
      if (info) {
        window.soundEngine.playSuccess();
        this.spawnConfetti();
        this.addStars(3);

        setTimeout(() => {
          alert(`🏆 榮譽成就解鎖！\n獲得【${info.icon} ${info.name}】！\n獲得額外 3 顆金色星星！`);
        }, 200);
      }
    }
  }

  openBadgesModal() {
    window.soundEngine.playPop();
    const modal = document.getElementById("badgesModal");
    const container = document.getElementById("badgesListContainer");
    if (!modal || !container) return;

    container.innerHTML = "";
    for (const [key, item] of Object.entries(this.badgeCatalog)) {
      const isUnlocked = !!this.badges[key];
      const el = document.createElement("div");
      el.className = `badge-item ${isUnlocked ? "unlocked" : ""}`;
      el.innerHTML = `
        <div class="badge-icon">${item.icon}</div>
        <div class="badge-name">${item.name}</div>
        <div class="badge-status">${isUnlocked ? "✨ 已解鎖" : "🔒 待探索"}</div>
        <div style="font-size: 0.72rem; color: #64748B; margin-top: 4px;">${item.desc}</div>
      `;
      container.appendChild(el);
    }

    modal.classList.add("active");
  }

  // --------------------------------------------------------------------------
  // 4. 小工具與模態框 (音效切換、彩帶、禮物開箱、護眼提醒)
  // --------------------------------------------------------------------------
  bindActionButtons() {
    // 音效開關
    const soundBtn = document.getElementById("headerSoundToggle");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const isMuted = window.soundEngine.toggleMute();
        soundBtn.classList.toggle("muted", isMuted);
        soundBtn.innerHTML = isMuted ? "🔇" : "🔊";
      });
    }

    // 徽章按鈕
    const badgeBtn = document.getElementById("headerBadgesBtn");
    if (badgeBtn) {
      badgeBtn.addEventListener("click", () => {
        this.openBadgesModal();
      });
    }

    // 大廳吉祥物點擊互動
    const mascot = document.getElementById("heroMascot");
    if (mascot) {
      mascot.addEventListener("click", () => {
        window.soundEngine.playBoing();
        mascot.style.transform = "scale(1.2) rotate(15deg)";
        this.spawnConfetti();
        setTimeout(() => mascot.style.transform = "", 300);
      });
    }

    // 每日驚喜禮物盒
    const dailyGift = document.getElementById("dailyGiftBox");
    if (dailyGift) {
      dailyGift.addEventListener("click", () => {
        this.openDailyGift();
      });
    }
    // Legal modal button binding
    const openLegalBtn = document.getElementById("openLegalModalBtn");
    if (openLegalBtn) {
      openLegalBtn.addEventListener("click", () => this.openLegalModal());
    }
    const confirmLegalBtn = document.getElementById("confirmLegalBtn");
    if (confirmLegalBtn) {
      confirmLegalBtn.addEventListener("click", () => {
        const modal = document.getElementById("legalModal");
        if (modal) modal.classList.remove("active");
        if (window.soundEngine) window.soundEngine.playPop();
      });
    }
  }

  openDailyGift() {
    window.soundEngine.playSuccess();
    this.spawnConfetti();
    this.addStars(5);
    alert("🎁 哇！開箱獲得每日能量：5 顆金色小星星！✨ 快拿去解鎖新遊戲吧！");
  }

  spawnConfetti() {
    const colors = ["#FF70A6", "#FFD166", "#06D6A0", "#118AB2", "#9B5DE5", "#FF9F1C"];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      p.className = "confetti-particle";
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 20 + 5}vh`;

      const tx = (Math.random() - 0.5) * 300;
      const ty = Math.random() * 400 + 200;
      p.style.setProperty("--tx", `${tx}px`);
      p.style.setProperty("--ty", `${ty}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2800);
    }
  }

  bindModals() {
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        window.soundEngine.playPop();
        const modal = e.target.closest(".modal-overlay");
        if (modal) modal.classList.remove("active");
      });
    });

    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });
  }

  openEyeCareModal() {
    const modal = document.getElementById("eyeCareModal");
    if (modal) modal.classList.add("active");
  }

  openLegalModal() {
    if (window.soundEngine) window.soundEngine.playPop();
    const modal = document.getElementById("legalModal");
    if (modal) modal.classList.add("active");
  }

  openCurriculumModal() {
    const modal = document.getElementById("curriculumModal");
    if (modal) modal.classList.add("active");
  }

  initEyeTimer() {
    // 每分鐘累計，滿 20 分鐘在非兒童狀態溫馨提示
    this.eyeTimerInterval = setInterval(() => {
      this.eyeTimerMinutes++;
      if (this.eyeTimerMinutes % 20 === 0 && this.currentRole === "parents") {
        this.openEyeCareModal();
      }
    }, 60000);
  }
}

// 頁面載入完成後啟動
document.addEventListener("DOMContentLoaded", () => {
  window.appManager = new AppManager();
  window.appManager.init();
});
