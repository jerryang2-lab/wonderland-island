/* security.js – 輕量防右鍵 / 防開發者工具 / 防下載 */
(() => {
  // 防右鍵（允許在輸入框、文字區域內使用右鍵選單）
  document.addEventListener('contextmenu', e => {
    const tag = e.target.tagName.toLowerCase();
    if (!['input', 'textarea'].includes(tag)) e.preventDefault();
  });

  // 阻止 F12、Ctrl+Shift+I、Ctrl+S、Ctrl+U 等快捷鍵
  const block = e => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (e.key === 'F12' || (isCtrl && e.shiftKey && key === 'i')
        || (isCtrl && key === 's') || (isCtrl && key === 'u')) {
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', block, true);

  // Console 版權浮水印（首次開啟時顯示）
  console.log(`\n   © 2026 Jerry Ang – MIT License\n`);
})();
