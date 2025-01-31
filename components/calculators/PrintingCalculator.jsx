import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPrint, 
  FaBackspace, 
  FaPlus, 
  FaMinus, 
  FaTimes, 
  FaDivide, 
  FaEquals,
  FaHistory,
  FaMemory
} from 'react-icons/fa';
import { FiPrinter } from 'react-icons/fi';

const buttonAnimations = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const PrintingCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [log, setLog] = useState([]);
  const [memory, setMemory] = useState(0);
  const logEndRef = useRef(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [log]);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(`${display} ${op} `);
    setIsNewNumber(true);
    setLog(prev => [...prev, `${display} ${op}`]);
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setLog(prev => [...prev, `${equation}${display} = ${result}`]);
      setEquation('');
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setIsNewNumber(false);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const memoryAdd = () => {
    setMemory(m => m + parseFloat(display));
    setIsNewNumber(true);
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setIsNewNumber(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const printLog = () => {
    const printContent = `
      <div class="print-container">
        <h1 class="print-title">Calculator History</h1>
        <div class="print-log">
          ${log.map(entry => `<div class="print-entry">${entry}</div>`).join('')}
        </div>
        <div class="print-footer">
          Printed at: ${new Date().toLocaleString()}
        </div>
      </div>
      <style>
        body { margin: 1cm; font-family: monospace; }
        .print-container { max-width: 100%; }
        .print-title { 
          font-size: 1.5em; 
          margin-bottom: 1em;
          border-bottom: 2px solid #000;
          padding-bottom: 0.5em;
        }
        .print-entry {
          font-size: 1.1em;
          padding: 0.2em 0;
          border-bottom: 1px solid #eee;
        }
        .print-footer {
          margin-top: 2em;
          font-size: 0.8em;
          color: #666;
        }
        @media print {
          body { margin: 1cm; }
        }
      </style>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const { key } = e;
      if (/\d/.test(key)) handleNumber(key);
      if (key === '.') handleDecimal();
      if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
      if (key === 'Enter') calculate();
      if (key === 'Backspace') handleBackspace();
      if (key === 'Escape') clearDisplay();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, equation, isNewNumber]);

  return (
    <div className="max-w-4xl mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center gap-2 mb-6 text-blue-400 dark:text-blue-300">
        <FiPrinter className="text-xl" />
        <span className="text-lg font-semibold">PRINTING CALCULATOR</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <AnimatePresence mode='wait'>
              <motion.div
                key={equation}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.7, x: 0 }}
                className="text-gray-500 dark:text-gray-400 text-right text-xl h-8"
              >
                {equation}
              </motion.div>
            </AnimatePresence>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl font-light text-right truncate dark:text-white"
            >
              {display}
            </motion.div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {/* Memory Row */}
            <Button onClick={memoryClear} color="special">
              <FaMemory /> MC
            </Button>
            <Button onClick={memoryRecall} color="special">
              <FaMemory /> MR
            </Button>
            <Button onClick={memoryAdd} color="special">
              <FaMemory /> M+
            </Button>
            <Button onClick={clearDisplay} color="special">
              AC
            </Button>

            {/* Numbers and Operators */}
            <Button onClick={() => handleNumber('7')}>7</Button>
            <Button onClick={() => handleNumber('8')}>8</Button>
            <Button onClick={() => handleNumber('9')}>9</Button>
            <Button onClick={() => handleOperator('/')} color="operator">
              <FaDivide />
            </Button>

            <Button onClick={() => handleNumber('4')}>4</Button>
            <Button onClick={() => handleNumber('5')}>5</Button>
            <Button onClick={() => handleNumber('6')}>6</Button>
            <Button onClick={() => handleOperator('*')} color="operator">
              <FaTimes />
            </Button>

            <Button onClick={() => handleNumber('1')}>1</Button>
            <Button onClick={() => handleNumber('2')}>2</Button>
            <Button onClick={() => handleNumber('3')}>3</Button>
            <Button onClick={() => handleOperator('-')} color="operator">
              <FaMinus />
            </Button>

            <Button onClick={() => handleNumber('0')}>
              0
            </Button>
            <Button onClick={() => handleNumber('00')}>
              00
            </Button>
            <Button onClick={handleDecimal}>.</Button>
            <Button onClick={() => handleOperator('+')} color="operator">
              <FaPlus />
            </Button>

            <Button onClick={handleBackspace} color="special">
              <FaBackspace />
            </Button>
            <Button onClick={calculate} color="equals" className="col-span-3">
              <FaEquals />
            </Button>
          </div>
        </div>

        {/* Paper Tape */}
        <div className="w-full md:w-64 bg-white/5 dark:bg-gray-900/20 rounded-xl p-4 border border-white/10 dark:border-gray-700/30">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-blue-400 dark:text-blue-300">
              <FaHistory className="text-sm" />
              <span className="text-sm font-semibold">PAPER TAPE</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={printLog}
              className="text-blue-400 dark:text-blue-300 hover:text-blue-500"
            >
              <FaPrint />
            </motion.button>
          </div>
          <div className="h-20 md:h-96 overflow-y-auto thin-scrollbar space-y-2">
            {log.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-mono text-gray-700 dark:text-gray-300"
              >
                {entry}
              </motion.div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, onClick, color = 'number', className = '', ...props }) => {
  const colors = {
    number: 'bg-white/10 hover:bg-gray-100/90 text-gray-800 dark:text-white border border-1 border-gray-300',
    operator: 'bg-amber-400/90 hover:bg-amber-400 text-gray-800',
    special: 'bg-blue-400/90 hover:bg-blue-400 text-white',
    equals: 'bg-green-600/90 hover:bg-green-600 text-white',
  };

  return (
    <motion.button
      {...buttonAnimations}
      onClick={onClick}
      className={`${colors[color]} ${className} flex items-center justify-center rounded-xl p-4 text-2xl font-medium transition-colors duration-150`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PrintingCalculator;