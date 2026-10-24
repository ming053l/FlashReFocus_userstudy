# FlashReFocus user study

公開作答版／Public participant site. 中文與 English 可切換，包含 12 組比較、每組 4 題，兩個部分各有 5 個方法。圖片可同步縮放與拖曳；載入器支援限流、快取、自動重試、像素相同的備援圖與下一題預載。

## Publish with GitHub Pages

Repository → **Settings → Pages**:

1. Source: **Deploy from a branch**.
2. Branch: **main**, folder: **/docs**, then **Save**.
3. Wait for the Pages deployment to complete.

Expected project URL once enabled:

- 中文：`https://ming053l.github.io/FlashReFocus_userstudy/?lang=zh-Hant`
- English: `https://ming053l.github.io/FlashReFocus_userstudy/?lang=en`

Only `docs/` is published. Researcher/model-label pages, the private codebook, local machine paths and responses are not included in this repository. All asset URLs are relative so the project subdirectory works.

## Response collection

已設定 Google Form 收答。參與者完成網站後，仍須在已填好的 Google 表單按「提交」；下載答案並不等同提交。正式招募前，請實際試填並驗證試算表收件。以下是重設收答表單的步驟。

1. Follow [admin/SETUP.md](admin/SETUP.md) to create the Form and spreadsheet in your own Google account.
2. Use `python3 tools/configure_collection.py CONFIG.json` with the generated `CONFIG_FOR_CODEX` object.
3. Commit the updated `docs/study.json` and wait for Pages to redeploy.
4. Complete a test response and confirm it actually appears in the response spreadsheet before recruitment.

The setup script creates the Form, its private spreadsheet, and a submission trigger. After setup, `答卷 Responses` shows each submission, `逐題 Answers` expands its 48 answers, `票數 Summary` aggregates votes, and `問題 Issues` reports duplicates or invalid submissions. Import the private model codebook to resolve candidate IDs to model names. The derived tabs can be downloaded as Excel/CSV; the original Form responses remain intact.

The final page opens a prefilled Google Form; the participant presses Submit there. The site does not claim an external submission succeeded. Anonymous JSON/CSV backups remain available. No GitHub token, spreadsheet write credential or researcher secret belongs in this public repository.

## Study design

This is a deliberately curated stimulus set, selected to highlight visible FlashReFocus advantages. It is **not a representative random sample** and its aggregate preferences must not be generalized to an entire benchmark. Candidate order, scene order and block order are randomized once per response and persisted in the browser. The researcher’s model-label mapping is kept separately.

The current manifest adds previously omitted GenRefocus outputs to the six bokeh scenes. Earlier protocol hashes represent separate pilot versions. Changing the method set or collector recalculates the protocol hash; earlier answers must remain separate.

## Local verification

Node.js 22+ and Python 3 are sufficient; no GPU or build dependencies are required.

```sh
node --test tests/*.test.mjs
node tools/audit_assets.mjs
python3 -m http.server 8080
```

To check the GitHub project path locally, open `http://localhost:8080/docs/?lang=zh-Hant`. To serve the site at `/`, use `python3 -m http.server 8080 --directory docs` instead.

Keep stimulus pixels lossless. `docs/image-delivery.json` records the original file hashes and their identical-pixel fallback formats. Download progress and failed images do not count as active viewing time; the page only accepts votes after every comparison image has decoded.

Deployment reference: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
