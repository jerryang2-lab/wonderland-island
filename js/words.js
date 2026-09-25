/**
 * 奇幻歡樂島 (Wonderland Island) - 1000 常用字母單字冒險島管理器
 * 負責：字母快選導航、3D 字卡翻翻樂、字母拼字小練習、互動測驗 Quiz 與生字收藏
 */

class WordsManager {
  constructor() {
    this.currentLetter = 'ALL';
    this.currentCategory = 'all';
    this.searchKeyword = '';
    this.activeMode = 'flashcards'; // 'flashcards', 'spelling', 'quiz', 'browser'

    // 字卡模式狀態
    this.filteredList = [];
    this.cardIndex = 0;
    this.isCardFlipped = false;
    this.isAutoPlay = false;
    this.autoPlayTimer = null;

    // 拼字練習狀態
    this.spellingTarget = null;
    this.spellingTiles = [];
    this.spellingPicked = [];
    this.spellingStreak = 0;

    // 測驗 Quiz 狀態
    this.quizType = 'en-to-zh'; // 'en-to-zh', 'zh-to-en', 'listening'
    this.quizQuestions = [];
    this.quizCurrentIndex = 0;
    this.quizScore = 0;
    this.quizCombo = 0;
    this.quizAnswered = false;

    // 生字收藏本 (localStorage)
    this.favorites = JSON.parse(localStorage.getItem('wl_favorite_words') || '[]');

    // 學習進度計數
    this.practiceCount = parseInt(localStorage.getItem('wl_words_practiced') || '0', 10);
    this.spellingCount = parseInt(localStorage.getItem('wl_spelling_solved') || '0', 10);
    this.quizBestScore = parseInt(localStorage.getItem('wl_quiz_best_score') || '0', 10);
  }

  init() {
    if (!window.wordsData) return;

    this.filteredList = [...window.wordsData.list];
    this.renderAlphabetBar();
    this.renderCategoryFilter();
    this.bindEvents();

    // 載入第一張字卡
    this.loadCard(0);
    this.updateStatsDisplay();
  }

