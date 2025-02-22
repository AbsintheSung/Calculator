const numberData = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
const operatorData = ["/", "*", "-", "+"];
const actionData = ["Reset", "Del"];
const numberBtns = Array.from(document.querySelectorAll(".number"));
const operatorBtns = Array.from(document.querySelectorAll(".operator"));
const actionBtns = Array.from(document.querySelectorAll(".action button"));
const equalBtn = document.querySelector(".equal");
const outputText = document.querySelector(".output-text");
const operatorView = document.querySelector(".operator-view");

// 顯示相關變數
let viewNumber = "0"; // 當前顯示的數字
let viewOperator = ""; // 當前顯示的運算符號

// 計算相關變數
let calCurrentNumber = "0"; //  當前輸入的數字 ，用於邏輯操作
let calLastExpression = ""; // 存儲上一次的運算表達式
let calExpression = ""; // 目前完整的計算表達式
let calLastOperator = ""; // 上一個運算符號
let calLastNumber = ""; // 上一個數字
let calHasResult = false; // 是否已經計算過
let calStore = []; // 儲存計算後的 字串數字 和 字串運算符
let ishandleOperator = false; //使否按過 運算符( 控制使用者點擊連續運算符 )
let ishandleEqual = false; // 當前計算使用者已經點過等於 1次了
let isOverflow = false; //超出範圍或是有人除以0時，用此布林控制做 reset

//處理畫面
const render = function () {
  return {
    outputText: (value) => {
      outputText.innerText = value;
    },
    operatorView: (value) => {
      operatorView.innerText = value;
    }
  };
};
//使用者操作後 進行 資料判斷處理
const userInput = function () {
  return {
    number: (num) => {
      ishandleOperator = false;
      if (ishandleEqual) {
        userInput().reset();
      }
      if (calCurrentNumber === "-0") {
        calCurrentNumber = "0";
      }
      // 限制最大長度為 10
      if (calCurrentNumber.length >= 10) return;

      calCurrentNumber += num;

      // 正則移除開頭多餘的 0（但允許單獨 "0"）
      calCurrentNumber = calCurrentNumber.replace(/^(-?)0+(?=\d)/, "$1");

      viewNumber = calCurrentNumber;
    },
    operator: (arithmetic) => {
      viewOperator = arithmetic
      if (ishandleEqual) {
        calStore = [calCurrentNumber];
        calStore.push(arithmetic);
        calCurrentNumber = "0";
        viewNumber = calCurrentNumber;
        ishandleEqual = false;
        return;
      }
      if (ishandleOperator) {
        // 只更新最後一個運算符號
        calStore[calStore.length - 1] = arithmetic;
      } else {
        // 存入數字 & 運算符號
        calStore.push(calCurrentNumber);
        calStore.push(arithmetic);
        ishandleOperator = true;
      }
      calCurrentNumber = "0";
      viewNumber = calCurrentNumber;
      console.log("operator", calStore);
    },
    equal: () => {
      // 如果沒有任何輸入，直接返回
      if (calStore.length === 0 && calCurrentNumber === "0") return;

      // 第一次按等號
      if (!ishandleEqual) {
        // 如果不是在運算符後加入當前數字
        if (!ishandleOperator) {
          calStore.push(calCurrentNumber);
        }

        // 移除最後的運算符（如果有）
        if (operatorData.includes(calStore[calStore.length - 1])) {
          calStore.pop();
        }

        // 儲存這次的計算表達式，用於重複計算
        calLastExpression = [...calStore];
        ishandleEqual = true;
      }
      // 第二次以上按等號
      else {
        // 如果只有單一數字，不做任何處理
        if (calLastExpression.length === 1) {
          return;
        }

        // 取得上一次計算的最後運算符和數字
        const lastOperator = calLastExpression[calLastExpression.length - 2];
        const lastNumber = calLastExpression[calLastExpression.length - 1];

        // 建立新的計算表達式
        calStore = [...calStore, lastOperator, lastNumber];
      }

      // 4. 建立最終的計算表達式
      calExpression = calStore.join("");
      console.log("equal", calStore);
      console.log("calExpression", calExpression);
    },
    reset: () => {
      // 重置所有計算相關變數
      viewNumber = "0";
      calCurrentNumber = "0";
      calLastExpression = "";
      calExpression = "";
      calLastOperator = "";
      calLastNumber = "";
      calHasResult = false;
      calStore = [];
      ishandleOperator = false;
      ishandleEqual = false;
    },
    del: () => {
      // 如果當前數字長度為1，或是"0"，則設為"0"
      if (calCurrentNumber.length === 1 || calCurrentNumber === "0") {
        calCurrentNumber = "0";
        viewNumber = calCurrentNumber;
      } else {
        // 移除最後一個字符
        calCurrentNumber = calCurrentNumber.slice(0, -1);
        viewNumber = calCurrentNumber;
      }

      // 如果是計算後的狀態，更新相關變數
      if (ishandleEqual) {
        // 保持 calLastExpression 不變，這樣可以繼續使用上一次的運算
        calStore = [calCurrentNumber]; // 只更新 calStore 為當前的數字
      }
    },
    overFlow: () => {
      if (isOverflow) {
        userInput().reset(); // 執行 reset
        isOverflow = false;
      }
    },
  };
};
//計算資料
const calculator = function () {
  return {
    result: (expression) => {
      // 檢查是否有除以 0 的情況
      if (/\/\s*0+(\D|$)/.test(expression)) {
        isOverflow = true;
        return "不能除以 0";
      }

      const temp = new Function(`return ${expression}`)().toString();
      if (temp.length > 10) {
        isOverflow = true;
        return "超出計算最大限制";
      } else {
        return temp;
      }
      // return new Function(`return ${expression}`)().toString();
      // calCurrentNumber = new Function(`return ${expression}`)().toString();
    },
  };
};

function handleNumberClick(e) {
  // console.log("Number:", e.target.innerText);
  userInput().overFlow();
  userInput().number(e.target.innerText);
  render().outputText(viewNumber);
}

function handleOperatorClick(e) {
  // console.log("Operator:", e.target.innerText);
  userInput().overFlow();
  userInput().operator(e.target.innerText);
  render().outputText(viewNumber);
  render().operatorView(viewOperator);
}

function handleActionClick(e) {
  // console.log("Action:", e.target.innerText);
  userInput().overFlow();
  const temp = e.target.innerText;
  if (temp === "Reset") {
    userInput().reset();
    render().operatorView(viewOperator);
  }
  if (temp === "Del") {
    userInput().del();
  }
  render().outputText(viewNumber);
}
function handleEqualClick() {
  userInput().overFlow();
  userInput().equal(); // 整理數據
  // 只有在有表達式時才進行計算
  if (calExpression) {
    calCurrentNumber = calculator().result(calExpression); // 計算
    viewNumber = calCurrentNumber; // 更新當前數字
    render().outputText(viewNumber); // 更新畫面
    render().operatorView('=');
  }

}

numberBtns.forEach((btn, index) => {
  btn.innerText = numberData[index];
  btn.addEventListener("click", handleNumberClick);
});

operatorBtns.forEach((btn, index) => {
  btn.innerText = operatorData[index];
  btn.addEventListener("click", handleOperatorClick);
});

actionBtns.forEach((btn, index) => {
  btn.innerText = actionData[index];
  btn.addEventListener("click", handleActionClick);
});
equalBtn.addEventListener("click", handleEqualClick);

//開始時，初始畫面
render().outputText(viewNumber);
render().operatorView(viewOperator);