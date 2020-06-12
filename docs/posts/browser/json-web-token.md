---
title: JSON Web Token (JWT)
tags: 
  - jwt
  - token
---

# JSON Web Token (JWT)

::: tip 總而言之
1. JWT 是一個**概念、規範**，不同的語言皆有遵循此規範來實現驗證的 library。
2. 遵循 JWT 規範所生產出的 Token 分成三個部分： `xxxx.yyyy.zzzz` ，分別代表了 `[Header].[Payload].[Signature]`。
:::

## 為什麼叫做 **`JSON`** Web Token?

在 Header 、 Payload 的設定中皆為 JSON 格式，Stringify 後再轉成 **base64 編碼**，成為 JWT 的第一與第二部分。

補充：Browser 支援把 String 轉 base64 及其反向。

```jsx
btoa('Cynthia'); // "Q3ludGhpYQ=="
atob('Q3ludGhpYQ=='); // "Cynthia"
```

---

## 分解說明

### Part 1: Header 

**理論上**會載明兩個部分：這是怎樣的 token 與第三部分的 Signature 要用什麼**演算法 (algorithm)**。

```json
{
	"typ": "JWT",
	"alg": "HS256"
}
```

補充：JWT 為了簡潔 (compat) 所以制定所有 key 皆為 3 個字元的規範。

### Part 2: Payload

載明了所有 user 所需資訊或是額外的 data，作為這個 token 的聲明 (Claim)。聲明會分為三類：

1. **Registered claims**<br/>
非強制但推薦，包含 `iss` , `sub` , `aud` , `exp` , `nbf` , `iat` , `jti` 7 種
2. **Public claims**<br/>
為了避免衝突，優先使用 [IANA JSON Web Token Claims](https://tools.ietf.org/html/rfc7519#section-10.1) 所註冊的命名，
或是使用可以避免衝突的命名如添加 namespace
3. **Private claims**<br/>
使用者自訂，需避免使用前兩項所包含的命名以減少命名衝突的發生

最後會將這個 JSON stringify 並且轉為 base64 編碼。

::: danger 注意
最後的結果可以經過 base64 decode 回原本的資料，所以在 payload 裡不應該有任何敏感資料。
:::

### Part 3: Signature

將轉為 base64 編碼的前兩部分用 `.` 串起後，加上自訂的 `secret/privateKey` 並使用 Header 所載明的演算法產出新字串，再將該字串轉成 base64 格式。

```jsx
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

## 優缺點

### 優點

1. 同傳統 token 一樣，**無狀態性**：以現在多個 server 或是 microservice 當道的情形，無需像 session 要存在 database/redis 達到多個 server 共享，每個 server 都可以自己解析 token 是否合法
2. 減少後端的負擔：由於 jwt 的 header 跟 payload 是可以被 decode 的，所以在前端要送 request 出來之前可以先做掉一些驗證，像是如果從 payload 裡的 exp 發現過期了，就不會繼續送這個 request

### 缺點

1. 安全性：相較於存在於 database/redis 的 session，再加上 payload 是可以被 decode 的，因此不能儲存任何敏感數據
2. 較為笨重：由於 jwt 是分成三個部分，又如果後端希望能多放易於存取的非敏感資料在 payload，那生成出來的 jwt 就會很長一串，再加上 cookie 的限制大小為 4kb，如果放不下 cookie 的話就會改放在 request header 裡面，導致整個傳輸變得很笨重

## 總結

Jwt 的本質基本上與普通的 token 相去無幾，只是 jwt 能在不被前端完全解析的前提下提早驗證（像是只需要檢查 payload 的 exp 是否過期）。除此之外，jwt 也讓許多開發者在包裝 token 套件時有一個規範可循。

在生產 jwt 時，自訂 payload 的部分盡量還是以「有辨識性」、「不常變動」的要素作為指標，以免當夾帶的資訊被修改後，就要重新發放一個新的 jwt，原本的 jwt 雖然還能用但是卻是舊的資訊，要避免被使用的話，只能再去建立一個黑名單去擋掉，但是這樣就等於把無狀態的特性給白費掉了。

## 參考文章

1. [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
2. [是誰在敲打我窗？什麼是 JWT ？｜專欄文章｜五倍紅寶石](https://5xruby.tw/posts/what-is-jwt/)


<CustomVssue :title="$page.title" />