  // --------------------------------------------------------------------------
  // 1. 介面渲染：A-Z 字母列與分類篩選器
  // --------------------------------------------------------------------------
  renderAlphabetBar() {
    const container = document.getElementById('wordsAlphabetBar');
    if (!container) return;

    const alphabet = 'ALL,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
    container.innerHTML = alphabet.map(l => `
      <button class="letter-chip ${l === this.currentLetter ? 'active' : ''}" data-letter="${l}">
        ${l === 'ALL' ? '全部' : l}
      </button>
    `).join('');

    container.querySelectorAll('.letter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.setLetterFilter(btn.dataset.letter);
      });
    });
  }

  renderCategoryFilter() {
    const container = document.getElementById('wordsCategoryFilter');
    if (!container) return;

    container.innerHTML = window.wordsData.categories.map(cat => `
      <button class="cat-pill-btn ${cat.id === this.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
        <span>${cat.icon}</span> ${cat.name}
      </button>
    `).join('');

    container.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.setCategoryFilter(btn.dataset.cat);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. 篩選與過濾邏輯
  // --------------------------------------------------------------------------
  setLetterFilter(letter) {
    this.currentLetter = letter;
    document.querySelectorAll('#wordsAlphabetBar .letter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.letter === letter);
    });
    this.applyFilters();
  }

  setCategoryFilter(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('#wordsCategoryFilter .cat-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    this.applyFilters();
  }

  applyFilters() {
    let list = window.wordsData.list;

    // 依字母過濾
    if (this.currentLetter !== 'ALL') {
      list = list.filter(item => item.l === this.currentLetter);
    }

    // 依分類過濾
    if (this.currentCategory !== 'all') {
      list = list.filter(item => item.cat === this.currentCategory);
    }

    // 依搜尋詞過濾
    if (this.searchKeyword) {
      const q = this.searchKeyword.toLowerCase();
      list = list.filter(item => item.w.toLowerCase().includes(q) || item.zh.includes(q));
    }

    this.filteredList = list;
    this.cardIndex = 0;

    // 更新各模式
    if (this.activeMode === 'flashcards') {
      this.loadCard(0);
    } else if (this.activeMode === 'browser') {
      this.renderDictionaryBrowser();
    } else if (this.activeMode === 'spelling') {
      this.initSpellingRound();
    }

    const counter = document.getElementById('wordsResultCount');
    if (counter) {
      counter.textContent = `共 ${this.filteredList.length} 個單字`;
    }
  }

  // --------------------------------------------------------------------------
  // 3. 字卡翻翻樂模式 (Interactive Flashcards)
  // --------------------------------------------------------------------------
  loadCard(index) {
    if (!this.filteredList.length) {
      this.renderEmptyCard();
      return;
    }

    if (index < 0) index = this.filteredList.length - 1;
    if (index >= this.filteredList.length) index = 0;

    this.cardIndex = index;
    const item = this.filteredList[index];

    // 更新正面
    const wordEl = document.getElementById('cardWordText');
    const phoneticEl = document.getElementById('cardPhoneticText');
    const iconEl = document.getElementById('cardIconEmoji');
    const catEl = document.getElementById('cardCategoryBadge');
    const letterEl = document.getElementById('cardLetterTag');
    const favBtn = document.getElementById('cardFavBtn');

    if (wordEl) wordEl.textContent = item.w;
    if (phoneticEl) phoneticEl.textContent = `${item.pos} ${item.p}`;
    if (iconEl) iconEl.textContent = item.icon || '✨';
    if (catEl) catEl.textContent = item.cat;
    if (letterEl) letterEl.textContent = `Letter ${item.l}`;

    // 更新背面
    const zhEl = document.getElementById('cardZhText');
    const exEl = document.getElementById('cardExampleEn');
    const exZhEl = document.getElementById('cardExampleZh');

    if (zhEl) zhEl.textContent = item.zh;
    if (exEl) exEl.textContent = item.ex;
    if (exZhEl) exZhEl.textContent = item.exZh;

    // 收藏愛心狀態
    const isFav = this.favorites.includes(item.w);
    if (favBtn) {
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = isFav ? '❤️' : '🤍';
    }

    // 重置翻面
    this.flipCard(false);

    // 進度文字
    const progEl = document.getElementById('cardProgressText');
    if (progEl) {
      progEl.textContent = `${index + 1} / ${this.filteredList.length}`;
    }

    // 累積學習計數
    this.practiceCount++;
    localStorage.setItem('wl_words_practiced', this.practiceCount);
    if (this.practiceCount >= 20 && window.appManager) {
      window.appManager.unlockBadge('wordLearner');
    }
  }

  flipCard(forceState) {
    const card = document.getElementById('flashcardElement');
    if (!card) return;

    if (typeof forceState === 'boolean') {
      this.isCardFlipped = forceState;
    } else {
      this.isCardFlipped = !this.isCardFlipped;
    }
    card.classList.toggle('flipped', this.isCardFlipped);
  }

  speakCurrentCard() {
    if (!this.filteredList.length) return;
    const item = this.filteredList[this.cardIndex];
    window.soundEngine.playPop();
    window.soundEngine.speakWord(item.w);
  }

  speakCurrentExample() {
    if (!this.filteredList.length) return;
    const item = this.filteredList[this.cardIndex];
    window.soundEngine.playPop();
    window.soundEngine.speakWord(item.ex);
  }

  toggleFavoriteCurrent() {
    if (!this.filteredList.length) return;
    const item = this.filteredList[this.cardIndex];
    const idx = this.favorites.indexOf(item.w);

    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(item.w);
      window.soundEngine.playSuccess();
      if (window.appManager) window.appManager.spawnConfetti();
    }

    localStorage.setItem('wl_favorite_words', JSON.stringify(this.favorites));
    const favBtn = document.getElementById('cardFavBtn');
    const isFav = this.favorites.includes(item.w);
    if (favBtn) {
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = isFav ? '❤️' : '🤍';
    }
    this.updateStatsDisplay();
  }

  toggleAutoPlay() {
    this.isAutoPlay = !this.isAutoPlay;
    const btn = document.getElementById('cardAutoPlayBtn');
    if (btn) {
      btn.classList.toggle('active', this.isAutoPlay);
      btn.innerHTML = this.isAutoPlay ? '⏹️ 停止自動播放' : '▶️ 自動翻讀';
    }

    if (this.isAutoPlay) {
      this.speakCurrentCard();
      this.autoPlayTimer = setInterval(() => {
        this.loadCard(this.cardIndex + 1);
        this.speakCurrentCard();
      }, 3500);
    } else {
      clearInterval(this.autoPlayTimer);
    }
  }

  renderEmptyCard() {
    const wordEl = document.getElementById('cardWordText');
    if (wordEl) wordEl.textContent = '無符合單字';
    const zhEl = document.getElementById('cardZhText');
    if (zhEl) zhEl.textContent = '請嘗試切換字母或清除搜尋詞';
  }

  // --------------------------------------------------------------------------
  // 4. 拼字魔法小練習 (Spelling Puzzle Practice)
  // --------------------------------------------------------------------------
  initSpellingRound() {
    const pool = this.filteredList.length ? this.filteredList : window.wordsData.list;
    const item = pool[Math.floor(Math.random() * pool.length)];
    this.spellingTarget = item;
    this.spellingPicked = [];

    // 打散單字字母
    const chars = item.w.toLowerCase().replace(/[^a-z]/g, '').split('');
    const tiles = chars.map((char, id) => ({ id, char, used: false }));

    // Fisher-Yates 洗牌
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    this.spellingTiles = tiles;
    this.renderSpellingUI();
    window.soundEngine.speakWord(item.w);
  }

  renderSpellingUI() {
    const target = this.spellingTarget;
    if (!target) return;

    // 提示資訊
    const hintIcon = document.getElementById('spellHintIcon');
    const hintZh = document.getElementById('spellHintZh');
    const hintPos = document.getElementById('spellHintPos');
    const feedback = document.getElementById('spellFeedback');

    if (hintIcon) hintIcon.textContent = target.icon || '🧩';
    if (hintZh) hintZh.textContent = target.zh;
    if (hintPos) hintPos.textContent = `${target.pos} • ${target.cat}`;
    if (feedback) feedback.textContent = '';

    // 已填入槽位
    const slotContainer = document.getElementById('spellSlotsContainer');
    if (slotContainer) {
      const targetClean = target.w.toLowerCase().replace(/[^a-z]/g, '');
      slotContainer.innerHTML = targetClean.split('').map((_, idx) => {
        const pickedChar = this.spellingPicked[idx];
        return `
          <div class="spell-slot ${pickedChar ? 'filled' : ''}">
            ${pickedChar ? pickedChar.char.toUpperCase() : ''}
          </div>
        `;
      }).join('');
    }

    // 字母積木池
    const tilesContainer = document.getElementById('spellTilesContainer');
    if (tilesContainer) {
      tilesContainer.innerHTML = this.spellingTiles.map(tile => `
        <button class="spell-tile-btn ${tile.used ? 'used' : ''}" data-id="${tile.id}" ${tile.used ? 'disabled' : ''}>
          ${tile.char.toUpperCase()}
        </button>
      `).join('');

      tilesContainer.querySelectorAll('.spell-tile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tileId = parseInt(btn.dataset.id, 10);
          this.pickSpellingTile(tileId);
        });
      });
    }
  }

  pickSpellingTile(tileId) {
    const tile = this.spellingTiles.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    tile.used = true;
    this.spellingPicked.push(tile);
    window.soundEngine.playPop();
    this.renderSpellingUI();

    const targetClean = this.spellingTarget.w.toLowerCase().replace(/[^a-z]/g, '');
    if (this.spellingPicked.length === targetClean.length) {
      this.checkSpellingResult();
    }
  }

  undoSpellingTile() {
    if (!this.spellingPicked.length) return;
    const last = this.spellingPicked.pop();
    last.used = false;
    window.soundEngine.playBoing();
    this.renderSpellingUI();
  }

  checkSpellingResult() {
    const currentWord = this.spellingPicked.map(p => p.char).join('');
    const targetClean = this.spellingTarget.w.toLowerCase().replace(/[^a-z]/g, '');
    const feedback = document.getElementById('spellFeedback');

    if (currentWord === targetClean) {
      window.soundEngine.playSuccess();
      if (window.appManager) {
        window.appManager.spawnConfetti();
        window.appManager.addStars(2);
      }

      this.spellingStreak++;
      this.spellingCount++;
      localStorage.setItem('wl_spelling_solved', this.spellingCount);

      if (this.spellingCount >= 10 && window.appManager) {
        window.appManager.unlockBadge('spellingChampion');
      }

      if (feedback) {
        feedback.innerHTML = `🎉 太棒了！拼字正確：<strong>${this.spellingTarget.w}</strong>！獲得 2 顆金色小星星！⭐`;
        feedback.className = 'spell-feedback success';
      }

      setTimeout(() => {
        this.initSpellingRound();
      }, 1800);
    } else {
      window.soundEngine.playBoing();
      if (feedback) {
        feedback.innerHTML = `再想一想喔！可以點擊「撤銷」或聽聽發音提示！`;
        feedback.className = 'spell-feedback error';
      }
    }
  }

  giveSpellingHint() {
    const targetClean = this.spellingTarget.w.toLowerCase().replace(/[^a-z]/g, '');
    const nextIndex = this.spellingPicked.length;
    if (nextIndex >= targetClean.length) return;

    const neededChar = targetClean[nextIndex];
    const availableTile = this.spellingTiles.find(t => !t.used && t.char === neededChar);

    if (availableTile) {
      window.soundEngine.playMagic();
      this.pickSpellingTile(availableTile.id);
    }
  }

  // --------------------------------------------------------------------------
  // 5. 單字測驗挑戰 Quiz (Multiple Choice & Listening)
  // --------------------------------------------------------------------------
  startQuiz(type = 'en-to-zh') {
    this.quizType = type;
    this.quizCurrentIndex = 0;
    this.quizScore = 0;
    this.quizCombo = 0;
    this.quizAnswered = false;

    // 隨機生成 10 道測驗題
    this.quizQuestions = [];
    for (let i = 0; i < 10; i++) {
      this.quizQuestions.push(window.wordsData.generateQuiz(type, this.currentCategory));
    }

    document.getElementById('quizIntroCard').style.display = 'none';
    document.getElementById('quizResultCard').style.display = 'none';
    document.getElementById('quizPlayArea').style.display = 'block';

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    if (this.quizCurrentIndex >= this.quizQuestions.length) {
      this.finishQuiz();
      return;
    }

    this.quizAnswered = false;
    const q = this.quizQuestions[this.quizCurrentIndex];
    const progressEl = document.getElementById('wordsQuizProgress');
    const scoreEl = document.getElementById('wordsQuizScore');
    const promptEl = document.getElementById('wordsQuizPrompt');
    const audioBtn = document.getElementById('wordsQuizAudioBtn');
    const optionsContainer = document.getElementById('wordsQuizOptions');
    const feedbackEl = document.getElementById('wordsQuizFeedback');
    const nextBtn = document.getElementById('wordsQuizNextBtn');

    if (progressEl) progressEl.textContent = `第 ${this.quizCurrentIndex + 1} / ${this.quizQuestions.length} 題`;
    if (scoreEl) scoreEl.textContent = `得分: ${this.quizScore}`;
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'quiz-feedback';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    // 題目形式
    if (q.type === 'en-to-zh') {
      promptEl.innerHTML = `<span style="font-size: 2.2rem; font-weight: 700; color: var(--primary-blue);">${q.target.w}</span><div style="font-size: 1rem; color: var(--text-muted); margin-top: 4px;">${q.target.pos} ${q.target.p}</div>`;
      if (audioBtn) {
        audioBtn.style.display = 'inline-flex';
        audioBtn.onclick = () => window.soundEngine.speakWord(q.target.w);
      }
      window.soundEngine.speakWord(q.target.w);
    } else if (q.type === 'zh-to-en') {
      promptEl.innerHTML = `<span style="font-size: 2rem; font-weight: 700; color: var(--primary-pink);">${q.target.icon || '🌸'} ${q.target.zh}</span><div style="font-size: 1rem; color: var(--text-muted); margin-top: 4px;">請選出正確的英文單字</div>`;
      if (audioBtn) audioBtn.style.display = 'none';
    } else if (q.type === 'listening') {
      promptEl.innerHTML = `<div style="font-size: 2.5rem; margin-bottom: 6px;">🎧</div><div style="font-size: 1.3rem; font-weight: 700; color: #118AB2;">仔細聆聽發音，選出對應單字！</div>`;
      if (audioBtn) {
        audioBtn.style.display = 'inline-flex';
        audioBtn.onclick = () => window.soundEngine.speakWord(q.target.w);
      }
      setTimeout(() => window.soundEngine.speakWord(q.target.w), 300);
    }

    // 選項渲染
    if (optionsContainer) {
      optionsContainer.innerHTML = q.options.map((opt, idx) => {
        const text = q.type === 'en-to-zh' ? `${opt.zh}` : `${opt.w}`;
        return `
          <button class="quiz-opt-btn" data-index="${idx}">
            <span class="opt-badge">${['A', 'B', 'C', 'D'][idx]}</span>
            <span class="opt-text">${text}</span>
          </button>
        `;
      }).join('');

      optionsContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.quizAnswered) return;
          const selectedIdx = parseInt(btn.dataset.index, 10);
          this.handleQuizAnswer(selectedIdx);
        });
      });
    }
  }

  handleQuizAnswer(selectedIdx) {
    this.quizAnswered = true;
    const q = this.quizQuestions[this.quizCurrentIndex];
    const isCorrect = selectedIdx === q.correctIndex;
    const btns = document.querySelectorAll('#wordsQuizOptions .quiz-opt-btn');
    const feedbackEl = document.getElementById('wordsQuizFeedback');
    const nextBtn = document.getElementById('wordsQuizNextBtn');

    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      window.soundEngine.playSuccess();
      this.quizCombo++;
      const earned = 10 + (this.quizCombo > 2 ? 5 : 0);
      this.quizScore += earned;

      if (feedbackEl) {
        feedbackEl.innerHTML = `✅ 答對了！${q.target.w} = ${q.target.zh} ${this.quizCombo > 2 ? `🔥 ${this.quizCombo} 連擊！` : ''}`;
        feedbackEl.className = 'quiz-feedback success';
      }
    } else {
      window.soundEngine.playBoing();
      this.quizCombo = 0;
      if (feedbackEl) {
        feedbackEl.innerHTML = `❌ 正確答案是：<strong>${q.target.w} (${q.target.zh})</strong>`;
        feedbackEl.className = 'quiz-feedback wrong';
      }
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.onclick = () => {
        this.quizCurrentIndex++;
        this.renderQuizQuestion();
      };
    }
  }

  finishQuiz() {
    document.getElementById('quizPlayArea').style.display = 'none';
    const resultCard = document.getElementById('quizResultCard');
    if (resultCard) resultCard.style.display = 'block';

    const finalScoreEl = document.getElementById('quizFinalScore');
    const titleEl = document.getElementById('quizResultTitle');
    const descEl = document.getElementById('quizResultDesc');

    if (finalScoreEl) finalScoreEl.textContent = this.quizScore;

    if (this.quizScore > this.quizBestScore) {
      this.quizBestScore = this.quizScore;
      localStorage.setItem('wl_quiz_best_score', this.quizBestScore);
    }

    if (this.quizScore >= 100) {
      window.soundEngine.playMagic();
      if (window.appManager) {
        window.appManager.spawnConfetti();
        window.appManager.addStars(10);
        window.appManager.unlockBadge('quizMaster');
      }
      if (titleEl) titleEl.textContent = '🌟 滿分大通關！單字智多星！';
      if (descEl) descEl.textContent = '太不可思議了！你成功答對了所有題目，榮獲滿分大獎與 10 顆金色星星！';
    } else if (this.quizScore >= 70) {
      window.soundEngine.playSuccess();
      if (window.appManager) window.appManager.addStars(5);
      if (titleEl) titleEl.textContent = '🎉 表現優異！單字小冒險家！';
      if (descEl) descEl.textContent = '表現非常棒！獲得 5 顆金色星星，再接再厲邁向滿分吧！';
    } else {
      window.soundEngine.playBoing();
      if (titleEl) titleEl.textContent = '💪 繼續加油！';
      if (descEl) descEl.textContent = '多翻翻單字卡與練習拼字，下一次一定會更棒！';
    }

    this.updateStatsDisplay();
  }

  // --------------------------------------------------------------------------
  // 6. 1000 常用字大字典清單 (Browser / Table Mode)
  // --------------------------------------------------------------------------
  renderDictionaryBrowser() {
    const container = document.getElementById('wordsDictionaryGrid');
    if (!container) return;

    if (!this.filteredList.length) {
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: #94A3B8;">查無符合條件的單字，請嘗試切換篩選條件。</div>';
      return;
    }

    container.innerHTML = this.filteredList.map((item, idx) => `
      <div class="word-dict-card">
        <div class="dict-card-top">
          <span class="dict-card-icon">${item.icon || '📘'}</span>
          <span class="dict-card-cat">${item.cat}</span>
          <button class="dict-speak-btn" onclick="window.soundEngine.speakWord('${item.w}')" title="朗讀發音">🔊</button>
        </div>
        <div class="dict-card-word">${item.w}</div>
        <div class="dict-card-phonetic">${item.pos} ${item.p}</div>
        <div class="dict-card-zh">${item.zh}</div>
        <div class="dict-card-ex">${item.ex}</div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 7. 模式切換與事件綁定
  // --------------------------------------------------------------------------
  switchMode(mode) {
    this.activeMode = mode;

    document.querySelectorAll('.words-mode-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.querySelectorAll('.words-subpanel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`words-panel-${mode}`);
    if (activePanel) activePanel.classList.add('active');

    if (mode === 'flashcards') {
      this.loadCard(this.cardIndex);
    } else if (mode === 'spelling') {
      this.initSpellingRound();
    } else if (mode === 'browser') {
      this.renderDictionaryBrowser();
    } else if (mode === 'quiz') {
      document.getElementById('quizIntroCard').style.display = 'block';
      document.getElementById('quizPlayArea').style.display = 'none';
      document.getElementById('quizResultCard').style.display = 'none';
    }
  }

  bindEvents() {
    // 模式切換按鈕
    document.querySelectorAll('.words-mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.switchMode(btn.dataset.mode);
      });
    });

    // 搜尋欄
    const searchInput = document.getElementById('wordsSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchKeyword = e.target.value;
        this.applyFilters();
      });
    }

    // 字卡操作
    const cardEl = document.getElementById('flashcardElement');
    if (cardEl) {
      cardEl.addEventListener('click', (e) => {
        // 若點擊的是發音或收藏按鈕則不翻轉
        if (e.target.closest('button')) return;
        window.soundEngine.playBoing();
        this.flipCard();
      });
    }

    const prevBtn = document.getElementById('cardPrevBtn');
    const nextBtn = document.getElementById('cardNextBtn');
    const speakBtn = document.getElementById('cardSpeakBtn');
    const favBtn = document.getElementById('cardFavBtn');
    const autoPlayBtn = document.getElementById('cardAutoPlayBtn');
    const randomBtn = document.getElementById('cardRandomBtn');

    if (prevBtn) prevBtn.onclick = () => { window.soundEngine.playPop(); this.loadCard(this.cardIndex - 1); };
    if (nextBtn) nextBtn.onclick = () => { window.soundEngine.playPop(); this.loadCard(this.cardIndex + 1); };
    if (speakBtn) speakBtn.onclick = () => this.speakCurrentCard();
    if (favBtn) favBtn.onclick = () => this.toggleFavoriteCurrent();
    if (autoPlayBtn) autoPlayBtn.onclick = () => this.toggleAutoPlay();
    if (randomBtn) randomBtn.onclick = () => {
      window.soundEngine.playMagic();
      const randIdx = Math.floor(Math.random() * this.filteredList.length);
      this.loadCard(randIdx);
    };

    // 拼字練習按鈕
    const spellSpeak = document.getElementById('spellSpeakBtn');
    const spellUndo = document.getElementById('spellUndoBtn');
    const spellHint = document.getElementById('spellHintBtn');
    const spellNext = document.getElementById('spellNextBtn');

    if (spellSpeak) spellSpeak.onclick = () => this.spellingTarget && window.soundEngine.speakWord(this.spellingTarget.w);
    if (spellUndo) spellUndo.onclick = () => this.undoSpellingTile();
    if (spellHint) spellHint.onclick = () => this.giveSpellingHint();
    if (spellNext) spellNext.onclick = () => { window.soundEngine.playPop(); this.initSpellingRound(); };

    // Quiz 測驗入口
    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.startQuiz(btn.dataset.quizType);
      });
    });

    const quizRestart = document.getElementById('quizRestartBtn');
    if (quizRestart) quizRestart.onclick = () => this.startQuiz(this.quizType);
  }

  updateStatsDisplay() {
    const learnedCountEl = document.getElementById('statsLearnedCount');
    const favCountEl = document.getElementById('statsFavCount');
    const bestScoreEl = document.getElementById('statsBestScore');

    if (learnedCountEl) learnedCountEl.textContent = this.practiceCount;
    if (favCountEl) favCountEl.textContent = this.favorites.length;
    if (bestScoreEl) bestScoreEl.textContent = `${this.quizBestScore} 分`;
  }
}

// 導出全局單例
window.wordsManager = new WordsManager();
