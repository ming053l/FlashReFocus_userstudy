# 接收、查看與匯出大家的答案 / Collect, view and export responses

## 一次性設定 / One-time setup

1. 開啟 https://script.google.com/home/start ，建立自己的 Apps Script 專案。
2. 將本目錄的 [create-google-form.gs](create-google-form.gs) **全文**貼進編輯器，儲存。
3. 上方函式選 `createFlashReFocusForm`，按「執行」，完成 Google 帳號授權。
4. 執行記錄會顯示三項：
   - `CONFIG_FOR_CODEX`：網站所需的表單 URL 與 entry ID；整段 JSON 貼回對話即可。
   - `EDIT_FORM`：你管理 Google 表單、查看原始提交的連結。
   - `VIEW_RESPONSES`：你查看明細、票數、匯出資料的 Google 試算表連結；請收藏。
5. 網站設定更新後，完整試填一次，在 Google 表單按「提交」，確認試算表出現 `valid` 答卷和 48 列逐題答案，再對外招募。

**Paste the whole script into a new Apps Script project and run `createFlashReFocusForm`. Authorize it, then send the logged `CONFIG_FOR_CODEX` JSON back to connect the site. Bookmark `VIEW_RESPONSES`. Test an actual complete submission before recruitment.**

腳本只建立表單、試算表與收答觸發器，不會建立假答卷。沿用同一 Apps Script 專案重新執行會重用原表單和題目 ID。Google 會處理自己的授權；不需要提供私人憑證或部署公開 Apps Script Web App。

## 大家怎麼送出 / Participant submission

完成網站 12 組比較 → 點「開啟 Google 表單並送出」→ 答案已自動帶入，不需重選 → 捲到底按「提交」。只有 Google 表單出現已收到的確認，才算提交。關掉網站、下載 JSON、開啟表單，都不代表已提交。

The website opens a prefilled Form. Participants must press **Submit in Google Forms**. The site cannot verify a cross-origin submission and does not claim success. JSON/CSV backups remain available.

## 你會看到什麼 / Results tabs

| 工作表 | 內容 |
| --- | --- |
| 說明 Guide | 閱讀和匯出說明 |
| 答卷 Responses | 每次提交一列；Response ID、語言、完成時間、觀看秒數、意見、有效／重複／無效狀態 |
| 逐題 Answers | 每份有效答卷 48 列；場景、問題、所選 A–E、候選 ID、模型、隨機排序與觀看時間 |
| 票數 Summary | 依版本／protocol hash／部分／問題／模型彙總票數、總票數和比例 |
| 問題 Issues | 無法解析、不完整、舊版本、重複送出等原因 |
| Codebook | 私下匯入的模型對照表 |
| Google 建立的原始回應表 | 原始提交，保留不動，可供查證與復原 |

A submission trigger refreshes the derived tabs automatically. If processing fails, the original Form response remains recorded: run `rebuildFlashReFocusResults` manually to retry. For a large study, batch processing may be needed because Apps Script has execution quotas.

同一 protocol hash、同一 Response ID 的重複提交，只計第一次有效提交；不等同於驗證「同一個人」，換裝置或重新開始會有新的 ID。不同 hash 分開彙總。無效答卷保留原始提交與原因，不計入票數。這些圖片是刻意挑選的，彙總結果不代表整個 benchmark 的隨機樣本。

## 顯示真正模型名稱 / Private model names

模型對照表不放在公開 repo。取得研究者私下提供的 `model-codebook.csv` 後，在 `Codebook` 工作表使用「檔案 → 匯入 → 上傳」，選「取代目前工作表」，保留三個欄名 `trial_id,candidate_id,model` 和所有資料。再在 Apps Script 執行 `rebuildFlashReFocusResults`。

對照表尚未匯入時，會顯示 candidate ID；匯入後，明細與票數就會顯示 FlashReFocus 等模型名稱。**不要公開分享收答試算表或 Codebook。**

## 匯出 / Export

- 全部工作表：試算表「檔案 → 下載 → Microsoft Excel (.xlsx)」。
- 單一工作表：先切到 `逐題 Answers` 或 `票數 Summary`，再「檔案 → 下載 → 逗號分隔值 (.csv)」。
- 原始提交也能在 Google 表單「回覆」頁下載 CSV。

[Google 官方：查看回應、連接試算表與下載 CSV](https://support.google.com/docs/answer/139706)

## 網站設定 / Site configuration

把執行記錄 JSON 存成 `CONFIG.json` 後，在 repo 根目錄執行：

```sh
python3 tools/configure_collection.py CONFIG.json
```

提交更新的 `docs/study.json` 後，GitHub Pages 會依原本 `main /docs` 設定更新。變更收答設定會更新 protocol hash；請保留先前版本資料，分開統計。Form view URL 和 entry ID 是公開作答所需設定，並非私人憑證。
