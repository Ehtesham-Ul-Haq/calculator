import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaChartLine, FaCalculator } from 'react-icons/fa';

const buttonAnimations = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const FinancialCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [futureValue, setFutureValue] = useState(null);

  const calculateFV = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const fv = p * Math.pow(1 + r, t);
    setFutureValue(fv.toFixed(2));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center gap-2 mb-4 text-blue-400 dark:text-blue-300">
          <FaDollarSign className="text-xl" />
          <span className="text-lg font-semibold">FINANCIAL CALCULATOR</span>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="Principal Amount"
            icon={<FaDollarSign />}
            value={principal}
            onChange={setPrincipal}
          />
          <InputField
            label="Annual Rate (%)"
            icon={<FaChartLine />}
            value={rate}
            onChange={setRate}
          />
          <InputField
            label="Years"
            icon={<FaCalculator />}
            value={time}
            onChange={setTime}
          />
          <Button onClick={calculateFV} color='primary'>
            Calculate
          </Button>
        </div>
        <div className="text-3xl text-center p-6 bg-white/5 rounded-xl dark:text-white flex items-center justify-center">
          <span>{futureValue ? <FaDollarSign /> : ''}</span>
          <span>{futureValue ? `${futureValue}` : 'Enter values to get future value.'}</span>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <motion.label  {...buttonAnimations} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
        {icon} {label}
      </motion.label>
      <motion.input
      {...buttonAnimations}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};


const Button = ({ children, onClick, color, ...props }) => {
  const colors = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400",
  };

  return (
    <motion.button
      {...buttonAnimations}
      onClick={onClick}
      className={`${colors[color]} rounded-full px-4 py-1 font-semibold tracking-widest shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2`}
      {...props}
    >
      {children}
    </motion.button>
  );
};


export default FinancialCalculator;


