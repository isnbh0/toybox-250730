import React, { useState, useEffect } from 'react';

const KoreanPangramHelper = () => {
  // 두벌식 키보드 레이아웃
  const keyboardLayout = [
    // 첫째 줄 (숫자 줄 아래)
    [
      { key: 'ㅂ', shift: 'ㅃ', type: 'consonant' },
      { key: 'ㅈ', shift: 'ㅉ', type: 'consonant' },
      { key: 'ㄷ', shift: 'ㄸ', type: 'consonant' },
      { key: 'ㄱ', shift: 'ㄲ', type: 'consonant' },
      { key: 'ㅅ', shift: 'ㅆ', type: 'consonant' },
      { key: 'ㅛ', shift: null, type: 'vowel' },
      { key: 'ㅕ', shift: null, type: 'vowel' },
      { key: 'ㅑ', shift: null, type: 'vowel' },
      { key: 'ㅐ', shift: 'ㅒ', type: 'vowel' },
      { key: 'ㅔ', shift: 'ㅖ', type: 'vowel' }
    ],
    // 둘째 줄
    [
      { key: 'ㅁ', shift: null, type: 'consonant' },
      { key: 'ㄴ', shift: null, type: 'consonant' },
      { key: 'ㅇ', shift: null, type: 'consonant' },
      { key: 'ㄹ', shift: null, type: 'consonant' },
      { key: 'ㅎ', shift: null, type: 'consonant' },
      { key: 'ㅗ', shift: null, type: 'vowel' },
      { key: 'ㅓ', shift: null, type: 'vowel' },
      { key: 'ㅏ', shift: null, type: 'vowel' },
      { key: 'ㅣ', shift: null, type: 'vowel' }
    ],
    // 셋째 줄
    [
      { key: 'ㅋ', shift: null, type: 'consonant' },
      { key: 'ㅌ', shift: null, type: 'consonant' },
      { key: 'ㅊ', shift: null, type: 'consonant' },
      { key: 'ㅍ', shift: null, type: 'consonant' },
      { key: 'ㅠ', shift: null, type: 'vowel' },
      { key: 'ㅜ', shift: null, type: 'vowel' },
      { key: 'ㅡ', shift: null, type: 'vowel' }
    ]
  ];

  // 모든 자음과 모음 (쌍자음, 복모음 포함)
  const allConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const allVowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  
  // 초성, 중성, 종성 리스트 (유니코드 분해용)
  const choSeong = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const jungSeong = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const jongSeong = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const [text, setText] = useState('');
  const [usedKeys, setUsedKeys] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevComplete, setPrevComplete] = useState(false);

  // 한글 문자를 자모로 분해하는 함수
  const decomposeHangul = (char) => {
    const code = char.charCodeAt(0);
    
    // 한글 음절 범위 체크 (가 ~ 힣)
    if (code < 0xAC00 || code > 0xD7A3) {
      return null;
    }
    
    const offset = code - 0xAC00;
    const choIndex = Math.floor(offset / 588);
    const jungIndex = Math.floor((offset % 588) / 28);
    const jongIndex = offset % 28;
    
    return {
      cho: choSeong[choIndex],
      jung: jungSeong[jungIndex],
      jong: jongSeong[jongIndex]
    };
  };

  // 복합 종성을 개별 자음으로 분해
  const decomposeJongSeong = (jong) => {
    const jongDecompose = {
      'ㄳ': ['ㄱ', 'ㅅ'],
      'ㄵ': ['ㄴ', 'ㅈ'],
      'ㄶ': ['ㄴ', 'ㅎ'],
      'ㄺ': ['ㄹ', 'ㄱ'],
      'ㄻ': ['ㄹ', 'ㅁ'],
      'ㄼ': ['ㄹ', 'ㅂ'],
      'ㄽ': ['ㄹ', 'ㅅ'],
      'ㄾ': ['ㄹ', 'ㅌ'],
      'ㄿ': ['ㄹ', 'ㅍ'],
      'ㅀ': ['ㄹ', 'ㅎ'],
      'ㅄ': ['ㅂ', 'ㅅ']
    };
    return jongDecompose[jong] || [jong];
  };

  // 복모음을 개별 모음으로 분해
  const decomposeComplexVowel = (vowel) => {
    const vowelDecompose = {
      'ㅘ': ['ㅗ', 'ㅏ'],
      'ㅙ': ['ㅗ', 'ㅐ'],
      'ㅚ': ['ㅗ', 'ㅣ'],
      'ㅝ': ['ㅜ', 'ㅓ'],
      'ㅞ': ['ㅜ', 'ㅔ'],
      'ㅟ': ['ㅜ', 'ㅣ'],
      'ㅢ': ['ㅡ', 'ㅣ']
    };
    return vowelDecompose[vowel] || [vowel];
  };

  // 텍스트 분석 함수
  useEffect(() => {
    const keySet = new Set();
    
    for (let char of text) {
      const decomposed = decomposeHangul(char);
      if (decomposed) {
        // 초성 추가
        keySet.add(decomposed.cho);
        
        // 중성 추가 (복모음인 경우 분해)
        const vowelParts = decomposeComplexVowel(decomposed.jung);
        vowelParts.forEach(v => keySet.add(v));
        
        // 종성 추가 (있는 경우, 복합 종성은 분해)
        if (decomposed.jong) {
          const jongParts = decomposeJongSeong(decomposed.jong);
          jongParts.forEach(j => keySet.add(j));
        }
      }
    }
    
    setUsedKeys(keySet);
    
    // 모든 키를 사용했는지 체크 (쌍자음, 쌍모음 제외한 기본 키들만)
    const basicKeys = keyboardLayout.flat().map(k => k.key);
    const isComplete = basicKeys.every(key => keySet.has(key));
    
    if (isComplete && !prevComplete) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPrevComplete(isComplete);
  }, [text]);

  // 사용된 키 개수 계산
  const basicKeys = keyboardLayout.flat().map(k => k.key);
  const usedBasicKeysCount = basicKeys.filter(key => usedKeys.has(key)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          한글 팬그램 도우미 - 두벌식 ⌨️
        </h1>
        
        {/* 진행 상황 */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-4 mb-6 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-white">사용된 키</span>
            <span className="text-2xl font-bold text-cyan-400">{usedBasicKeysCount}/{basicKeys.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(usedBasicKeysCount / basicKeys.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* 키보드 레이아웃 */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 mb-6 border border-slate-600">
          <div className="space-y-2">
            {keyboardLayout.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className="flex gap-2 justify-center"
                style={{ marginLeft: rowIndex === 1 ? '30px' : rowIndex === 2 ? '60px' : '0' }}
              >
                {row.map((keyData) => (
                  <div
                    key={keyData.key}
                    className={`
                      relative transition-all duration-300
                      ${usedKeys.has(keyData.key) 
                        ? 'transform -translate-y-1' 
                        : ''}
                    `}
                  >
                    <div
                      className={`
                        relative w-14 h-14 rounded-lg font-bold text-center flex flex-col items-center justify-center
                        transition-all duration-300 border-b-4
                        ${usedKeys.has(keyData.key)
                          ? keyData.type === 'consonant'
                            ? 'bg-gradient-to-b from-green-400 to-green-500 border-green-600 text-white shadow-lg shadow-green-500/50'
                            : 'bg-gradient-to-b from-blue-400 to-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-slate-700 border-slate-800 text-slate-400'
                        }
                      `}
                    >
                      {keyData.shift && (
                        <div className={`
                          absolute top-1 text-xs
                          ${usedKeys.has(keyData.shift) ? 'text-yellow-300' : 'text-slate-500'}
                        `}>
                          {keyData.shift}
                        </div>
                      )}
                      <div className="text-xl">{keyData.key}</div>
                      {usedKeys.has(keyData.key) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* 텍스트 입력 섹션 */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-600">
          <h2 className="text-xl font-semibold mb-4 text-white">문장 입력</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
            rows="5"
            placeholder="모든 한글 키를 사용한 문장을 입력해보세요!"
          />
          <div className="mt-4 text-sm text-slate-400">
            💡 팁: 키보드의 모든 한글 자판을 최소 한 번씩 사용해보세요!
          </div>
          <div className="mt-2 text-xs text-slate-500">
            ※ 복모음(ㅘ, ㅝ 등)과 복자음(ㄳ, ㄵ 등)은 기본 자모로 분해되어 계산됩니다
          </div>
        </div>
      </div>
      
      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400">
              🎉 완성! 모든 키 사용! 🎉
            </div>
          </div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              {['🎊', '🎉', '✨', '🌟', '💫', '🎈', '🎆', '🎇'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KoreanPangramHelper;

export const metadata = {
  title: "한글 팬그램 도우미 ⌨️",
  description: "두벌식 키보드 레이아웃으로 한글 팬그램 작성을 돕는 웹앱. 모든 자음과 모음 사용 추적 기능 포함",
  type: "react",
  tags: ["korean","pangram","keyboard","language","interactive","game"],
  
  createdAt: "2025-08-07T10:00:00.000Z",
  updatedAt: "2025-08-07T10:00:00.000Z",
} as const;
