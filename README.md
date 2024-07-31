## アプリの起動

```bash
npm i
npm run dev # アプリケーションを起動します デフォルトはlocalhost:300で起動
open http://localhost:3000/

npm run server # jsonファイルデータを永続化するAPIサーバーを起動します
```

## ログイン時に使用するデータ

```json
{
  "users": [
    {
      "id": "admin",
      "password": "admin"
    },
    {
      "id": "user1",
      "password": "user1"
    },
    {
      "id": "user2",
      "password": "user2"
    }
  ]
}
```

ユーザごとに登録したパスキーでログインできることを確認してみてください。
`db.json`に永続化してます。
