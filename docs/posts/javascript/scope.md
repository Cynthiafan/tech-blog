---
tags:
  - scope
  - scope chain
  - lexical scope
  - dynamic scope

---

# Scope

<Tags :tags="$page.frontmatter.tags" />


::: tip Scope
有人翻成**作用域**，有人翻作**範疇**，以下皆使用原文。
:::

一言以敝之，在 JS 中可以存取變數的範圍就稱為 `Scope`。

## JS 中的各種 Scope 

大略分成三種：

1. Global scope
2. Local scope：在 function 裡宣告的變數
3. Block scope：任何在 `{}` 中宣告的變數，例如 `if`, `switch` , `for`

就像是一個國王擁有一個王國 (global)，王國又劃分幾個領地給領主 (local)，領主再劃分土地出去給農家耕種 (block)。當然也有不屬於領主的自耕農地，但地還是屬於國王的。

## Nested Scope

scope 可以存在於其他 scope 中：

```jsx
let name = 'Cynthia'; // ----------> Global scope

function greet() { // -------------> Outer local scope
  let greeting = 'Hello';

  function setSentence() { // -----> inner local scope
    let lang = 'English';
    console.log(`${lang}: ${greeting} ${name}`);
  }

  setSentence();
}

greet(); // 'English: Hello Cynthia';
```

## Scope Chain - JS engine 如何找到變數

JS engine 要取得變數的值時，會先從當前的 scope 開始找，如果在當前的 scope 找不到，便會繼續向外查找，這樣的動作會持續到找到該變數，這樣的規則就稱作 `Scope Chain`。

如果到了 global scope 還是沒有找到該變數，依照狀況會有兩種可能：
1. 嚴格模式 (strict mode)：return error
2. 非嚴格模式：在 global scope 宣告該變數

以上面的程式碼為例，在 `setSentence` 這個 local scope 中找不到變數 `greeting` 及 `name`，就繼續往外面找，並且在 outer local scope `greet` 中找到 `greeting`，再到 global scope 找到 `name`，才會 return 最後的結果。

## Scope 帶來的好處

1. 安全性：只能在特定的範圍存取變數，像是無法在 global scope 取得在 local/block scope 宣告的變數
2. 減少命名衝突：可以在不同的 scope 使用一樣的變數名稱

## 額外補充：Lexical/Static vs Dynamic Scope

::: tip tl;dr
- 兩者不同處：
  - **lexical scope**：function 的**宣告位置**決定能取得哪些變數，也就代表注重撰寫程式碼的位置 (write-time)
  - **dynamic scope**：function **在哪被誰呼叫**決定能取得哪些變數，也就代表注重在調用時機 (runtime)
- JS 是 lexical scope language，所以才能有 `閉包 (closure)` 相關運用
:::

### 舉個例子

```jsx
function A() {
	console.log(name);
}

function B() {
	var name = 'Cynthia';
	A();
}

var name = 'Lulu';
B();
```

#### 如果 JS 是 lexical scope 語言
在 `A()` 中沒有找到任何變數 `name` ，經由上面提到的 scope chain 向外找到 `var name = 'Lulu';`，因此執行 `B()` 時會 console `'Lulu'`。

#### 如果 JS 是 dynamic scope 語言
Scope chain 則會是以 call stack 作為基礎，意指 `A()` 是在 `B()` 中被呼叫，所以當 `A()` 沒在他自己的 scope 找到 `name` ，就會往 `B()` 裡去找，在這就會 console 出 `'Cynthia'`。

由此可見，**JS 是 lexical scope 語言**。

::: warning JS 中有個奇行種：
`this` 是類似 dynamic scoping 的存在，因為在哪裡呼叫 function 會影響 this 的指向。
:::

補充：關於 `call stack` 可以參考此篇 - [JS 運行原理：JavaScript Engine](/posts/browser/js-engine.html#call-stack)

### 語言舉例

- Lexical Scoping：`javaScript`,
- Dynamic Scoping：`bash`, `dash`, `powershell`
- 自由選擇：`perl`, `common lisp`

## 參考文章

1. [What is the difference between lexical scoping and dynamic scoping?](https://github.com/30-seconds/30-seconds-of-interviews/blob/master/questions/lexical-vs-dynamic-scoping.md)
2. [[筆記] JavaScript中Scope Chain和outer environment的概念](https://pjchender.blogspot.com/2015/12/javascriptscope-chainouter-environment.html)


<CustomVssue :title="$page.title" />