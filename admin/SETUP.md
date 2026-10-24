# 連接答案收集

1. 開啟 https://script.google.com/home/start ，建立你自己的 Apps Script 專案。
2. 將 `create-google-form.gs` 全文貼進編輯器。
3. 執行 `createFlashReFocusForm`，完成 Google 要求的授權。
4. 執行記錄會顯示 `CONFIG_FOR_CODEX`、表單編輯連結和收答試算表連結。
5. 將 `CONFIG_FOR_CODEX` 的 JSON 另存為設定檔，執行：

   ```sh
   python3 tools/configure_collection.py CONFIG.json
   ```

   或將該 JSON 貼回原本的工作對話，交由代理協助設定。不要分享私人憑證。
6. 更新 GitHub 後，完整試填一次，在 Google 表單按下「提交」，親自確認試算表收到一筆完整答案，再對外招募。

腳本在你的 Google 帳號內建立表單與試算表，不會代替你送出測試答案。重新執行同一專案會沿用先前的表單。

公開程式內的 Form view URL 和 entry ID 是作答所需設定，不是寫入試算表的私人憑證。表單與試算表權限由你自己的 Google 帳號管理；請不要開放試算表讓參與者讀取彼此的答案。
