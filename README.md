# 社交工程資安意識訓練網頁簡報

這是一個可直接部署到 GitHub Pages、Cloudflare Pages、Netlify 或公司內網的靜態網頁簡報。

## 檔案結構

- `index.html`：固定入口頁
- `slides.js`：投影片內容與講者備忘錄
- `styles.css`：版面樣式
- `app.js`：投影片切換、目錄、講者模式、列印與 hash 導航

## 使用方式

直接開啟 `index.html` 即可瀏覽。

鍵盤操作：

- `→` / `PageDown` / 空白鍵：下一頁
- `←` / `PageUp`：上一頁
- `S`：切換講者模式
- `O`：開啟投影片總覽

## 更新內容

日後只要更新 `slides.js`，並部署到同一個路徑，使用者原本的網址不需要改。

建議固定網址範例：

```text
https://<github-user>.github.io/social-engineering-training/
```

## GitHub Pages 部署

1. 建立 GitHub repository，例如 `social-engineering-training`
2. 將本資料夾內的檔案放到 repository 根目錄，或放在 `docs/`
3. 到 repository 的 `Settings` → `Pages`
4. Source 選擇 `Deploy from a branch`
5. 選擇 `main` branch 與 `/root` 或 `/docs`
6. 儲存後等待 GitHub 產生固定網址

## 正式版建議

若加入公司內部通報信箱、SOC 分機、內部流程連結或政策內容，建議改部署到公司內網、SharePoint 或需要登入的訓練平台。
