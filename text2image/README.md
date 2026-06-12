# Text2Image

テキストを入力して、フォント・色・背景をカスタマイズし、**JPEG画像**としてダウンロードできるWebサービスです。

## 機能

- テキストの入力（改行対応）
- 画像サイズの指定（幅・高さ、プリセットあり）
- フォント選択（ゴシック体 / 明朝体 / 等幅 / 丸ゴシック）
- フォントサイズ・行間・太字・テキスト揃えの設定
- 文字色のカスタマイズ（プリセット + カラーピッカー）
- 背景色のカスタマイズ（プリセット + カラーピッカー）
- 余白の調整
- JPEG形式でダウンロード

## 開発環境のセットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## GitHub + Vercel でのデプロイ手順

### 1. GitHubにリポジトリを作成

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<あなたのユーザー名>/text2image.git
git push -u origin main
```

### 2. Vercelにデプロイ

1. [https://vercel.com](https://vercel.com) にログイン（GitHubアカウントで可）
2. 「New Project」をクリック
3. GitHubリポジトリ `text2image` を選択
4. フレームワークは **Next.js** が自動検出されます
5. 「Deploy」をクリック

以上で公開URLが発行されます。以降は `git push` するたびに自動でデプロイされます。

## 技術スタック

- [Next.js 14](https://nextjs.org/)
- HTML Canvas API（クライアントサイドで画像生成）
- CSS Modules
- Vercel（ホスティング）
