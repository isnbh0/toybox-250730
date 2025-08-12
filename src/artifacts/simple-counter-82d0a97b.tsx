import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Counter App</h1>
        
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 mb-2">
            {count}
          </div>
          <div className="text-gray-500 text-sm">Current Count</div>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={decrement}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-xl"
          >
            −
          </button>
          
          <button
            onClick={increment}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-xl"
          >
            +
          </button>
        </div>

        <button
          onClick={reset}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Simple Counter App",
  description: "A clean and modern counter app with increment, decrement, and reset functionality",
  type: "react",
  tags: ["counter","react","utility","interactive"],
  
  createdAt: "2025-08-12T00:00:00.000Z",
  updatedAt: "2025-08-12T00:00:00.000Z",
} as const;
