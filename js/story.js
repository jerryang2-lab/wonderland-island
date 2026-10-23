/**
 * ???????(Wonderland Island) - ????瞉???(Obfuscated Production Bundle)
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * ?蟡????謅????????遴鬥????蝞賂???輻??????????鞈??桀???皜??２??湛??蹓澗????蹓????????? */

/**
 * 奇幻歡樂島 (Wonderland Island) - 奇幻故事島模組
 * 繪本：《星光小熊的彩虹冒險》
 */

const storyData = [
  {
    page: 1,
    title: "第一頁：星夜啟程",
    text: "在軟綿綿的棉花糖雲朵上，住著一隻戴著睡帽的星光小熊波波。有一天夜晚，波波發現天空少了一道彩虹，星星也顯得好孤單。於是，波波拿起了閃亮的小星杖，準備展開一場尋找色彩的冒險！",
    parentTip: "💡 親子互動指南：引導孩子抬頭看看窗外或天花板，問問孩子：「如果你能去雲朵上玩，你最想帶什麼玩具去呢？」",
    teacherTip: "🎯 教學目標連結：自然領域素養－引導幼兒探索黑夜、星星與雲朵的自然現象，培養好奇心與探究精神。",
    hotspots: [
      { id: "bear", label: "點點波波小熊", icon: "🐻", top: "45%", left: "45%", action: "wave" },
      { id: "star", label: "閃爍星杖", icon: "⭐", top: "35%", left: "62%", action: "sparkle" },
      { id: "cloud", label: "棉花糖雲", icon: "☁️", top: "65%", left: "20%", action: "puff" }
    ],
    bgStyle: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
    textColor: "#FFFFFF"
  },
  {
    page: 2,
    title: "第二頁：翡翠森林的跳跳蛙",
    text: "波波乘著微風來到了翡翠森林。咕嚕嚕！一隻戴著荷葉帽的小樹蛙跳跳躍出了池塘。跳跳聽說波波在尋找色彩，開心地唱起歌，並送給波波一片閃爍綠光的晶瑩露珠：「收下這片大自然的生機吧！」",
    parentTip: "💡 親子互動指南：和孩子一起練習發出「青蛙呱呱」的聲音，聊聊「分享」的感覺，讓孩子回憶最近分享過什麼東西給他人？",
    teacherTip: "🎯 教學目標連結：社會與情緒學習（SEL）－探討友誼、友善互助的美德，並介紹森林生態中綠色植物與兩棲類。",
    hotspots: [
      { id: "frog", label: "點點小樹蛙", icon: "🐸", top: "50%", left: "48%", action: "ribbit" },
      { id: "leaf", label: "荷葉露珠", icon: "🍃", top: "38%", left: "28%", action: "sparkle" },
      { id: "flower", label: "發光花朵", icon: "🌸", top: "62%", left: "70%", action: "bloom" }
    ],
    bgStyle: "linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)",
    textColor: "#FFFFFF"
  },
  {
    page: 3,
    title: "第三頁：金黃暖陽的小海豚",
    text: "波波帶著綠露珠來到蔚藍大海。嘩啦！金色小海豚悠悠從浪花中翻滾躍出。悠悠用尾巴拍出一朵燦爛的金色浪花，天空灑下了溫暖的金色光芒：「小熊，把這份溫暖的金黃色也帶去天空吧！」",
    parentTip: "💡 親子互動指南：閉上眼睛深呼吸三次，模仿海浪「嘩～嘩～」的平靜節奏，幫助孩子放鬆心情、增進專注力。",
    teacherTip: "🎯 教學目標連結：STEAM 跨領域思考－探討大海的顏色、波浪的形成，以及陽光如何照亮大地與給予生物能量。",
    hotspots: [
      { id: "dolphin", label: "躍起的小海豚", icon: "🐬", top: "45%", left: "52%", action: "leap" },
      { id: "wave", label: "閃亮浪花", icon: "🌊", top: "65%", left: "30%", action: "splash" },
      { id: "sun", label: "溫暖陽光", icon: "☀️", top: "20%", left: "75%", action: "glow" }
    ],
    bgStyle: "linear-gradient(135deg, #0C4A6E 0%, #0284C7 50%, #38BDF8 100%)",
    textColor: "#FFFFFF"
  },
  {
    page: 4,
    title: "第四頁：星空下的七色彩虹",
    text: "波波將所有收集到的綠意、金光與愛心高高舉起，揮動閃耀的星杖。霎時間，黑夜綻放出絢麗奪目的七彩光芒！一道巨大的彩虹橋橫跨了整個天空，所有好朋友都聚在彩虹下開心地歡呼唱歌！",
    parentTip: "💡 親子互動指南：恭喜讀完！抱抱孩子並讚美他的專注，一起約定在塗鴉畫板上畫下一道屬於你們家的幸福彩虹！",
    teacherTip: "🎯 教學目標連結：藝術美感涵養－彩虹光譜色順序（紅橙黃綠藍靛紫）的啟蒙認知，鼓勵孩子進行故事接龍或繪畫創作。",
    hotspots: [
      { id: "rainbow", label: "點擊七色彩虹", icon: "🌈", top: "30%", left: "50%", action: "rainbowFanfare" },
      { id: "allFriends", label: "歡呼的小夥伴", icon: "🎉", top: "65%", left: "50%", action: "cheer" }
    ],
    bgStyle: "linear-gradient(135deg, #F43F5E 0%, #8B5CF6 50%, #06B6D4 100%)",
    textColor: "#FFFFFF"
  }
];

