import React, { useState, useEffect, useRef } from 'react';

export default function ReactionSpeedGame() {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, go, result
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  const startGame = () => {
    setGameState('ready');
    const randomDelay = Math.random() * 4000 + 1000; // 1-5초 랜덤 대기
    
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      // 너무 빨리 클릭한 경우
      clearTimeout(timeoutRef.current);
      setGameState('waiting');
      alert('너무 빨라요! 초록색이 될 때까지 기다리세요.');
    } else if (gameState === 'go') {
      // 정상적인 반응
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setAttempts(prev => prev + 1);
      
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
      }
      
      setGameState('result');
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    clearTimeout(timeoutRef.current);
  };

  const resetStats = () => {
    setBestTime(null);
    setAttempts(0);
    resetGame();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-red-500';
      case 'go':
        return 'bg-green-500';
      case 'result':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getReactionMessage = (time) => {
    if (time < 200) return '🚀 번개같은 반응!';
    if (time < 250) return '⚡ 매우 빠름!';
    if (time < 300) return '👍 빠름!';
    if (time < 400) return '😊 보통!';
    return '🐌 좀 더 빨리!';
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} transition-colors duration-300 flex flex-col items-center justify-center text-white font-bold cursor-pointer select-none`} onClick={handleClick}>
      <div className="text-center space-y-8">
        {gameState === 'waiting' && (
          <>
            <h1 className="text-4xl md:text-6xl mb-8">⚡ 반응속도 테스트</h1>
            <div className="text-xl md:text-2xl space-y-4">
              <p>화면이 <span className="text-red-300">빨간색</span>이 되면 준비!</p>
              <p><span className="text-green-300">초록색</span>이 되는 순간 빠르게 클릭하세요!</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="bg-white text-blue-500 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                게임 시작!
              </button>
            </div>
          </>
        )}

        {gameState === 'ready' && (
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl mb-4">준비...</h2>
            <p className="text-xl md:text-2xl">초록색이 될 때까지 기다리세요!</p>
            <p className="text-lg mt-4 text-red-200">⚠️ 너무 빨리 클릭하면 실패!</p>
          </div>
        )}

        {gameState === 'go' && (
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl mb-4">지금 클릭!</h2>
            <p className="text-xl md:text-2xl">빠르게 클릭하세요!</p>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl">결과</h2>
            <div className="text-2xl md:text-4xl font-bold">
              {reactionTime}ms
            </div>
            <div className="text-xl md:text-2xl">
              {getReactionMessage(reactionTime)}
            </div>
            <div className="space-y-2 text-lg">
              {bestTime && (
                <p>🏆 최고 기록: <span className="text-yellow-200">{bestTime}ms</span></p>
              )}
              <p>📊 시도 횟수: {attempts}회</p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="bg-white text-yellow-600 px-6 py-3 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors"
              >
                다시 하기
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  resetStats();
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-red-600 transition-colors"
              >
                기록 초기화
              </button>
            </div>
          </div>
        )}

        {/* 하단 설명 */}
        <div className="fixed bottom-4 left-4 right-4 text-center text-sm md:text-base opacity-75">
          <p>💡 팁: 평균적인 인간의 반응속도는 200-300ms입니다!</p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "⚡ 반응속도 테스트 게임",
  description: "화면 색상 변화에 반응하여 클릭 속도를 측정하는 재미있는 게임. 최고 기록 저장 및 반응속도 평가 기능 포함.",
  type: "react",
  tags: ["게임","반응속도","테스트","인터랙티브"],
  folder: "게임",
  createdAt: "2025-08-09T00:00:00.000Z",
  updatedAt: "2025-08-09T00:00:00.000Z",
} as const;
