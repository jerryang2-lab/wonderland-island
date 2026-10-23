/**
 * ???????(Wonderland Island) - ????瞉???(Obfuscated Production Bundle)
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * ?蟡????謅????????遴鬥????蝞賂???輻??????????鞈??桀???皜??２??湛??蹓澗????蹓????????? */

/**
 * ============================================================================
 * 憟劂甇⊥?撜?(Wonderland Island) - 銝餅??典?隤踹
 * ----------------------------------------------------------------------------
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * 
 * 鞎痊嚗??脫芋撘????芸??????詻?撠勗噬蝡頂蝯晞?敺??蝒蔗撣嗅凝蝎?霅瑞閮?
 * ?祉?撘Ⅳ?葉?舀???雿?瘜??箸鞎∠甈?霅瘀??芰???蝳迫?ˊ???寞?????? * ============================================================================
 */

class AppManager {
  constructor() {
    this.currentRole = "kids"; // "kids", "parents", "teachers"
    this.activeTab = "lobby";

    if (window.securityGuard) {
      this.stars = window.securityGuard.secureGetItem("wl_stars", 10);
      this.badges = window.securityGuard.secureGetItem("wl_badges", {});
    } else {
      this.stars = parseInt(localStorage.getItem("wl_stars") || "10", 10);
      this.badges = JSON.parse(localStorage.getItem("wl_badges") || "{}");
    }

    this.eyeTimerMinutes = 0;
    this.eyeTimerInterval = null;

    this.badgeCatalog = {
      storyReader: { name: "??撠??, icon: "??", desc: "摰?梯?銝行蝝Ｙ鼓?砍雀" },
      musician: { name: "撠??單?摰?, icon: "?", desc: "?典蔗?脤?港?敶?甇⊥???" },
      colorMaster: { name: "?脣蔗擳?撣?, icon: "?妒", desc: "?刻矽?脣祕撽恕??憟劂?" },
      memoryMaster: { name: "閮??鈭?, icon: "??", desc: "???寥???????拙?? },
      balloonPopper: { name: "?單蟡???, icon: "??", desc: "瘞??瘨?璅敺?100 ?誑銝? },
      artist: { name: "?菜?撠摰?, icon: "?", desc: "?典蔗?孵??急?桃??菜?雿?" },
      scholar: { name: "?箸撠?憯?, icon: "?", desc: "摰??Ｙ揣撠蝘????" },
      wordLearner: { name: "?桀?撠?芸振", icon: "?", desc: "?Ｙ揣蝧駁 20 ?虜?典摮?? },
      spellingChampion: { name: "?澆?蟡???, icon: "?", desc: "???澆 10 ?迤蝣箏?瘥摮? },
      quizMaster: { name: "?桀??箏???, icon: "??", desc: "?典摮葫撽??唬葉?脣? 100 ?遛?? }
    };
  }

  init() {
    this.bindRoleSwitcher();
    this.bindNavigationTabs();
    this.bindActionButtons();
    this.bindModals();
    this.updateStarsDisplay();
    this.initEyeTimer();


    if (window.toysManager) window.toysManager.init();
    if (window.gamesManager) window.gamesManager.init();
    if (window.knowledgeManager) window.knowledgeManager.init();
    if (window.wordsManager) window.wordsManager.init();

    this.switchRole("kids");
  }

  /**
   * 閮擃楛摨虫?霅瘀????詨?鞈??拐辣
   */
  freezeCoreData() {
    if (window.securityGuard) {
      if (window.WORDS_DATABASE) window.securityGuard.deepFreeze(window.WORDS_DATABASE);
      if (window.storyData) window.securityGuard.deepFreeze(window.storyData);
      if (window.knowledgeData) window.securityGuard.deepFreeze(window.knowledgeData);
    }
  }

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

      btn.classList.toggle("active", btn.dataset.role === role);
    });

    const bannerIcon = document.getElementById("roleBannerIcon");
    const bannerTitle = document.getElementById("roleBannerTitle");
    const bannerDesc = document.getElementById("roleBannerDesc");
    const bannerAction = document.getElementById("roleBannerAction");

    if (role === "kids") {
      if (bannerIcon) bannerIcon.textContent = "??";
      if (bannerTitle) bannerTitle.textContent = "?剁???窄嚗?憭拇閬????萇?憛??ｇ?";
      if (bannerDesc) bannerDesc.textContent = "暺??∠????嚗?遛皛輻?????旨霅賢噬蝡?";
      if (bannerAction) {
        bannerAction.textContent = "?? ??瘥撽?";
        bannerAction.onclick = () => this.openDailyGift();
      }
    } else if (role === "parents") {
      if (bannerIcon) bannerIcon.textContent = "???抽??;
      if (bannerTitle) bannerTitle.textContent = "閬芣??振?瑟憟踝?霅瑞閮??典歇??嚗遣霅唳?甈⊿隡?20 ????;
      if (bannerDesc) bannerDesc.textContent = "?憛??典??箸皞?鈭扛摮霈撠店?血????暑閫撖辣隡豢暑??撠?;
      if (bannerAction) {
        bannerAction.textContent = "?梧? 霅瑞?亙熒??";
        bannerAction.onclick = () => this.openEyeCareModal();
      }
    } else if (role === "teachers") {
      if (bannerIcon) bannerIcon.textContent = "????;
      if (bannerTitle) bannerTitle.textContent = "?祆??葦嚗蝡摰孵?Ｗ???STEAM ?匱?敹?擗?璅?;
      if (bannerDesc) bannerDesc.textContent = "???璅?隤輯??靘玨??蝯?隢?蝬梧??拙???撣園??函?Ｙ揣??;
      if (bannerAction) {
        bannerAction.textContent = "?? STEAM 蝝???";
        bannerAction.onclick = () => this.openCurriculumModal();
      }
    }

    if (window.storyManager && window.storyData) {
      window.storyManager.updateRolePanel(window.storyData[window.storyManager.currentPageIndex]);
    }
  }

  bindNavigationTabs() {
    const tabBtns = document.querySelectorAll(".nav-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        window.soundEngine.playPop();
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });

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

    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }

      setTimeout(() => window.gamesManager.resizeCanvas(), 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  addStars(amount) {
    this.stars += amount;
    if (window.securityGuard) {
      window.securityGuard.secureSetItem("wl_stars", this.stars);
    } else {
      localStorage.setItem("wl_stars", this.stars.toString());
    }
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
      if (window.securityGuard) {
        window.securityGuard.secureSetItem("wl_badges", this.badges);
      } else {
        localStorage.setItem("wl_badges", JSON.stringify(this.badges));
      }

      const info = this.badgeCatalog[badgeKey];
      if (info) {
        window.soundEngine.playSuccess();
        this.spawnConfetti();
        this.addStars(3);

        setTimeout(() => {
          alert(`?? 璁株亳?停閫??嚗n?脣???{info.icon} ${info.name}??\n?脣?憿? 3 憿??脫???`);
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
        <div class="badge-status">${isUnlocked ? "??撌脰圾?? : "?? 敺蝝?}</div>
        <div style="font-size: 0.72rem; color: #64748B; margin-top: 4px;">${item.desc}</div>
      `;
      container.appendChild(el);
    }

    modal.classList.add("active");
  }

  bindActionButtons() {
    const soundBtn = document.getElementById("headerSoundToggle");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const isMuted = window.soundEngine.toggleMute();
        soundBtn.classList.toggle("muted", isMuted);
        soundBtn.innerHTML = isMuted ? "??" : "??";
      });
    }

    const badgeBtn = document.getElementById("headerBadgesBtn");
    if (badgeBtn) {
      badgeBtn.addEventListener("click", () => {
        this.openBadgesModal();
      });
    }

    if (mascot) {
      mascot.addEventListener("click", () => {
        window.soundEngine.playBoing();
        mascot.style.transform = "scale(1.2) rotate(15deg)";
        this.spawnConfetti();
        setTimeout(() => mascot.style.transform = "", 300);
      });
    }

    if (dailyGift) {
      dailyGift.addEventListener("click", () => {
        this.openDailyGift();
      });
    }

    const openLegalBtn = document.getElementById("openLegalModalBtn");
    if (openLegalBtn) {
      openLegalBtn.addEventListener("click", () => {
        this.openLegalModal();
      });
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
    alert("?? ???拳?脣?瘥?賡?嚗? 憿??脣???嚗 敹急?餉圾???改?");
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

  openCurriculumModal() {
    const modal = document.getElementById("curriculumModal");
    if (modal) modal.classList.add("active");
  }

  openLegalModal() {
    if (window.soundEngine) window.soundEngine.playPop();
    const modal = document.getElementById("legalModal");
    if (modal) modal.classList.add("active");
  }

  initEyeTimer() {
      this.eyeTimerMinutes++;
      if (this.eyeTimerMinutes % 20 === 0 && this.currentRole === "parents") {
        this.openEyeCareModal();
      }
    }, 60000);
  }
}

  window.appManager = new AppManager();
  window.appManager.init();
});