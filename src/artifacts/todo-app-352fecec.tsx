import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">할 일 관리</h1>
          <p className="text-gray-600">
            {totalCount > 0 ? `${completedCount}/${totalCount} 완료` : '새로운 할 일을 추가해보세요'}
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="새로운 할 일을 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* 할 일 목록 */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Check size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">아직 할 일이 없습니다</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 transition-all duration-200 ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {todo.completed && <Check size={14} />}
                </button>
                
                <span
                  className={`flex-1 transition-all duration-200 ${
                    todo.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* 하단 통계 */}
        {todos.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">
                전체 {totalCount}개 중 {completedCount}개 완료
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "할 일 관리 앱 📝",
  description: "깔끔한 디자인의 할 일 관리 앱. 추가, 완료 체크, 삭제 기능과 진행률 표시 포함",
  type: "react",
  tags: ["todo","productivity","react","korean"],
  
  createdAt: "2025-07-30T06:30:00.000Z",
  updatedAt: "2025-07-30T06:30:00.000Z",
} as const;
