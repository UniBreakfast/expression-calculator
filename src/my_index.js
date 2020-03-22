const numReg = "(-?[\\d.]+(e(\\+|-)\\d+)?)",
      opsRegs = ["([/*])", "([+-])"],

      doubleOpsFix = expr => expr
        .replace(/(\d)(--)(\d)/g, "$1+$3").replace(/(\d)(-)(\d)/g, "$1+-$3"),

      ops = {
        "+": (a, b) => Number(a) + Number(b),
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => {
          if (!Number(b)) throw new Error("TypeError: Division by zero.")
          return a / b
        }
      }

exports.expressionCalculator = expr => {
  expr = expr.replace(/\s*/g, "")
  const parenthesis = expr.match(/\(|\)/g)
  if (parenthesis) {
    let count = 0
    for (const char of parenthesis) {
      if (char === "(") count++
      else count--
      if (count<0) throw new Error("ExpressionError: Brackets must be paired")
    }
    if (count>0) throw new Error("ExpressionError: Brackets must be paired")
    while (true) {
      const subExpr = expr.match(/\([^()]+\)/)
      if (!subExpr) break
      expr = expr.replace(subExpr[0], calc(subExpr[0].slice(1, -1)))
    }
  }
  return calc(expr)
}

function calc(expr) {
  for (const opsReg of opsRegs) {
    while (true) {
      expr = doubleOpsFix(expr)
      const nextToCalc = expr.match(new RegExp(numReg + opsReg + numReg))
      if (!nextToCalc) break
      const [subExpr, left, , , op, right] = nextToCalc
      expr = expr.replace(subExpr, ops[op](left, right))
    }
  }
  return +expr
}
