import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import BasicCalculator from './calculators/BasicCalculator';
import ScientificCalculator from './calculators/ScientificCalculator';
import FinancialCalculator from './calculators/FinancialCalculator';
import CurrencyConverter from './calculators/CurrencyConverter';
import PrintingCalculator from './calculators/PrintingCalculator';

const Calculator = () => {
  const [activeMode, setActiveMode] = useState('basic');

  return (
    <Layout activeMode={activeMode} setActiveMode={setActiveMode}>
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeMode === 'basic' && <BasicCalculator />}
          {activeMode === 'scientific' && <ScientificCalculator />}
          {activeMode === 'financial' && <FinancialCalculator />}
          {activeMode === 'currency' && <CurrencyConverter />}
          {activeMode === 'printing' && <PrintingCalculator />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Calculator;