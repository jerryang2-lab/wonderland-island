/**
 * 奇幻歡樂島 (Wonderland Island) - 探索小百科模組
 * 內容：萬物為什麼 3D 翻翻卡、趣味益智即時挑戰賽
 */

const wonderCardsData = [
  {
    icon: "🌌",
    question: "為什麼白天的天空是藍色的？",
    answer: "太陽光看似白色的，其實包含了彩虹的所有光！當太陽光穿過地球的大氣層時，藍色光的波長很短，最容易被空氣分子向四面八方「散射」開來，所以我們抬頭看到的整片天空都是藍色哦！",
    category: "宇宙奧秘"
  },
  {
    icon: "🦓",
    question: "斑馬是黑底白紋，還是白底黑紋？",
    answer: "科學家發現，斑馬在媽媽肚子裡一開始是全黑的！長大過程中，基因抑制了某些部位的黑色素沉澱，才浮現出白色的線條。所以斑馬其實是「黑底白紋」的酷炫小夥伴！",
    category: "奇妙動物"
  },
  {
    icon: "🌱",
    question: "小草和花朵晚上也需要睡覺嗎？",
    answer: "是的！許多植物也有「生理時鐘」。到了夜晚，花瓣或葉片會輕輕垂下或合攏休息（科學上稱為睡眠運動），這樣可以減少水分蒸發並抵禦夜間的寒冷哦！",
    category: "自然科學"
  },
  {
    icon: "🌙",
    question: "為什麼月亮有時候像香蕉、有時像大餅？",
    answer: "月亮自己不會發光，它就像一面大鏡子反射太陽光。當月亮繞著地球轉時，我們從地球上看過去的角度不同，看到的照亮區域就不同，這就是有趣的「月相變化」！",
    category: "宇宙奧秘"
  },
  {
    icon: "🐳",
    question: "巨大的藍鯨，牠的心臟有多大呢？",
    answer: "藍鯨是地球上最大的動物，牠的心臟大約有一輛小型汽車那麼大，重量可達 180 公斤！小朋友甚至可以在藍鯨的主動脈血管裡鑽進去呢！",
    category: "奇妙動物"
  },
  {
    icon: "🌈",
    question: "為什麼下雨過後，天空會出現彩虹？",
    answer: "下雨後空氣中漂浮著許多細小的水滴。當陽光穿過這些小水滴時，水滴就像小小三稜鏡，將陽光折射並分解成了紅、橙、黃、綠、藍、靛、紫七色光芒！",
    category: "自然科學"
  }
];

const quizQuestions = [
  {
    question: "下列哪一種動物在睡覺時，會手牽手漂在水面上避免被水流沖走？",
    options: ["海獺 (Sea Otter)", "小企鵝", "海龜", "海豚"],
    answerIndex: 0,
    explanation: "海獺睡覺時會手牽著手，或者用海藻把自己纏住，真的超級溫馨可愛！"
  },
  {
    question: "蜜蜂是透過什麼特別的方式，告訴同伴哪裡有好吃的花蜜呢？",
    options: ["吹口哨", "跳「八字搖擺舞」", "拍動翅膀發光", "在地上畫箭頭"],
    answerIndex: 1,
    explanation: "蜜蜂會透過八字形的「搖擺舞」傳遞花蜜的距離與太陽方位的角度哦！"
  },
  {
    question: "如果把紅色的顏料和黃色的顏料均勻混在一起，會變成什麼顏色？",
    options: ["綠色", "紫色", "橙色 (橘色)", "黑色"],
    answerIndex: 2,
    explanation: "紅色加黃色會調出溫暖的橙色！就像你在魔法玩具箱的實驗一樣！"
  }
];

class KnowledgeManager {
  constructor() {
    this.currentQuizIndex = 0;
    this.quizScore = 0;
  }

  init() {
    this.renderWonderCards();
    this.initQuiz();
  }

