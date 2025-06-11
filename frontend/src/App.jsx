import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState('')

  // Format number with commas for better readability
  const formatNumber = (num) => {
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      const newDisplay = display === '0' ? String(num) : display.replace(/,/g, '') + num
      setDisplay(formatNumber(newDisplay))
    }
  }

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display.replace(/,/g, ''))

    if (previousValue === null) {
      setPreviousValue(inputValue)
      setHistory(`${formatNumber(inputValue)} ${getOperatorSymbol(nextOperation)}`)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(formatNumber(String(newValue)))
      setPreviousValue(newValue)
      setHistory(`${formatNumber(newValue)} ${getOperatorSymbol(nextOperation)}`)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const getOperatorSymbol = (op) => {
    switch (op) {
      case '+': return '+'
      case '-': return '−'
      case '*': return '×'
      case '/': return '÷'
      default: return op
    }
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
    const inputValue = parseFloat(display.replace(/,/g, ''))

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(formatNumber(String(newValue)))
      setHistory(`${history} ${formatNumber(inputValue)} =`)
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
    setHistory('')
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const backspace = () => {
    if (display.length > 1 && display !== '0') {
      const newDisplay = display.slice(0, -1).replace(/,/g, '')
      setDisplay(formatNumber(newDisplay) || '0')
    } else {
      setDisplay('0')
    }
  }

  const inputPercentage = () => {
    const value = parseFloat(display.replace(/,/g, ''))
    const newValue = value / 100
    setDisplay(formatNumber(String(newValue)))
  }

  // Keyboard support
  const handleKeyPress = useCallback((event) => {
    const { key } = event

    if (key >= '0' && key <= '9') {
      inputNumber(parseInt(key))
    } else if (key === '.') {
      inputDecimal()
    } else if (key === '+') {
      inputOperation('+')
    } else if (key === '-') {
      inputOperation('-')
    } else if (key === '*') {
      inputOperation('*')
    } else if (key === '/') {
      event.preventDefault()
      inputOperation('/')
    } else if (key === 'Enter' || key === '=') {
      performCalculation()
    } else if (key === 'Escape') {
      clearAll()
    } else if (key === 'Backspace') {
      backspace()
    } else if (key === '%') {
      inputPercentage()
    }
  }, [display, previousValue, operation, waitingForOperand])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

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
        <div className="display-operation">{history}</div>
        <div className="display-value">{display}</div>
      </div>
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <button className="calculator-key key-clear" onClick={clearAll} title="Clear All (Esc)">AC</button>
            <button className="calculator-key key-clear" onClick={inputPercentage} title="Percentage (%)">%</button>
            <button className="calculator-key key-clear" onClick={backspace} title="Backspace">⌫</button>
            <button className="calculator-key key-operator" onClick={() => inputOperation('/')} title="Divide (/)">÷</button>
          </div>
          <div className="digit-keys">
            <button className="calculator-key" onClick={() => inputNumber(7)} title="7">7</button>
            <button className="calculator-key" onClick={() => inputNumber(8)} title="8">8</button>
            <button className="calculator-key" onClick={() => inputNumber(9)} title="9">9</button>
            <button className="calculator-key" onClick={() => inputNumber(4)} title="4">4</button>
            <button className="calculator-key" onClick={() => inputNumber(5)} title="5">5</button>
            <button className="calculator-key" onClick={() => inputNumber(6)} title="6">6</button>
            <button className="calculator-key" onClick={() => inputNumber(1)} title="1">1</button>
            <button className="calculator-key" onClick={() => inputNumber(2)} title="2">2</button>
            <button className="calculator-key" onClick={() => inputNumber(3)} title="3">3</button>
            <button className="calculator-key key-0" onClick={() => inputNumber(0)} title="0">0</button>
            <button className="calculator-key key-decimal" onClick={inputDecimal} title="Decimal (.)">.</button>
          </div>
        </div>
        <div className="operator-keys">
          <button className="calculator-key key-operator" onClick={() => inputOperation('*')} title="Multiply (*)">×</button>
          <button className="calculator-key key-operator" onClick={() => inputOperation('-')} title="Subtract (-)">−</button>
          <button className="calculator-key key-operator" onClick={() => inputOperation('+')} title="Add (+)">+</button>
          <button className="calculator-key key-equals" onClick={performCalculation} title="Equals (Enter)">=</button>
        </div>
      </div>
    </div>
  )
}

export default App
