# 📋 單字探險島角色權限控制

## 目標
依角色（兒童 / 家長 / 老師）限制在「單字探險島」中可見的子功能按鈕：

| 子功能 | 兒童 🧒 | 家長 👨‍👩‍👧 | 老師 👩‍🏫 |
|--------|:------:|:------:|:------:|
| 🃏 字卡翻翻樂 | ✅ | ✅ | ✅ |
| 🧩 拼字小練習 | ❌ | ✅ | ✅ |
| 🏆 測驗大挑戰 | ❌ | ❌ | ✅ |
| 📚 1000字大字典 | ❌ | ❌ | ✅ |

---

## Proposed Changes

### `index.html` — 四個按鈕加上 `data-min-role` 屬性

為每個按鈕加上 `data-min-role` 屬性，標記允許的最低角色：

```diff
- <button class="words-mode-tab-btn active" data-mode="flashcards">
+ <button class="words-mode-tab-btn active" data-mode="flashcards" data-min-role="kids">

- <button class="words-mode-tab-btn" data-mode="spelling">
+ <button class="words-mode-tab-btn" data-mode="spelling" data-min-role="parents">

- <button class="words-mode-tab-btn" data-mode="quiz">
+ <button class="words-mode-tab-btn" data-mode="quiz" data-min-role="teachers">

- <button class="words-mode-tab-btn" data-mode="browser">
+ <button class="words-mode-tab-btn" data-mode="browser" data-min-role="teachers">
```

---

### `js/app.js` — 在 `switchRole()` 加入子功能可見性控制

#### 方案：角色等級排序

```js
const ROLE_LEVEL = { kids: 0, parents: 1, teachers: 2 };
```

在 `switchRole(role)` 尾部加入：

```js
// 控制單字島子功能按鈕的顯示/隱藏
this.updateWordsSubNav(role);
```

新增方法 `updateWordsSubNav(role)`：

```js
updateWordsSubNav(role) {
  const ROLE_LEVEL = { kids: 0, parents: 1, teachers: 2 };
  const currentLevel = ROLE_LEVEL[role] ?? 0;

  document.querySelectorAll('.words-mode-tab-btn[data-min-role]').forEach(btn => {
    const minLevel = ROLE_LEVEL[btn.dataset.minRole] ?? 0;
    const allowed = currentLevel >= minLevel;

    // 顯示或隱藏按鈕
    btn.style.display = allowed ? '' : 'none';

    // 若當前 active 按鈕被隱藏，切換到第一個可見按鈕
    if (!allowed && btn.classList.contains('active')) {
      btn.classList.remove('active');
      const firstVisible = document.querySelector(
        '.words-mode-tab-btn[data-min-role]:not([style*="none"])'
      );
      if (firstVisible) {
        firstVisible.classList.add('active');
        // 同步觸發子面板切換
        const mode = firstVisible.dataset.mode;
        if (window.wordsManager && typeof window.wordsManager.switchMode === 'function') {
          window.wordsManager.switchMode(mode);
        }
      }
    }
  });
}
```

> **設計原則**：按鈕用 `display:none` 隱藏（不用 `disabled`），讓 UI 更乾淨、不留空洞。

---

## 驗證計畫

### 手動驗證步驟
1. 開啟 `index.html`，預設為**兒童**模式 → 切換到【單字探險島】
   - 應只看到：🃏 字卡翻翻樂
2. 切換到**家長**模式 → 進入【單字探險島】
   - 應看到：🃏 字卡翻翻樂 ＋ 🧩 拼字小練習
3. 切換到**老師**模式 → 進入【單字探險島】
   - 應看到全部四個按鈕
4. 在兒童模式下，若先切換到拼字小練習（不存在），確認 active 自動回到字卡翻翻樂
5. 切換角色時，若當前 active 按鈕被隱藏，確認畫面自動跳回字卡翻翻樂（不殘留空白面板）

---
*請確認後按下 Proceed 執行修改。*
