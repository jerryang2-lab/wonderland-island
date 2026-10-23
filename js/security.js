/**
 * ============================================================================
 * 奇幻歡樂島 (Wonderland Island) - 核心安全守護與版權保護模組 (適度放寬友善版)
 * ----------------------------------------------------------------------------
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * 
 * 本程式碼受中華民國著作權法與國際智慧財產權公約保護。
 * 嚴禁未經書面授權之重製、改作、公開傳輸、下載、逆向工程、反編譯或資料竄改。
 * ============================================================================
 */

class SecurityGuard {
  constructor() {
    this.salt = "W0nd3rL@nd_M@g1c_S3cur1ty_2026#Salt";
    this.isDevMode = this.checkDevMode();
    this.toastTimer = null;
    this.isDevToolsOpen = false;

    this.init();
  }

  /**
   * 檢查是否處於開發者放行模式 (透過 URL ?dev=1 或 sessionStorage)
   */
  checkDevMode() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("dev") === "1" || urlParams.get("dev_mode") === "true") {
        sessionStorage.setItem("wl_dev_mode", "true");
        return true;
      }
      return sessionStorage.getItem("wl_dev_mode") === "true";
    } catch (e) {
      return false;
    }
  }

  init() {
    this.printLegalWatermark();
    this.preventEmbedding();

    if (this.isDevMode) {
      console.info("%c[SecurityGuard] 🛠️ 開發者模式已啟用，安全阻斷已放行。", "color: #10B981; font-weight: bold; font-size: 13px;");
      return;
    }

    this.initContextMenuBlocker();
    this.initCopyBlocker();
    this.initKeyBlocker();
    this.initDevToolsDetector();
  }

  /**
   * 控制台輸出高對比法律與智慧財產權宣告浮水印
   */
  printLegalWatermark() {
    try {
      const titleStyle = "color: #FF5E7E; font-size: 18px; font-weight: 900; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); padding: 4px 0;";
      const warningStyle = "color: #D97706; font-size: 13px; font-weight: bold; padding: 2px 0;";
      const bodyStyle = "color: #4B5563; font-size: 12px; line-height: 1.6; font-family: sans-serif;";

      console.log("%c🛑 奇幻歡樂島 - 著作權與法律聲明 (Copyright & Legal Notice)", titleStyle);
      console.log("%c⚠️ 智慧財產權保護：本網站之一切程式碼、美術插畫、1000常用單字題庫與音效資產均受法律保護。", warningStyle);
      console.log(
        "%c依《中華民國著作權法》及國際著作權公約規定，未經著作權人正式書面許可，\n" +
        "嚴禁任何形式之代碼抓取、重製、散布、下載、反編譯、逆向工程或數據竄改。\n" +
        "違者將依法搜集存證追究民事賠償與刑事責任。",
        bodyStyle
      );
    } catch (e) {}
  }

  /**
   * 防點擊劫持 (Anti-Clickjacking / Framebusting)
   */
  preventEmbedding() {
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    } catch (e) {
      try {
        window.location = "about:blank";
      } catch (err) {}
    }
  }

  /**
   * 禁用滑鼠右鍵選單，彈出星寶可愛提示氣泡（輸入框內正常放行）
   */
  initContextMenuBlocker() {
    document.addEventListener("contextmenu", (e) => {
      if (this.isDevMode) return;
      const target = e.target;
      // 搜尋框與文字輸入區域放行右鍵方便孩子輸入剪貼
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return true;
      }
      e.preventDefault();
      this.showSecurityToast("✨ 島上的魔法寶藏受到守護，請用心探索，禁止複製唷！");
      return false;
    });
  }

  /**
   * 攔截複製與剪下操作（輸入框內正常放行，防止網頁本文被整段複製）
   */
  initCopyBlocker() {
    document.addEventListener("copy", (e) => {
      if (this.isDevMode) return;
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return true;
      }
      e.preventDefault();
      this.showSecurityToast("📜 奇幻歡樂島內容受智慧財產權保護，禁止未授權複製。");
      return false;
    });

    document.addEventListener("cut", (e) => {
      if (this.isDevMode) return;
      const target = e.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return true;
      }
      e.preventDefault();
      return false;
    });
  }

  /**
   * 攔截常用快捷鍵 (F12, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+Shift+I/J/C)
   */
  initKeyBlocker() {
    window.addEventListener("keydown", (e) => {
      if (this.isDevMode) return;

      const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      const key = (e.key || "").toLowerCase();
      const keyCode = e.keyCode || e.which;

      // F12 (開啟開發者工具)
      if (keyCode === 123 || key === "f12") {
        e.preventDefault();
        e.stopPropagation();
        this.showSecurityToast("🛡️ 魔法結界已啟動，開發者工具已受保護。");
        return false;
      }

      // Ctrl/Cmd + U (檢視網頁原始碼)
      // Ctrl/Cmd + S (儲存網頁至本機)
      // Ctrl/Cmd + P (列印網頁)
      if (ctrlOrCmd && (key === "u" || key === "s" || key === "p")) {
        e.preventDefault();
        e.stopPropagation();
        this.showSecurityToast("📜 奇幻歡樂島內容受智慧財產權保護，禁止下載原始碼。");
        return false;
      }

      // Ctrl/Cmd + Shift + I / J / C (開啟 DevTools)
      if (ctrlOrCmd && e.shiftKey && (key === "i" || key === "j" || key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        this.showSecurityToast("🛡️ 魔法結界已啟動，開發者工具已受保護。");
        return false;
      }
    }, true);
  }

  /**
   * 開發者工具尺寸偵測與警示 (友善非阻塞)
   */
  initDevToolsDetector() {
    const threshold = 160;
    const check = () => {
      if (this.isDevMode) return;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        if (!this.isDevToolsOpen) {
          this.isDevToolsOpen = true;
          this.printLegalWatermark();
        }
      } else {
        this.isDevToolsOpen = false;
      }
    };

    window.addEventListener("resize", check);
  }

  /**
   * 遞迴深度凍結物件，防止執行期記憶體篡改
   * @param {Object} obj 要凍結的目標物件
   */
  deepFreeze(obj) {
    if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
    try {
      Object.freeze(obj);
      const props = Object.getOwnPropertyNames(obj);
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const val = obj[prop];
        if (val !== null && (typeof val === "object" || typeof val === "function") && !Object.isFrozen(val)) {
          this.deepFreeze(val);
        }
      }
    } catch (e) {}
    return obj;
  }

  /**
   * 產生加鹽雜湊校驗碼 (Salted Checksum)
   * @param {string} key 鍵值
   * @param {any} value 資料內容
   */
  generateChecksum(key, value) {
    const str = String(key) + ":" + JSON.stringify(value) + ":" + String(this.salt);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 安全寫入 LocalStorage，附帶校驗簽章
   */
  secureSetItem(key, value) {
    try {
      const valStr = JSON.stringify(value);
      const checksum = this.generateChecksum(key, value);
      localStorage.setItem(key, valStr);
      localStorage.setItem(key + "_sig", checksum);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 安全讀取 LocalStorage，若遭到竄改則還原為 fallback 並重新簽章
   */
  secureGetItem(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      const sig = localStorage.getItem(key + "_sig");
      if (raw === null) return fallback;

      const parsed = JSON.parse(raw);
      const expectedSig = this.generateChecksum(key, parsed);

      if (sig !== expectedSig) {
        console.warn("[SecurityGuard] 偵測到鍵值「" + key + "」遭外部竄改！已自動重置保護機制。");
        this.secureSetItem(key, fallback);
        return fallback;
      }

      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  /**
   * 顯示優雅的兒童島嶼安全防護提示氣泡
   */
  showSecurityToast(message) {
    let toast = document.getElementById("securityToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "securityToast";
      toast.className = "security-toast";
      toast.setAttribute("role", "alert");
      toast.setAttribute("aria-live", "assertive");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("active");

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      toast.classList.remove("active");
    }, 2500);
  }
}

// 實例化並全域掛載防禦核心
window.securityGuard = new SecurityGuard();
