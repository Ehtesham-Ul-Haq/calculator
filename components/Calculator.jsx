import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Layout from "./Layout";
import BasicCalculator from "./calculators/BasicCalculator";
import ScientificCalculator from "./calculators/ScientificCalculator";
import FinancialCalculator from "./calculators/FinancialCalculator";
import CurrencyConverter from "./calculators/CurrencyConverter";
import PrintingCalculator from "./calculators/PrintingCalculator";
import GraphingCalculator from "./calculators/GraphingCalculator";
import { metaData } from "./metaData";

const Calculator = () => {
  const [activeMode, setActiveMode] = useState("basic");

  const currentMeta = metaData[activeMode];

  return (
    <>
      <Head>
        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.description} />
      </Head>

      <Layout activeMode={activeMode} setActiveMode={setActiveMode}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeMode === "basic" && <BasicCalculator />}
            {activeMode === "scientific" && <ScientificCalculator />}
            {activeMode === "financial" && <FinancialCalculator />}
            {activeMode === "currency" && <CurrencyConverter />}
            {activeMode === "printing" && <PrintingCalculator />}
            {activeMode === "graphing" && <GraphingCalculator />}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </>
  );
};

export default Calculator;
