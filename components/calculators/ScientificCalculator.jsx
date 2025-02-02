import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBackspace,FaDivide, FaTimes, FaPlus, FaMinus, FaEquals, FaCalculator
} from 'react-icons/fa';

const buttonAnimations = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const scientificFunctions = [
    { label: 'sin', value: 'sin(', key: 's' },
    { label: 'cos', value: 'cos(', key: 'c' },
    { label: 'tan', value: 'tan(', key: 't' },
    { label: 'log', value: 'log(', key: 'l' },
    { label: 'ln', value: 'ln(', key: 'n' },
    { label: '√', value: 'sqrt(', key: 'r' },
    { label: 'x²', value: '^2', key: '²' },
    { label: 'x^y', value: '^', key: '^' },
    { label: 'π', value: 'π', key: 'p' },
    { label: 'e', value: 'e', key: 'e' },
    { label: '(', value: '(', key: '(' },
    { label: ')', value: ')', key: ')' },
    { label: '1/x', value: '^(-1)', key: '!' },
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      e.preventDefault();

      // Numbers and basic operators
      // Handle numbers and basic operators
      if (/[\d%\/*\-+=.^()]|Enter|Backspace|Escape/.test(key)) {
        switch(key) {
          case 'Enter': 
            calculate();
            break;
          case 'Backspace':
            handleBackspace();
            break;
          case 'Escape':
            clearAll();
            break;
          default:
            if (!e.shiftKey) {  // Prevent double input for shift combinations
              setInput(prev => prev + key);
            }
        }
      }

      // Handle scientific functions with lowercase keys
      const lowerKey = key.toLowerCase();
      scientificFunctions.forEach(func => {
        if (lowerKey === func.key) {
          setInput(prev => prev + func.value);
        }
      });

      // Handle special cases without duplication
      if (lowerKey === 'p' && !input.endsWith('π')) {
        setInput(prev => prev + 'π');
      }
      if (lowerKey === 'e' && !input.endsWith('e')) {
        setInput(prev => prev + 'e');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [input]);

  const calculate = () => {
    try {
      if (!input) return;
      
      const expression = input
        .replace(/π/g, 'pi')
        .replace(/(\d)(\(|pi|e)/g, '$1*$2')
        .replace(/(\))(\d)/g, '$1*$2');

      const calculation = evaluate(expression);
      setResult(calculation.toString());
      setHistory(prev => [...prev, { input, result: calculation }]);
      setInput(calculation.toString());
    } catch (error) {
      setResult('Error');
      setTimeout(() => {
        setResult('');
        setInput('');
      }, 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setResult('');
  };

   // Fixed backspace handling
   const handleBackspace = () => {
    setInput(prev => {
      if (prev.length === 0) return '';
      // Handle special cases for multi-character elements
      if (prev.endsWith('π')) return prev.slice(0, -1);
      if (prev.endsWith('sin(') || prev.endsWith('cos(') || prev.endsWith('tan(')) {
        return prev.slice(0, -4);
      }
      return prev.slice(0, -1);
    });
  };

  const handleFunction = (value) => {
    setInput(prev => prev + value);
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center gap-2 mb-4 text-blue-400 dark:text-blue-300">
        <FaCalculator className="text-xl" />
        <span className="text-lg font-semibold">SCIENTIFIC CALCULATOR</span>
      </div>

      <div className="mb-6">
        <AnimatePresence mode='wait'>
          <motion.div
            key={input}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-500 dark:text-gray-400 text-right text-xl h-8 mb-2 truncate"
          >
            {input || '0'}
          </motion.div>
        </AnimatePresence>
        
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-5xl font-light text-right truncate dark:text-white"
        >
          {result || '0'}
        </motion.div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Scientific Functions */}
        {scientificFunctions.map((func) => (
          <Button
            key={func.label}
            onClick={() => handleFunction(func.value)}
            color="function"
            className="text-lg p-2"
          >
            {func.icon || func.label}
            <span className="text-xs ml-1 opacity-70">{func.key}</span>
          </Button>
        ))}

        {/* Standard Calculator Controls */}
        <div className="col-span-7 grid grid-cols-4 gap-2 mt-4">
          <Button onClick={clearAll} color="special" className="col-span-2">
            AC <span className="text-xs">&nbsp;(Esc)</span>
          </Button>
          <Button onClick={handleBackspace} color="special">
            <FaBackspace />
          </Button>
          <Button onClick={() => handleFunction('/')} color="operator">
            <FaDivide />
          </Button>

          {[7, 8, 9].map(num => (
            <Button key={num} onClick={() => handleFunction(num.toString())}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleFunction('*')} color="operator">
            <FaTimes />
          </Button>

          {[4, 5, 6].map(num => (
            <Button key={num} onClick={() => handleFunction(num.toString())}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleFunction('-')} color="operator">
            <FaMinus />
          </Button>

          {[1, 2, 3].map(num => (
            <Button key={num} onClick={() => handleFunction(num.toString())}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleFunction('+')} color="operator">
            <FaPlus />
          </Button>

          <Button onClick={() => handleFunction('0')}>
            0
          </Button>
          <Button onClick={() => handleFunction('00')}>
            00
          </Button>
          <Button onClick={() => handleFunction('.')}>.</Button>
          <Button onClick={calculate} color="equals">
            <FaEquals /> <span className="text-xs"></span>
          </Button>
        </div>
      </div>

      {/* Calculation History */}
      <div className="mt-6 p-3 bg-white/5 rounded-lg max-h-32 overflow-y-auto">
        <div className="text-sm text-gray-400 mb-2">History</div>
        {history.reverse().map((item, index) => (
          <div key={index} className="text-xs text-gray-300 truncate">
            {item.input} = {item.result}
          </div>
        ))}
      </div>
    </div>
  );
};

const Button = ({ children, onClick, color = 'number', className = '', ...props }) => {
  const colors = {
    number: 'bg-white/10 hover:bg-gray-100/90 text-gray-800 dark:text-white border border-1 border-gray-300',
    operator: 'bg-amber-400/90 hover:bg-amber-400 text-gray-800',
    function: 'bg-purple-400/90 hover:bg-purple-400 text-white',
    special: 'bg-blue-400/90 hover:bg-blue-400 text-white',
    equals: 'bg-green-600/90 hover:bg-green-600 text-white',
  };

  return (
    <motion.button
      {...buttonAnimations}
      onClick={onClick}
      className={`${colors[color]} ${className} flex items-center justify-center rounded-lg p-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ScientificCalculator;