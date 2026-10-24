/**
 * ???????(Wonderland Island) - ????瞉???(Obfuscated Production Bundle)
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * ?蟡????謅????????遴鬥????蝞賂???輻??????????鞈??桀???皜??２??湛??蹓澗????蹓????????? */

/* security.js – 輕量防右鍵 / 防開發者工具 / 防下載 */
(() => {
  document.addEventListener('contextmenu', e => {
    const tag = e.target.tagName.toLowerCase();
    if (!['input', 'textarea'].includes(tag)) e.preventDefault();
  });

  const block = e => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (e.key === 'F12' || (isCtrl && e.shiftKey && key === 'i')
        || (isCtrl && key === 's') || (isCtrl && key === 'u')) {
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', block, true);

  console.log(`\n   © 2026 Jerry Ang – MIT License\n`);
})();
