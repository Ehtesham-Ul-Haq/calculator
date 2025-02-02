import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBackspace, 
  FaDivide, 
  FaTimes, 
  FaPlus, 
  FaMinus,
  FaPercentage,
  FaEquals,
  FaCalculator
} from 'react-icons/fa';

const buttonAnimations = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BasicCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);


    // Keyboard input handling
    useEffect(() => {
      const handleKeyPress = (e) => {
        const { key } = e;
        
        // Prevent default behavior for calculator keys
        if (/[\d%\/*\-+=.\\]|Enter|Backspace|Escape/.test(key)) {
          e.preventDefault();
        }
  
        // Handle numbers
        if (/\d/.test(key)) {
          handleNumber(key);
        }
        
        // Handle operators
        switch(key) {
          case '+':
            handleOperator('+');
            break;
          case '-':
            handleOperator('-');
            break;
          case '*':
            handleOperator('*');
            break;
          case '/':
            handleOperator('/');
            break;
          case '%':
            handlePercentage();
            break;
          case '.':
            handleDecimal();
            break;
          case '=':
          case 'Enter':
            calculate();
            break;
          case 'Backspace':
            handleBackspace();
            break;
          case 'Escape':
            clearDisplay();
            break;
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [display, equation, isNewNumber]); // Add necessary dependencies
  
    // Modify handleOperator to prevent multiple consecutive operators
    const handleOperator = (op) => {
      if (!isNewNumber) {
        setEquation(`${display} ${op} `);
        setIsNewNumber(true);
      } else {
        // Replace last operator if trying to input multiple operators
        setEquation(prev => prev.split(' ').slice(0, -2).join(' ') + ` ${op} `);
      }
    };
  
    // Update handleNumber to handle keyboard input properly
    const handleNumber = (num) => {
      if (display === 'Error') clearDisplay();
      
      if (isNewNumber) {
        setDisplay(num);
        setIsNewNumber(false);
      } else {
        setDisplay(prev => prev === '0' ? num : prev + num);
      }
    };
  
    // Add keyboard-specific backspace handling
    const handleBackspace = () => {
      if (display.length > 1) {
        setDisplay(prev => prev.slice(0, -1));
      } else {
        setDisplay('0');
        setIsNewNumber(true);
      }
    };

   

  

  const calculate = () => {
    try {
      const result = eval(`${equation} ${display}`);
      setDisplay(result.toString());
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

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
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

  return (
    <div className="max-w-md w-full mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 text-blue-400 dark:text-blue-300">
          <FaCalculator className="text-xl" />
          <span className="text-lg font-semibold">BASIC CALCULATOR</span>
        </div>

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

      {/* Update buttons to show keyboard shortcuts */}

      <div className="grid grid-cols-4 gap-3">
        {/* Memory Row */}
        <Button onClick={memoryClear} color="special">
          MC
        </Button>
        <Button onClick={memoryRecall} color="special">
          MR
        </Button>
        <Button onClick={memoryAdd} color="special">
          M+
        </Button>
        <Button onClick={clearDisplay} color="special">
          AC
        </Button>

        {/* Second Row */}
        <Button onClick={handleBackspace} color="special">
          <FaBackspace />
        </Button>
        <Button onClick={handlePercentage} color="special">
          <FaPercentage />
        </Button>
        <Button onClick={() => handleOperator('/')} color="operator">
          <FaDivide />
        </Button>
        <Button onClick={() => handleOperator('*')} color="operator">
          <FaTimes />
        </Button>

        {/* Numbers 7-9 */}
        <Button onClick={() => handleNumber('7')} data-key="7">7</Button>
        <Button onClick={() => handleNumber('8')} data-key="8">8</Button>
        <Button onClick={() => handleNumber('9')} data-key="9">9</Button>
        <Button onClick={() => handleOperator('-')} color="operator">
          <FaMinus />
        </Button>

        {/* Numbers 4-6 */}
        <Button onClick={() => handleNumber('4')} data-key="4">4</Button>
        <Button onClick={() => handleNumber('5')} data-key="5">5</Button>
        <Button onClick={() => handleNumber('6')} data-key="6">6</Button>
        <Button onClick={() => handleOperator('+')} color="operator">
          <FaPlus />
        </Button>

        {/* Numbers 1-3 */}
        <Button onClick={() => handleNumber('1')} data-key="1">1</Button>
        <Button onClick={() => handleNumber('2')} data-key="2">2</Button>
        <Button onClick={() => handleNumber('3')} data-key="3">3</Button>
        <Button onClick={calculate} color="equals" className="row-span-2">
          <FaEquals className="text-3xl" />
        </Button>

        {/* Bottom Row */}
        <Button onClick={() => handleNumber('0')} data-key="0">0</Button>
        <Button onClick={() => handleNumber('00')} data-key="00">00</Button>
        <Button onClick={handleDecimal}>.</Button>
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
    className={`${colors[color]} ${className} flex items-center justify-center rounded-xl p-4 text-2xl font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30`}
    {...props}
    role="button"
    tabIndex={0}
  >
    {children}
  </motion.button>
  );
};

export default BasicCalculator;