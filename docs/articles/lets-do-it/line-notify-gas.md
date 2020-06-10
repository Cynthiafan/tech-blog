# 用 Line notify 來做個晨報吧！

::: tip 簡介
技術關鍵字：`Line notify`、`Google Apps Script (GAS)`
:::

## [Line notify](https://notify-bot.line.me/zh_TW/)

不同於 Line bot 可以接收訊息，Line notify 只能單方面傳訊息，不過 notify 服務是免費的，已經足夠應付大部分商家宣傳的需求。
Notify 有兩種模式，一個是提供 `開發人員` 使用，另一則是 `服務商` 使用，本篇討論的是前者，也就是只為自己或已建立之聊天室發送通知，通常會用在像是上版結果通知，或是像這篇一樣寫一個自嗨的服務。

**開發人員模式**基本上是以 `Line Notify` 這個 Line 官方帳號來發送訊息，所以要使用這個功能的前提是**不能封鎖這個帳號**。

設定重點整理：
  1. 在服務中對要服務的對象建立專屬權杖，此權杖只會出現一次
  1. 對 `https://notify-api.line.me/api/notify` 發送 `POST` 請求
  1. 除貼圖、圖片等，文字訊息只能傳純文字：`{ message: "" }`
  1. 把權杖放進 header：`{ Authorization: "Bearer " + {LINE_NOTIFY_TOKEN}`

## [Google Apps Script (GAS)](https://developers.google.com/apps-script)

選 GAS 的原因有兩個：
  1. Serverless，不用找其他雲端機器去部署程式碼
  2. 有定時功能，指定觸發 function 時間

還有一個必要條件：**可以打外部 API (external API)，見[坑 1](#唉唷跌了個坑)。**

## Let's do it! 

你可以接 [Weather API](https://openweathermap.org/api) 做天氣預報，也可以藉由 GAS 與其他 google 服務連接，而我這次只是簡單地下載了來自第三方的 csv 檔案，並組成自己想要的格式作為通知內容。

### 每天早上 9 點收到可申請抽籤的股票列表

```jsx
const LINE_NOTIFY_TOKEN = "linenotifytokenblahblahblah";
const lineNotifyUrl = "https://notify-api.line.me/api/notify";
const stockDrawCsvUrl = "https://www.twse.com.tw/announcement/publicForm?response=csv&yy=2020";
const detailUrl = "https://histock.tw/stock/public.aspx";

const openingText = "可申請抽籤列表： \n\n";
const endingText = `\n詳細查看：${detailUrl}`;

async function sendNotification() {

  // UrlFetchApp 是 GAS 的 fetch API
  const stockDrawList = await UrlFetchApp.fetch(stockDrawCsvUrl).getContentText("ms950");

  // Utilities 裡有 GAS 提供的各種 utils
  const parsedList = Utilities.parseCsv(stockDrawList);
  const indexes = {
    drawDate: 1,
    securitiesName: 2,
    securitiesCode: 3,
    dateStart: 5,
    dateEnd: 6,
    price: 10,
  }
  const today = Utilities.formatDate(new Date(), "GMT+8", 'yyyy/MM/dd');

  let resultStr = "";

  function converToAdYear(str) {
    let arr = str.split('/');
    arr[0] = (Number(arr[0]) + 1911).toString();
    
    return arr.join('/');
  }
  
  // The data we need is from row 2
  for (let i = 2; i < parsedList.length; i++) {
    const row = parsedList[i];
    
    const dateStart = converToAdYear(row[indexes.dateStart]);
    const dateEnd = converToAdYear(row[indexes.dateEnd]);
    const securitiesCode = row[indexes.securitiesCode];
    const securitiesName = row[indexes.securitiesName];
    const price = row[indexes.price];
    
    const isExpired = new Date(dateEnd) < new Date(today);
    const isCompany = /^[0-9]*$/.test(securitiesCode);
    
    if (isExpired) {
      break;
    }
    
    if (isCompany) {
      resultStr += `${securitiesName} \n${dateStart} - ${dateEnd} NT$${price} \n`;
    }
  }
  
  if (resultStr) {
    const options = {
      "method"  : "post",
      "payload" : {"message" : openingText + resultStr + endingText},
      "headers" : {"Authorization" : "Bearer " + LINE_NOTIFY_TOKEN}
    };
    
    UrlFetchApp.fetch(lineNotifyUrl, options);
  }
}
```
再從上方工具列的時鐘 icon 進去設定定時器，我設定每天早上 9 - 10 點戳這個 function，這樣就大功告成了。

## 唉唷跌了個坑

1. 原本想用 firebase cloud function，結合 database 等功能，結果 firebase free trial (Spark plan) 不能打 google 以外的第三方 API
2. 下載的 csv 在 GAS 出現亂碼，用 command line 查是 `charset=iso-8859-1`，但是 encode 還是錯誤，最後發現在 postman 上的 response 就沒有亂碼，查 response 的 header Content-Type 發現是 `text/csv;charset=ms950`，改成 `ms950` 就成功了