# 實作簡易計算機

1. 長度不能大於 0
2. 按數字時候輸出至 output
3. 當點擊 click 時， output 會先為 0，此時 Click 以及其他運算符 ( +-\*/ )都會不有動作，
   直到點擊 等於 或是 reset 才會計算或重置。
   - 計算後，點擊等於 會重複上一步計算
   - 點擊 del 再點擊等於，會是以 del 後的值去做上一步計算
   - 計算後，點擊數字，重置計算
   - 計算後，點擊運算符，使用計算完的繼續計算

## 實現邏輯概述

- 透過 陣列儲存使用者輸入的 文字字串 和 運算符 e.q: ["123","+","789"]、["123","+","789",'*']
- 透過各種邊界條件做篩選和處理
- 透過 將陣列合併成字串會形成 計算表達式
- 最終透過 new Function 計算

## 各方法概述:

**render().outputText()**

- 渲染 output 顯示，我用 viewNumber 變數傳遞渲染。

**userInput().number()** : 使用者點擊數字

- 重置 ishandleOperator ，表示使用者不是連續點擊運算符
- 當使用者點擊過等於後再點擊數字，會重置計算
- 判斷 字數不能超過 0 且 開頭不為 0

**userInput().operator()** : 使用者點擊 +-\*/ 運算符

- 當使用者點擊過 等於 後再點擊運算符，會繼續計算( 只需再輸入數字後點擊等於 )
- 重複點擊運算符只更新最後
- 會將運算符以及輸入的數字字串 放入到 calStore 陣列
- 重製 顯示 以及 計算變數

**userInput().equal()** : 使用者點擊 等於

- 如果沒有任何輸入，返回
- 第一次按等號 以及 連續 2 次等號以上 ，主要是做重複計算操作
- 將陣列 合併成 計算表達式

**userInput().reset()** : 使用者點擊 Reset

- 重製所有設定

**userInput().del()**: 使用者點擊 del

- 輸入的數字會往後退一位

userInput().opverFlow(): 使用者點擊 輸入數字大於 0 或是 計算時除數用 0 計算

- 更改布林狀態

**calculator().result()**:計算用

- 將 計算表達式 透過 new Function 來計算，最後再轉成字串

## 已處理邊界條件

- 限制數字長度
- 除數不能為 0
- 運算符不能連續輸入
- 計算後可繼續操作

## Demo

**Demo 連結** : [連結](https://absinthesung.github.io/Calculator/)
