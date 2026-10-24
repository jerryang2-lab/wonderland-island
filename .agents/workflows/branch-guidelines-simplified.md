# 🌿 Git 分支簡易原則

## 分支類型 & 命名
- **main**: 永遠可部署、穩定。
- **develop**: 整合所有功能，作為下個版本的基礎。
- **feature/`xxx`**: 單一功能開發，例如 `feature/login`。
- **bugfix/`xxx`**: 小錯誤修正，例如 `bugfix/navbar`。
- **release/`vX.Y.Z`**: 準備發佈，僅做最後測試與微調。
- **hotfix/`xxx`**: 直接從 `main` 修補緊急生產問題。

> 命名建議：全小寫、短破折號 (`-`) 分隔，必要時在前綴加上 Issue 編號，例如 `feature/1234-login`。

## 工作流程
1. **建立**：`git checkout -b <type>/<name>`（從 `develop` 或 `main`）。
2. **開發**：保持小而清晰的 commit，使用 Conventional Commits。定期 `git pull --rebase origin develop` 同步。
3. **測試**：本地 & CI 必須全部通過。 
4. **Pull Request**：目標分支 `develop`（feature/bugfix）或 `main`（release/hotfix），至少 1 位 reviewer，CI 必過。
5. **合併**：`rebase & merge` 或 `squash & merge`，保留乾淨歷史。
6. **刪除**：合併後立即刪除遠端與本地分支。

## 保護分支
- **main**、**develop** 設為受保護：禁止直接 push、必須通過 CI & Code Review 才能合併。

## 版號與 Tag
- 合併到 `main` 時使用 SemVer 標記：`vMAJOR.MINOR.PATCH`。
- Tag 同步至 `package.json` 版本。

---

*此簡化版僅保留核心概念，依需求可自行擴充。*