class StoryManager {
  constructor() {
    this.currentPageIndex = 0;
    this.isReading = false;
  }

  init() {
    this.bindEvents();
    this.renderCurrentPage();
  }

  bindEvents() {
    const prevBtn = document.getElementById("storyPrevBtn");
    const nextBtn = document.getElementById("storyNextBtn");
    const readBtn = document.getElementById("storyReadBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.prevPage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.nextPage();
      });
    }

    if (readBtn) {
      readBtn.addEventListener("click", () => {
        this.toggleSpeech();
      });
    }
  }

  renderCurrentPage() {
    const pageData = storyData[this.currentPageIndex];
    if (!pageData) return;

    window.soundEngine.stopSpeech();
    this.updateReadBtnState(false);

    const pageIndicator = document.getElementById("storyPageIndicator");
    const pageTitle = document.getElementById("storyPageTitle");
    const paragraph = document.getElementById("storyParagraph");
    const stage = document.getElementById("storyIllustrationStage");
    const prevBtn = document.getElementById("storyPrevBtn");
    const nextBtn = document.getElementById("storyNextBtn");

    if (pageIndicator) pageIndicator.textContent = `第 ${pageData.page} / ${storyData.length} 頁`;
    if (pageTitle) pageTitle.textContent = pageData.title;
    if (paragraph) paragraph.textContent = pageData.text;

    if (stage) {
      stage.style.background = pageData.bgStyle;
      stage.innerHTML = "";

      pageData.hotspots.forEach(hotspot => {
        const el = document.createElement("div");
        el.className = "interactive-hotspot";
        el.style.top = hotspot.top;
        el.style.left = hotspot.left;
        el.style.fontSize = "3.2rem";
        el.innerHTML = `
          <span>${hotspot.icon}</span>
          <span class="hotspot-hint">${hotspot.label}</span>
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          this.handleHotspotClick(hotspot, el);
        });

        stage.appendChild(el);
      });
    }

    if (prevBtn) prevBtn.disabled = (this.currentPageIndex === 0);
    if (nextBtn) {
      if (this.currentPageIndex === storyData.length - 1) {
        nextBtn.innerHTML = `<span>完成繪本</span> 🏆`;
      } else {
        nextBtn.innerHTML = `<span>下一頁</span> ➡️`;
      }
    }

    this.updateRolePanel(pageData);

    if (this.currentPageIndex === storyData.length - 1 && window.appManager) {
      window.appManager.unlockBadge("storyReader");
    }
  }

  handleHotspotClick(hotspot, element) {
    element.style.transform = "scale(1.4) rotate(15deg)";
    setTimeout(() => {
      element.style.transform = "";
    }, 300);

    switch (hotspot.action) {
      case "wave":
        window.soundEngine.playBoing();
        this.showFloatingBubble(element, "波波：出發囉！✨");
        break;
      case "sparkle":
        window.soundEngine.playMagic();
        this.showFloatingBubble(element, "✨ 亮晶晶！");
        break;
      case "puff":
        window.soundEngine.playPop();
        this.showFloatingBubble(element, "好軟好甜的雲～☁️");
        break;
      case "ribbit":
        window.soundEngine.playBoing();
        this.showFloatingBubble(element, "跳跳蛙：呱呱！送你綠意！🐸");
        break;
      case "bloom":
        window.soundEngine.playMagic();
        this.showFloatingBubble(element, "花朵綻放了！🌸");
        break;
      case "leap":
        window.soundEngine.playSuccess();
        this.showFloatingBubble(element, "悠悠：加油！陽光與你同在！🐬");
        break;
      case "splash":
        window.soundEngine.playSplash();
        this.showFloatingBubble(element, "浪花翻騰！🌊");
        break;
      case "glow":
        window.soundEngine.playMagic();
        this.showFloatingBubble(element, "金黃陽光灑滿天地！☀️");
        break;
      case "rainbowFanfare":
        window.soundEngine.playSuccess();
        if (window.appManager) window.appManager.spawnConfetti();
        this.showFloatingBubble(element, "七色彩虹現身啦！🌈🎉");
        break;
      case "cheer":
        window.soundEngine.playSuccess();
        this.showFloatingBubble(element, "好朋友們開心歡呼！🥳");
        break;
      default:
        window.soundEngine.playPop();
    }
  }

  showFloatingBubble(parent, text) {
    const bubble = document.createElement("div");
    bubble.className = "mascot-bubble";
    bubble.textContent = text;
    bubble.style.position = "absolute";
    bubble.style.bottom = "100%";
    bubble.style.left = "50%";
    bubble.style.transform = "translateX(-50%)";
    bubble.style.zIndex = "10";
    bubble.style.pointerEvents = "none";
    parent.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1800);
  }

  toggleSpeech() {
    if (this.isReading) {
      window.soundEngine.stopSpeech();
      this.updateReadBtnState(false);
    } else {
      const pageData = storyData[this.currentPageIndex];
      window.soundEngine.speakText(
        pageData.text,
        () => {
          this.updateReadBtnState(true);
        },
        () => {
          this.updateReadBtnState(false);
        }
      );
    }
  }

  updateReadBtnState(reading) {
    this.isReading = reading;
    const readBtn = document.getElementById("storyReadBtn");
    if (readBtn) {
      if (reading) {
        readBtn.innerHTML = `<span>暫停朗讀</span> ⏸️`;
        readBtn.style.background = "#FFE4E6";
        readBtn.style.color = "#E11D48";
      } else {
        readBtn.innerHTML = `<span>伴讀發音</span> 🔊`;
        readBtn.style.background = "";
        readBtn.style.color = "";
      }
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.renderCurrentPage();
    }
  }

  nextPage() {
    if (this.currentPageIndex < storyData.length - 1) {
      this.currentPageIndex++;
      this.renderCurrentPage();
    } else {
      window.soundEngine.playSuccess();
      if (window.appManager) {
        window.appManager.spawnConfetti();
        window.appManager.addStars(5);
      }
      alert("🎉 恭喜小朋友讀完《星光小熊的彩虹冒險》！獲得 5 顆星星與「故事小偵探」榮譽徽章！");
    }
  }

  updateRolePanel(pageData) {
    const parentPanel = document.getElementById("storyParentTips");
    const teacherPanel = document.getElementById("storyTeacherTips");

    if (parentPanel) parentPanel.textContent = pageData.parentTip;
    if (teacherPanel) teacherPanel.textContent = pageData.teacherTip;
  }
}

window.storyManager = new StoryManager();
