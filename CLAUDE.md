# 工作車庫存管理 — 專案說明

## 目的
讓工作車同事查看工具／材料放哪裡。管理員可維護內容，訪客只能瀏覽。

## 技術架構
- **前端**：React 18 + Vite，純 inline style（無 CSS framework）
- **資料庫**：Firebase Firestore（即時同步）
- **登入**：Firebase Auth，Google 登入（signInWithPopup，失敗 fallback redirect）
- **部署**：Vercel，自動從 GitHub main branch 部署

## 使用者角色
| 角色 | 條件 | 權限 |
|---|---|---|
| 管理員 | email 符合 `VITE_ADMIN_EMAIL` | 新增／編輯／刪除區塊與品項 |
| 訪客 | 未登入或非管理員帳號 | 只能瀏覽、點區塊看品項備註 |

## 環境變數（Vercel 設定）
| 變數 | 說明 |
|---|---|
| `VITE_ADMIN_EMAIL` | 管理員 email，多人用逗號分隔：`a@gmail.com,b@gmail.com` |

改完一定要在 Vercel → Deployments → Redeploy 才會生效。

## Firebase 設定
```js
// src/lib/firebase.js（直接寫死，不用環境變數）
const firebaseConfig = {
  apiKey: "AIzaSyDsjvPZaGgosY9S5mwpUgARw_m7IiqMjQY",
  authDomain: "car-inventory-8598d.firebaseapp.com",
  projectId: "car-inventory-8598d",
  storageBucket: "car-inventory-8598d.firebasestorage.app",
  messagingSenderId: "199743478637",
  appId: "1:199743478637:web:ed1bf5c18426d78ef4d864"
};
```

### Firebase Console 必要設定
1. **Authorized domains**：Authentication → Settings → Authorized domains → 加入 Vercel 網址（不含 https://）
2. **Firestore 安全規則**：
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 檔案結構
```
src/
├── App.jsx                  # 根元件
├── main.jsx
├── index.css                # 全域樣式
├── lib/firebase.js          # Firebase 初始化
├── hooks/
│   ├── useAuth.js           # Google 登入、isAdmin 判斷
│   └── useBlocks.js         # Firestore 即時監聽、CRUD
└── components/
    ├── Header.jsx           # 頂部導覽列（sticky）
    ├── VehicleLayout.jsx    # 主版面 + 管理員工具列（sticky）
    ├── FloorArea.jsx        # 車廂容器，負責等比縮放
    ├── FloorBlock.jsx       # 地板區塊，支援拖曳／縮放
    └── BlockModal.jsx       # 點區塊彈出的 bottom sheet
```

## Firestore 資料結構
```
collection: blocks
  {auto-id}:
    area:      "floor"
    color:     "#FEF9C3"       # 便利貼配色
    x, y:      number          # 絕對定位（px，設計畫布座標）
    width:     number
    height:    number
    items:     [{ id, name, quantity, notes }]
    createdAt: Timestamp
```

## 版面邏輯
- **設計畫布**：固定 448×700px，手機自動等比縮放（ResizeObserver 量寬度算 scale）
- 拖曳／縮放的 pointer delta 除以 scale 換算回畫布座標
- 車頭（裝飾橫條）在頂部，與車廂同寬無縫接合
- Desktop：maxWidth 480px 置中；mobile：全寬，無橫向捲動
- **版面編輯模式**：管理員點「調整區塊位置」才能拖曳，平常不會和頁面滑動衝突
- Header sticky top:0（zIndex 100）；管理員工具列 sticky top:52px（zIndex 90）

## 配色
| 用途 | 色碼 |
|---|---|
| Header 背景 | `#4E6E81` |
| 工具列背景 | `#E1D4BB` |
| 頁面背景 | `#F7FBFC` |
| 車廂地板背景 | `#EEF5F8` |
| 標題文字 | `#2C3333` |
| 次要文字 | `#6B7280` |
| 區塊顏色（10色便利貼） | `#FEF9C3` `#DCFCE7` `#F3E8FF` `#FFE4E6` `#E0F2FE` `#FFEDD5` `#F0FDFA` `#F5F5F4` `#FFEDFA` `#ECFCCB` |

## 常見問題
- **登入後仍是訪客**：Vercel 的 `VITE_ADMIN_EMAIL` 沒設定，或設完沒 Redeploy
- **Google 登入失敗**：Firebase Console → Auth → Authorized domains 未加 Vercel 網址
- **手機區塊被截斷**：車廂已有等比縮放機制，若仍異常請確認 FloorArea 的 ResizeObserver 正常運作
