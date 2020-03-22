
const mathSplit = (expr, operator) => {
  const arr = []
  let from = 0, depth = 0
  for (let i=0; i<expr.length; ++i) {
    if (expr[i] == '(') ++depth
    else if (expr[i] == ')') {
      --depth
      if (depth < 0) throw new Error("ExpressionError: Brackets must be paired")
    }
    else if (expr[i] == operator && !depth) {
      arr.push(expr.slice(from, i))
      from = i+1
    }
  }
  if (depth) throw new Error("ExpressionError: Brackets must be paired")
  arr.push(expr.slice(from))
  return arr
}

const parseParentheses = expr => {
  const match = expr.match(/^\((.*)\)$/)
  if (!match) return expr
  let depth = 0
  for (let i=0; i<expr.length; ++i) {
    if (expr[i] == '(') ++depth
    else if (expr[i] == ')') {
      --depth
      if (!depth && i!=expr.length-1) return expr
    }
  }
  return parsePlus(match[1])
}

const parsePlus = expr => typeof expr == 'number'? expr :
  mathSplit(expr, '+').map(parseParentheses).map(parseMinus)
    .reduce((result, operand) => +result + +operand)

const parseMinus = expr => typeof expr == 'number'? expr :
  mathSplit(expr, '–').map(parseParentheses)
    .map(parseMultiply).reduce((result, operand) => result - operand)

const parseMultiply = expr => typeof expr == 'number'? expr :
  mathSplit(expr, '*').map(parseParentheses)
    .map(parseDivide).reduce((result, operand) => result * operand)

const parseDivide = expr => typeof expr == 'number'? expr :
  mathSplit(expr, '/').map(parseParentheses)
    .reduce((result, operand) => {
      if (!+operand) throw new Error("TypeError: Division by zero.")
      return result / operand
    })


function expressionCalculator(expr) {
  expr = expr.replace(/\s*/g, "").replace(/-/g, '–')
  return parsePlus(expr)
}

module.exports = {
  expressionCalculator
}
