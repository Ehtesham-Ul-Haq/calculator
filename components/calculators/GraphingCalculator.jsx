import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import dynamic from 'next/dynamic';

import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaTrash, 
  FaChartLine, 
  FaCode
} from 'react-icons/fa';

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });


const GraphicsCalculator = () => {
  const [functions, setFunctions] = useState([]);
  const [currentFunction, setCurrentFunction] = useState('');
  const [plotData, setPlotData] = useState([]);
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [yRange, setYRange] = useState({ min: -10, max: 10 });
  const [error, setError] = useState('');

  const generateColor = (index) => {
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const addFunction = () => {
    try {
      if (!currentFunction) return;
      
      // Test the function with sample value
      evaluate(currentFunction, { x: 0 });
      
      const newFunction = {
        expression: currentFunction,
        color: generateColor(functions.length)
      };

      setFunctions([...functions, newFunction]);
      setCurrentFunction('');
      setError('');
    } catch (err) {
      setError('Invalid function expression');
      setTimeout(() => setError(''), 3000);
    }
  };

  const updatePlot = () => {
    const newData = functions.map((fn, index) => {
      const xValues = [];
      const yValues = [];
      
      for (let x = xRange.min; x <= xRange.max; x += 0.1) {
        try {
          const y = evaluate(fn.expression, { x });
          xValues.push(x);
          yValues.push(y);
        } catch (err) {
          // Skip invalid points
        }
      }

      return {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: { color: fn.color },
        name: `f${index + 1}(x) = ${fn.expression}`
      };
    });

    setPlotData(newData);
  };

  useEffect(() => {
    updatePlot();
  }, [functions, xRange, yRange]);

  const clearAll = () => {
    setFunctions([]);
    setPlotData([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen flex flex-col dark:bg-gray-900 mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
        {/* Control Panel */}
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="w-full md:w-96 bg-white dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-6 text-blue-400 dark:text-blue-300">
            <FaChartLine className="text-xl" />
            <h2 className="text-lg font-semibold">GRAPHING CALCULATOR</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Enter Function (use 'x' as variable)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentFunction}
                  onChange={(e) => setCurrentFunction(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., sin(x) + 2x"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addFunction}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
                >
                  <FaPlus />
                </motion.button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  X Min
                </label>
                <input
                  type="number"
                  value={xRange.min}
                  onChange={(e) => setXRange(prev => ({ ...prev, min: +e.target.value }))} 
                  className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-gray-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  X Max
                </label>
                <input
                  type="number"
                  value={xRange.max}
                  onChange={(e) => setXRange(prev => ({ ...prev, max: +e.target.value }))} 
                  className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Y Min
                </label>
                <input
                  type="number"
                  value={yRange.min}
                  onChange={(e) => setYRange(prev => ({ ...prev, min: +e.target.value }))} 
                  className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-gray-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Y Max
                </label>
                <input
                  type="number"
                  value={yRange.max}
                  onChange={(e) => setYRange(prev => ({ ...prev, max: +e.target.value }))} 
                  className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearAll}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center gap-2"
            >
              <FaTrash />
              Clear All Functions
            </motion.button>
          </div>
        </motion.div>

        {/* Graphing Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 max-h-80 bg-white dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <Plot
            data={plotData}
            layout={{
              title: 'Function Grapher',
              autosize: true,
              margin: { t: 40, b: 40, l: 60, r: 40 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(255,255,255,0.1)',
              xaxis: {
                range: [xRange.min, xRange.max],
                gridcolor: 'rgba(0,0,0,0.1)',
                title: 'X Axis'
              },
              yaxis: {
                range: [yRange.min, yRange.max],
                gridcolor: 'rgba(0,0,0,0.1)',
                title: 'Y Axis'
              },
              font: { color: '#4B5563' },
              showlegend: true,
              legend: {
                x: 1,
                xanchor: 'right',
                y: 1,
                bgcolor: 'rgba(255,255,255,0.8)'
              }
            }}
            config={{
              responsive: true,
              displaylogo: false,
              modeBarButtons: [
                ['zoom2d', 'pan2d'],
                ['resetScale2d'],
                ['toImage']
              ]
            }}
            className="w-full h-full rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Floating Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed left-12 bottom-16 md:left-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-2 rounded-lg shadow-lg text-xs text-gray-600 dark:text-gray-300"
      >
        <div className="flex items-center gap-2 mb-2">
          <FaCode className="text-blue-500" />
          <span>Supported Functions:</span>
        </div>
        <div className="grid grid-cols-6 gap-x-[22px] md:gap-2">
          <span>sin(x)</span>
          <span>cos(x)</span>
          <span>tan(x)</span>
          <span>log(x)</span>
          <span>sqrt(x)</span>
          <span>x^2</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GraphicsCalculator;