  renderWonderCards() {
    const grid = document.getElementById("wonderCardsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    wonderCardsData.forEach(item => {
      const card = document.createElement("div");
      card.className = "wonder-card";
      card.innerHTML = `
        <div class="wonder-card-inner">
          <div class="wonder-card-front">
            <div class="wonder-icon">${item.icon}</div>
            <div class="wonder-question">${item.question}</div>
            <div class="wonder-hint">👆 點擊卡片看解答</div>
          </div>
          <div class="wonder-card-back">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">💡 小秘密揭曉</div>
            <div class="wonder-answer">${item.answer}</div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        window.soundEngine.playBoing();
        card.classList.toggle("flipped");
      });

      grid.appendChild(card);
    });
  }

  initQuiz() {
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.renderQuizQuestion();

    const restartBtn = document.getElementById("quizRestartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        window.soundEngine.playPop();
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.renderQuizQuestion();
      });
    }
  }

  renderQuizQuestion() {
    const questionEl = document.getElementById("quizQuestionText");
    const optionsContainer = document.getElementById("quizOptionsContainer");
    const progressEl = document.getElementById("quizProgressText");
    const feedbackEl = document.getElementById("quizFeedbackText");
    const restartBtn = document.getElementById("quizRestartBtn");

    if (!questionEl || !optionsContainer) return;

    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.className = "";
    }
    if (restartBtn) restartBtn.style.display = "none";

    if (this.currentQuizIndex >= quizQuestions.length) {
      // 測驗結束
      questionEl.innerHTML = `🎉 恭喜完成小挑戰！你答對了 ${this.quizScore} / ${quizQuestions.length} 題！`;
      optionsContainer.innerHTML = "";
      if (progressEl) progressEl.textContent = "挑戰結束！";
      if (restartBtn) restartBtn.style.display = "inline-flex";

      window.soundEngine.playSuccess();
      if (window.appManager) {
        window.appManager.spawnConfetti();
        window.appManager.addStars(this.quizScore * 2);
        window.appManager.unlockBadge("scholar");
      }
      return;
    }

    const currentQ = quizQuestions[this.currentQuizIndex];
    if (progressEl) progressEl.textContent = `第 ${this.currentQuizIndex + 1} / ${quizQuestions.length} 題`;
    questionEl.textContent = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((optText, index) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.textContent = `${String.fromCharCode(65 + index)}. ${optText}`;

      btn.addEventListener("click", () => {
        this.handleQuizAnswer(index, btn, currentQ);
      });

      optionsContainer.appendChild(btn);
    });
  }

  handleQuizAnswer(selectedIndex, clickedBtn, currentQ) {
    const allBtns = document.querySelectorAll(".quiz-opt-btn");
    allBtns.forEach(btn => btn.disabled = true);

    const feedbackEl = document.getElementById("quizFeedbackText");

    if (selectedIndex === currentQ.answerIndex) {
      window.soundEngine.playSuccess();
      clickedBtn.classList.add("correct");
      this.quizScore++;
      if (feedbackEl) {
        feedbackEl.innerHTML = `✨ 答對了！太聰明啦！<br><span style="font-size: 0.9rem; color: #4B5563;">${currentQ.explanation}</span>`;
        feedbackEl.style.color = "#059669";
      }
    } else {
      window.soundEngine.playBoing();
      clickedBtn.classList.add("wrong");
      allBtns[currentQ.answerIndex].classList.add("correct");
      if (feedbackEl) {
        feedbackEl.innerHTML = `💡 差一點點哦！正確答案是：${currentQ.options[currentQ.answerIndex]}。<br><span style="font-size: 0.9rem; color: #4B5563;">${currentQ.explanation}</span>`;
        feedbackEl.style.color = "#DC2626";
      }
    }

    // 1.8 秒後進入下一題
    setTimeout(() => {
      this.currentQuizIndex++;
      this.renderQuizQuestion();
    }, 2000);
  }
}

window.knowledgeManager = new KnowledgeManager();
