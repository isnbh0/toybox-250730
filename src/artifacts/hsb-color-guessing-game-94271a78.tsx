import React, { useState, useEffect, useRef } from 'react';

const HSBGuessingGame = () => {
  // Game state
  const [currentColor, setCurrentColor] = useState({ h: 0, s: 0, b: 0 });
  const [userGuess, setUserGuess] = useState({ h: 0, s: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState('guessing'); // 'guessing' or 'results'
  const [accuracy, setAccuracy] = useState(0);
  const [colorMode, setColorMode] = useState('normal'); // 'normal', 'red-blue', or 'green-blue'
  const [totalRounds] = useState(10);
  
  // Use refs to store persistent colors for each mode
  const modeColors = useRef({
    normal: null,
    'red-blue': null,
    'green-blue': null
  });
  
  // Helper functions for scoring logic from original app
  const toRadians = (angle) => {
    return angle * (Math.PI / 180);
  };
  
  const getSafeHue = (hue) => {
    return isNaN(hue) ? 0 : hue;
  };
  
  const calculateDistanceBetween = (color1, color2) => {
    const color1_h = getSafeHue(color1.h);
    const color1_s = color1.s / 100;
    const color1_b = color1.b / 100;
    
    const color2_h = getSafeHue(color2.h);
    const color2_s = color2.s / 100;
    const color2_b = color2.b / 100;
    
    const color1_x = color1_s * color1_b * Math.cos(toRadians(color1_h));
    const color1_y = color1_s * color1_b * Math.sin(toRadians(color1_h));
    const color1_z = color1_b;
    
    const color2_x = color2_s * color2_b * Math.cos(toRadians(color2_h));
    const color2_y = color2_s * color2_b * Math.sin(toRadians(color2_h));
    const color2_z = color2_b;
    
    const xError = Math.pow(color1_x - color2_x, 2);
    const yError = Math.pow(color1_y - color2_y, 2);
    const zError = Math.pow(color1_z - color2_z, 2);
    
    const distance = Math.sqrt(xError + yError + zError);
    
    return distance;
  };
  
  const calculateScoreFromDistance = (distance) => {
    const exactScore = (2 - distance) * 50;
    const roundedScore = Math.round(exactScore);
    return Math.max(0, roundedScore); // Ensure score is not negative
  };

  // Generate a color for a specific mode
  const generateRandomColorForMode = (mode) => {
    let hue;
    
    // Restrict hue range based on colorblind mode
    switch (mode) {
      case 'red-blue':
        // Generate hue between 240-360 (blue-purple-red range)
        hue = Math.floor(Math.random() * 121) + 240; // 240-360
        if (hue > 359) hue = 0; // Handle the edge case of 360 -> 0
        break;
      case 'green-blue':
        // Generate hue between 120-240 (green-blue range)
        hue = Math.floor(Math.random() * 121) + 120; // 120-240
        break;
      default:
        // Normal mode - full range
        hue = Math.floor(Math.random() * 360); // 0-359
    }
    
    // Match original app's saturation and brightness (value) random generation
    const s = Math.floor(Math.random() * 100); // 0-100%
    const b = Math.floor(Math.pow(Math.random(), 0.5) * 100); // Skewed towards brighter, 0-100%
    
    return {
      h: hue,
      s: s,
      b: b
    };
  };
  
  // Initialize game
  useEffect(() => {
    // Generate initial color for all modes
    const initialNormalColor = generateRandomColorForMode('normal');
    const initialRedBlueColor = generateRandomColorForMode('red-blue');
    const initialGreenBlueColor = generateRandomColorForMode('green-blue');
    
    // Store colors in our ref
    modeColors.current = {
      normal: initialNormalColor,
      'red-blue': initialRedBlueColor,
      'green-blue': initialGreenBlueColor
    };
    
    // Set current color based on initial mode
    setCurrentColor(initialNormalColor);
  }, []);
  
  // Handle mode changes
  const handleModeChange = (mode) => {
    if (gamePhase === 'guessing' && mode !== colorMode) {
      setColorMode(mode);
      
      // Switch to the stored color for this mode
      setCurrentColor(modeColors.current[mode]);
    }
  };

  // Handle keyboard events for continuing to next round
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && gamePhase === 'results') {
        nextRound();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gamePhase]);

  // Submit user guess
  const submitGuess = () => {
    // Use the original scoring logic
    const distance = calculateDistanceBetween(userGuess, currentColor);
    const roundScore = calculateScoreFromDistance(distance);
    
    setAccuracy(roundScore);
    setScore(score + roundScore);
    setGamePhase('results');
  };

  // Move to next round
  const nextRound = () => {
    // Generate new colors for all modes
    const newNormalColor = generateRandomColorForMode('normal');
    const newRedBlueColor = generateRandomColorForMode('red-blue');
    const newGreenBlueColor = generateRandomColorForMode('green-blue');
    
    // Store the new colors
    modeColors.current = {
      normal: newNormalColor,
      'red-blue': newRedBlueColor,
      'green-blue': newGreenBlueColor
    };
    
    // Set current color based on current mode
    setCurrentColor(modeColors.current[colorMode]);
    setUserGuess({ h: 0, s: 0, b: 0 });
    
    if (round < totalRounds) {
      setRound(round + 1);
      setGamePhase('guessing');
    } else {
      // Game over - show final score
      alert(`Game over! Your final score is ${Math.round(score/totalRounds)}%`);
      // Reset the game
      setScore(0);
      setRound(1);
      setGamePhase('guessing');
    }
  };

  // Handle input changes
  const handleInputChange = (type, value) => {
    let newValue = parseInt(value);
    
    // Input validation
    if (isNaN(newValue)) {
      newValue = 0;
    }
    
    if (type === 'h') {
      newValue = Math.max(0, Math.min(360, newValue));
    } else {
      newValue = Math.max(0, Math.min(100, newValue));
    }
    
    setUserGuess({ ...userGuess, [type]: newValue });
  };

  // Convert HSB to RGB for CSS
  const hsbToRgb = (h, s, b) => {
    s /= 100;
    b /= 100;
    
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    
    const r = Math.round(255 * f(5));
    const g = Math.round(255 * f(3));
    const bl = Math.round(255 * f(1));
    
    return `rgb(${r}, ${g}, ${bl})`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        {/* Score and Round */}
        <div className="text-right mb-4">
          <div className="text-gray-600">SCORE: {score}</div>
          <div className="text-gray-600">ROUND: {round}</div>
        </div>
        
        {/* Title */}
        <h1 className="text-center text-xl font-bold uppercase mb-6">The HSB Guessing Game</h1>
        
        {/* Color Mode Selection - Only enabled during guessing phase */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              type="button" 
              onClick={() => handleModeChange('normal')}
              disabled={gamePhase !== 'guessing'}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                colorMode === 'normal' 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : gamePhase === 'guessing'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <div>Normal Mode</div>
              <div className="text-xs mt-1">All Hues</div>
            </button>
            <button 
              type="button"
              onClick={() => handleModeChange('red-blue')}
              disabled={gamePhase !== 'guessing'}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                colorMode === 'red-blue' 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : gamePhase === 'guessing'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <div>Red-Blue Mode</div>
              <div className="text-xs mt-1">Hue: 240°-360°</div>
            </button>
            <button 
              type="button"
              onClick={() => handleModeChange('green-blue')}
              disabled={gamePhase !== 'guessing'}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                colorMode === 'green-blue' 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : gamePhase === 'guessing'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <div>Green-Blue Mode</div>
              <div className="text-xs mt-1">Hue: 120°-240°</div>
            </button>
          </div>
        </div>
        
        {gamePhase === 'guessing' ? (
          <>
            {/* Color Display */}
            <div 
              className="w-40 h-40 mx-auto mb-8 border border-gray-200"
              style={{ backgroundColor: hsbToRgb(currentColor.h, currentColor.s, currentColor.b) }}
            ></div>
            
            {/* Input Controls */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-center text-gray-700 mb-2">HUE</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={userGuess.h}
                  onChange={(e) => handleInputChange('h', e.target.value)}
                  className="w-full border border-gray-300 p-2 text-center"
                />
              </div>
              <div>
                <label className="block text-center text-gray-700 mb-2">SATURATION</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={userGuess.s}
                  onChange={(e) => handleInputChange('s', e.target.value)}
                  className="w-full border border-gray-300 p-2 text-center"
                />
              </div>
              <div>
                <label className="block text-center text-gray-700 mb-2">BRIGHTNESS</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={userGuess.b}
                  onChange={(e) => handleInputChange('b', e.target.value)}
                  className="w-full border border-gray-300 p-2 text-center"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={submitGuess}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Submit Guess
            </button>
          </>
        ) : (
          <>
            {/* Results Display */}
            <div className="flex justify-center items-center mb-8">
              {/* User's Guess Color */}
              <div className="flex flex-col items-center mr-4">
                <div 
                  className="w-24 h-24 mb-2"
                  style={{ backgroundColor: hsbToRgb(userGuess.h, userGuess.s, userGuess.b) }}
                ></div>
                <span className="text-sm text-gray-600">YOUR GUESS</span>
              </div>
              
              {/* Accuracy Badge */}
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{accuracy}%</span>
                </div>
              </div>
              
              {/* Correct Color */}
              <div className="flex flex-col items-center ml-4">
                <div 
                  className="w-24 h-24 mb-2"
                  style={{ backgroundColor: hsbToRgb(currentColor.h, currentColor.s, currentColor.b) }}
                ></div>
                <span className="text-sm text-gray-600">ANSWER</span>
              </div>
            </div>
            
            {/* Value Comparison */}
            <div className="w-full max-w-xs mx-auto mb-8">
              <div className="flex justify-between mb-2">
                <span className="w-8 text-gray-600">H:</span>
                <span className="w-16 text-right">{userGuess.h}°</span>
                <span className="w-16 text-right">{currentColor.h}°</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="w-8 text-gray-600">S:</span>
                <span className="w-16 text-right">{userGuess.s}%</span>
                <span className="w-16 text-right">{currentColor.s}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="w-8 text-gray-600">B:</span>
                <span className="w-16 text-right">{userGuess.b}%</span>
                <span className="w-16 text-right">{currentColor.b}%</span>
              </div>
            </div>
            
            {/* Current Mode Indicator */}
            <div className="text-center text-gray-500 mb-4">
              Current mode: {colorMode === 'normal' ? 'Normal' : 
                            colorMode === 'red-blue' ? 'Red-Blue' : 'Green-Blue'}
            </div>
            
            {/* Continue Button */}
            <div className="text-center">
              <div className="text-gray-500 mb-2">press spacebar to continue</div>
              <button 
                onClick={nextRound}
                className="bg-gray-800 text-white py-2 px-8 rounded hover:bg-gray-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HSBGuessingGame;

export const metadata = {
  title: "🎨 HSB Color Guessing Game",
  description: "Test your color perception by guessing HSB values! Features colorblind-friendly modes and uses advanced 3D scoring for accurate evaluation.",
  type: "react",
  tags: ["game","color","accessibility","hsb","educational"],
  folder: "games",
  createdAt: "2025-01-07T00:00:00.000Z",
  updatedAt: "2025-01-07T00:00:00.000Z",
} as const;
