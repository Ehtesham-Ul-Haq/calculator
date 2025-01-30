import { useState } from 'react';

const PrintingCalculator = () => {
  const [log, setLog] = useState([]);
  const [input, setInput] = useState('');

  const printToLog = (value) => {
    setLog([...log, value]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Basic calculator input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full mb-4 bg-white/10 dark:bg-gray-900/50 rounded-lg px-4 py-2 text-white"
          />
          {/* Calculator buttons */}
        </div>
        
        <div className="w-64 h-96 bg-white/5 p-4 rounded-xl overflow-y-auto">
          <div className="text-gray-400 mb-2">Print Log</div>
          {log.map((entry, index) => (
            <div key={index} className="text-sm text-gray-300 mb-1">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintingCalculator;