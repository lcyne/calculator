let t0 = performance.now();

const expression = document.querySelector('#expression');
const result = document.querySelector('#result');
const buttons = document.querySelector('#buttons');

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const pow = (x, n) => x ** n;
const percent = (a, b) => b / 100 * a;

const operate = (operand1, operand2, operator) => {
  if (operator === '+') return add(operand1, operand2);
  else if (operator === '-') return subtract(operand1, operand2);
  else if (operator === '×') return multiply(operand1, operand2);
  else if (operator === '÷') return divide(operand1, operand2);
  else if (operator === '^') return pow(operand1, operand2);
  else if (operator === '%') return percent(operand1, operand2);
  else return 0;
};

const parseSimpleExpr = operation => {
  return [undefined, undefined, undefined];
};

const getPriorityOp = expr => {
  let hasParentheses = expr.indexOf(')') !== -1;
  let startIndex = 0;
  let endIndex = 0;

  if (hasParentheses) {
    endIndex = expr.indexOf(')') + 1;
    startIndex = expr.slice(0, endIndex).lastIndexOf('(');
  } else {
    let opIndex = 0;
    let leftOffset = 0;
    let rightOffset = 0;
    if (expr.indexOf('^') !== -1) {
      opIndex = expr.indexOf('^');
    } else if (expr.indexOf('×') !== -1) {
      opIndex = expr.indexOf('×');
    } else if (expr.indexOf('÷') !== -1) {
      opIndex = expr.indexOf('÷');
    } else if (expr.indexOf('+') !== -1) {
      opIndex = expr.indexOf('+');
    } else if (expr.indexOf('-') !== -1) {
      opIndex = expr.indexOf('-');
    }

    leftOffset = expr.slice(0, opIndex)
                     .split().reverse().join()
                     .search(/[^0-9]/);
    if (leftOffset < 0) leftOffset = expr.slice(0, opIndex).length;
    startIndex = opIndex - leftOffset;

    rightOffset = expr.slice(opIndex + 1).search(/[^0-9]/);
    if (rightOffset < 0) rightOffset = expr.length - 1;
    endIndex = opIndex + rightOffset;
  }
  
  return expr.slice(startIndex, endIndex);
};

const calculateExpression = expr => {
  while(Number.isNaN(+expr)) {
    let priorityOp = getPriorityOp(expr);
    expr = expr.replace(priorityOp, operate(...parseSimpleExpr(priorityOp)));
  }
  return +expr;
};

const hasGoodParentheses = expr => {
  return expr.split('').reduce((parentheseBalance, char) => {
    if (char === '(') {
      ++parentheseBalance;
    } else if (char === ')') {
      --parentheseBalance;
    }
    if (parentheseBalance < 0) {
      parentheseBalance += Infinity;
    }
    return parentheseBalance;
  }, 0) === 0;
}

const updateExpr = (expr, button) => {
  if (button.id === 'clear') {
    expr.textContent = '.';
    result.textContent = 0;
  } else if (button.id === 'backspace') {
    expr.textContent = expr.textContent.slice(0, -1);
    if (expr.textContent === '') {
      expr.textContent = '.';
    }
  } else if (button.id === 'equals') {
    if (!hasGoodParentheses(expr.textContent)) {
      result.textContent = 'Error (parentheses)';
    } else {
      result.textContent = calculateExpression(expr.textContent);
    }
    expr.textContent = '.';
  } else {
    if (expr.textContent === '.') {
      expr.textContent = '';
    }
    expr.textContent += button.textContent;
    if (button.id === 'sqrt') {
      expr.textContent += '(';
    }
  }
}

buttons.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'button') {
    updateExpr(expression, e.target);
  }
});

console.log(`main.js ready in ${performance.now() - t0} ms.`);