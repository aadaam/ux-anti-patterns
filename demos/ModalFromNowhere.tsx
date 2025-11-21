import React, { useState, useEffect, useRef } from 'react';
import { X, Info, Bell, AlertTriangle } from 'lucide-react';

export default function ModalFromNowhere() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear everything when switching modes
  useEffect(() => {
    resetSimulation();
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const resetSimulation = () => {
    setShowModal(false);
    setShowToast(false);
    setTimerActive(false);
    setSystemStatus(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // Arm the trap on first keystroke if not already active/shown
    if (!timerActive && !showModal && !showToast && e.target.value.length > 0) {
      setTimerActive(true);
      
      // Random delay between 3s and 6s to feel unpredictable but quick enough for a demo
      const delay = 3000 + Math.random() * 3000;
      
      timerRef.current = setTimeout(() => {
        if (mode === 'bad') {
          setShowModal(true);
        } else {
          setShowToast(true);
        }
        setTimerActive(false);
      }, delay);
    }
  };

  const handleModalAction = (action: string) => {
    if (action === 'ok') {
      // Bad UX: Destructive refresh or loss of focus/state
      setText(""); // Lost work
      setSystemStatus("System forced a restart. Unsaved work was discarded.");
    }
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Modal from Nowhere</h2>
          <p className="text-slate-600 mt-2">
            Experience how modal interruptions kill flow versus passive notifications.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setMode('bad')}
            className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${
              mode === 'bad' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            Bad UX
            <span className="block text-xs font-normal mt-1">Interrupts & destroys</span>
          </button>
          <button
            onClick={() => setMode('good')}
            className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${
              mode === 'good' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            Good UX
            <span className="block text-xs font-normal mt-1">Notifies & preserves</span>
          </button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
          <strong>Instructions:</strong> Start typing in the "Important Document" box. The system will interrupt you automatically after a few seconds.
        </div>
        
        {timerActive && (
          <div className="flex items-center text-xs text-slate-400 animate-pulse">
             <AlertTriangle size={12} className="mr-1"/> 
             System timer running... wait for it...
          </div>
        )}

        {systemStatus && (
          <div className="p-4 bg-slate-800 text-white rounded-lg font-mono text-sm animate-in fade-in">
            &gt; {systemStatus}
          </div>
        )}

        <button 
          onClick={() => { setText(""); resetSimulation(); }}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Clear & Reset
        </button>
      </div>

      <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 p-1 min-h-[400px] flex flex-col z-0">
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex space-x-2 rounded-t-lg">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="p-6 flex-1 relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">Important Document</label>
          <textarea
            value={text}
            onChange={handleTyping}
            className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-serif text-lg leading-relaxed"
            placeholder="Start typing a really long sentence here..."
          />
          
          {/* BAD UX MODAL - FIXED POSITION */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100 border border-slate-200">
                <div className="flex items-center text-red-600 mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                     <Info className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">SYSTEM INTERRUPT</h3>
                </div>
                <p className="text-slate-700 mb-8 text-lg">
                  Critical updates pending. The editor must restart immediately to apply changes. 
                  <br/><br/>
                  <strong>Current session data will be discarded.</strong>
                </p>
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={() => handleModalAction('ok')}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Restart Now (Lose Data)
                  </button>
                  <div className="text-center text-xs text-slate-400">
                    There is no option to cancel.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOOD UX TOAST */}
          <div className={`absolute bottom-4 right-4 z-10 transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-slate-900 text-white p-4 rounded-lg shadow-xl flex items-start max-w-xs border border-slate-700">
              <Bell className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Updates Ready</h4>
                <p className="text-xs text-slate-300 mt-1">Security patches will install next time you restart. Your work is safe.</p>
                <button 
                  onClick={() => setShowToast(false)}
                  className="mt-3 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
                >
                  Got it
                </button>
              </div>
              <button onClick={() => setShowToast(false)} className="ml-2 text-slate-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}