import { useState } from 'react';
import Plot from 'react-plotly.js';
import { evaluate } from 'mathjs';

const GraphingCalculator = () => {
  const [functionInput, setFunctionInput] = useState('sin(x)');
  const [plotData, setPlotData] = useState([]);

  const generatePlot = () => {
    try {
      const xValues = Array.from({ length: 100 }, (_, i) => i/10 - 5);
      const yValues = xValues.map(x => evaluate(functionInput, { x }));
      
      setPlotData([{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#3B82F6' }
      }]);
    } catch (error) {
      console.error('Invalid function');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={functionInput}
          onChange={(e) => setFunctionInput(e.target.value)}
          className="flex-1 bg-white/10 dark:bg-gray-900/50 rounded-lg px-4 py-2 text-white"
          placeholder="Enter function (e.g., sin(x))"
        />
        <button
          onClick={generatePlot}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white"
        >
          Plot
        </button>
      </div>
      <Plot
        data={plotData}
        layout={{
          width: 800,
          height: 500,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(255,255,255,0.1)',
          font: { color: '#fff' },
          xaxis: { gridcolor: 'rgba(255,255,255,0.1)' },
          yaxis: { gridcolor: 'rgba(255,255,255,0.1)' }
        }}
      />
    </div>
  );
};

export default GraphingCalculator;