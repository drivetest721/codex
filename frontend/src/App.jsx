import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="display-value">{display}</div>
      </div>
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <button className="calculator-key key-clear" onClick={clearAll}>AC</button>
            <button className="calculator-key key-clear" onClick={clearEntry}>CE</button>
            <button className="calculator-key key-operator" onClick={() => inputOperation('/')}>&divide;</button>
          </div>
          <div className="digit-keys">
            <button className="calculator-key key-0" onClick={() => inputNumber(0)}>0</button>
            <button className="calculator-key" onClick={() => inputNumber(1)}>1</button>
            <button className="calculator-key" onClick={() => inputNumber(2)}>2</button>
            <button className="calculator-key" onClick={() => inputNumber(3)}>3</button>
            <button className="calculator-key" onClick={() => inputNumber(4)}>4</button>
            <button className="calculator-key" onClick={() => inputNumber(5)}>5</button>
            <button className="calculator-key" onClick={() => inputNumber(6)}>6</button>
            <button className="calculator-key" onClick={() => inputNumber(7)}>7</button>
            <button className="calculator-key" onClick={() => inputNumber(8)}>8</button>
            <button className="calculator-key" onClick={() => inputNumber(9)}>9</button>
            <button className="calculator-key key-decimal" onClick={inputDecimal}>.</button>
          </div>
        </div>
        <div className="operator-keys">
          <button className="calculator-key key-operator" onClick={() => inputOperation('*')}>&times;</button>
          <button className="calculator-key key-operator" onClick={() => inputOperation('-')}>-</button>
          <button className="calculator-key key-operator" onClick={() => inputOperation('+')}>+</button>
          <button className="calculator-key key-equals" onClick={performCalculation}>=</button>
        </div>
      </div>
    </div>
  )
}

export default App
