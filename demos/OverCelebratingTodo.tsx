import React, { useState, useRef } from 'react';
import { Plus, X, Check, Trophy } from 'lucide-react';

export default function OverCelebratingTodo() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [items, setItems] = useState<string[]>(["Buy milk", "Walk the dog"]);
  const [inputValue, setInputValue] = useState("");
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [justAddedIndex, setJustAddedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    if (!inputValue.trim()) return;
    
    const newItems = [...items, inputValue];
    setItems(newItems);
    setInputValue("");
    
    if (mode === 'bad') {
      setShowCelebrationModal(true);
      // Lose focus
      inputRef.current?.blur();
    } else {
      // Good mode
      setJustAddedIndex(newItems.length - 1);
      setTimeout(() => setJustAddedIndex(null), 2000);
      // Keep focus
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addItem();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Over-Celebrating Todo</h2>
        <p className="text-slate-600 mt-2">Efficiency vs. unnecessary gamification.</p>
        
        <div className="mt-6 inline-flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('bad')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'bad' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            Bad (Annoying Modal)
          </button>
          <button
            onClick={() => setMode('good')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'good' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            Good (Subtle Flash)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative min-h-[400px]">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">My Tasks</h3>
          <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{items.length} items</span>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={addItem}
              className="bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              <Plus />
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div 
                key={idx}
                className={`
                  p-3 rounded-lg border flex items-center transition-all duration-500
                  ${idx === justAddedIndex 
                    ? 'bg-green-100 border-green-300 scale-105' 
                    : 'bg-white border-slate-100 hover:border-slate-300'}
                `}
              >
                <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${idx === justAddedIndex ? 'border-green-500 text-green-600' : 'border-slate-300 text-transparent'}`}>
                  <Check size={14} />
                </div>
                <span className={idx === justAddedIndex ? 'text-green-900 font-medium' : 'text-slate-700'}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BAD UX: Celebration Modal */}
        {showCelebrationModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs animate-bounce relative overflow-hidden">
              {/* Confetti CSS implementation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 {[...Array(20)].map((_, i) => (
                   <div 
                     key={i} 
                     className="confetti-piece"
                     style={{
                       left: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 2}s`,
                       backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)]
                     }}
                   />
                 ))}
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Amazing Job!</h3>
                <p className="text-slate-600 mb-6">You added a list item! You are a productivity superstar!</p>
                <button 
                  onClick={() => setShowCelebrationModal(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Close & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}