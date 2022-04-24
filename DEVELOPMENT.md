Vite を使ったJSアプリ開発の手順
===========================

## Vite について
https://ja.vitejs.dev/

## 環境構築
- [Node.js](https://nodejs.org/ja/)インストール
  ```
  brew install node # for MacOS
  node -v
  npm -v
  npm install -g npm
  npm -v
  ```
- yarn インストール
  ```
  npm install -g yarn
  yarn -v
  ```

## 開発手順
- アプリ雛型作成
  ```
  yarn create vite <app-name>
  (テンプレートを選択)
  (※フレームワークやTypeScriptが不要ならvanillaを選択)
  cd <app-name>
  ```
- ローカル実行
  ```
  yarn dev
  ```
  - http://localhost:3000/ で動かせる
- ビルド
  ```
  yarn build
  ```
  - ビルド結果が```dist```フォルダに出力される
- ビルド結果確認
  ```
  yarn preview
  ```
  - 表示されたURLで動作確認

## GitHub Pagesで公開
- gh-pages パッケージ追加
  ```
  yarn add --dev gh-pages
  ```
- package.json 編集
  ```
  "scripts": {
    ...,
    "deploy": "vite build && gh-pages -d dist"
  },
  ```
- GitHubにリポジトリを置く
- ```リポジトリ>Settings>Pages``` で公開するブランチとして ```gh-pages``` を指定
- GitHub PagesのURLはサブディレクトリになっているので、  
  index.htmlからのリンクを相対パスに変更する必要がある
  - ```vite.config.js``` を追加し、以下を設定
    ```javascript
    export default {
      base: ''
    }
    ```
- デプロイ
  ```
  yarn deploy
  ```
