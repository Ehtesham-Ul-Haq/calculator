import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaExchangeAlt, FaArrowDown, FaCheck } from 'react-icons/fa';

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
    .then(res => setRates(res.data.rates));
    
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  
  const convert = () => {
    const rate = rates[toCurrency] / rates[fromCurrency];
    setConverted((amount * rate).toFixed(2));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const CurrencyDropdown = ({ selected, onSelect, position }) => (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setDropdownOpen(position)}
        className="w-full flex items-center justify-between text-gray-700 bg-white/10 dark:bg-gray-900/50 rounded-lg px-4 py-3 dark:text-white"
      >
        <div className="flex items-center gap-2">
          <FaGlobe className="text-blue-400" />
          <span className="font-medium">{selected}</span>
        </div>
        <motion.div animate={{ rotate: dropdownOpen === position ? 180 : 0 }}>
          <FaArrowDown className="text-sm opacity-70" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {dropdownOpen === position && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="absolute z-[9999] w-full mt-2 text-gray-700 dark:text-white bg-white dark:bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-x-hidden overflow-y-scroll">
              {Object.keys(rates).map(currency => (
                <motion.div
                  key={currency}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelect(currency);
                    setDropdownOpen(null);
                  }}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                    currency === selected 
                      ? 'bg-blue-500/20' 
                      : 'hover:bg-white/10 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-gray-700 dark:text-white">{currency}</span>
                  {currency === selected && <FaCheck className="text-blue-400" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center gap-2 mb-6 text-blue-400 dark:text-blue-300">
        <FaGlobe className="text-xl" />
        <h2 className="text-lg font-semibold">CURRENCY CONVERTER</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Amount</label>
          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/10 dark:bg-gray-900/50 rounded-lg px-4 py-3 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </motion.div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">From</label>
          <CurrencyDropdown
            selected={fromCurrency}
            onSelect={setFromCurrency}
            position="from"
          />
        </div>

        <div className="flex justify-center pb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-gray-700 dark:text-white"
          >
            <FaExchangeAlt />
          </motion.button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">To</label>
          <CurrencyDropdown
            selected={toCurrency}
            onSelect={setToCurrency}
            position="to"
          />
        </div>

        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: converted !== null ? 1 : 0 }}
        >
          <div className="mt-6 p-4 bg-white/5 rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-400">
              {converted || '0.00'} {toCurrency}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              {amount} {fromCurrency} equals
            </div>
          </div>
        </motion.div>

         <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={convert}
          className="md:col-span-3 w-full mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-4 rounded-xl text-white font-semibold text-lg"
        >
          Convert Currency
        </motion.button> 
      </div>
    </motion.div>
  );
};

export default CurrencyConverter;