import React, { useState, useEffect, useRef } from 'react';
import { Save, Clock, RotateCcw, FileX, Check } from 'lucide-react';

export default function HitSave() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [text, setText] = useState("Draft content...");
  const [savedText, setSavedText] = useState("Draft content..."); // The visual "Safe" state
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastSavedTime, setLastSavedTime] = useState<Date>(new Date());
  const [showCrashOverlay, setShowCrashOverlay] = useState(false);

  // REFS: Crucial for interval to access latest state without re-triggering effects
  const textRef = useRef(text);
  const savedTextRef = useRef(savedText);

  // Sync refs with state
  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { savedTextRef.current = savedText; }, [savedText]);

  // --- THE COUNTDOWN (Runs in BOTH modes now) ---
  useEffect(() => {
    // Reset timer on mode switch
    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // TIME'S UP: WIPE DATA
          // Visual crash effect
          setShowCrashOverlay(true);
          setTimeout(() => setShowCrashOverlay(false), 1500);

          // Logic: Revert text to the last thing present in savedTextRef
          // In BAD mode, this is the manual save point.
          // In GOOD mode, this is the last auto-save point (max 5s ago).
          setText(savedTextRef.current);
          
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  // --- GOOD MODE: Auto-save ---
  useEffect(() => {
    if (mode !== 'good') return;

    const autoSaver = setInterval(() => {
      // Check refs directly to avoid stale closures
      if (textRef.current !== savedTextRef.current) {
        setSavedText(textRef.current);
        setLastSavedTime(new Date());
      }
    }, 5000); // Strict 5s interval

    return () => clearInterval(autoSaver);
  }, [mode]);

  const manualSave = () => {
    setSavedText(text);
    setLastSavedTime(new Date());
    // In Bad Mode, we DON'T reset the timer, adding to the stress. 
    // You just secured your checkpoint.
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
      <div className="md:col-span-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hit Save or Die</h2>
          <p className="text-slate-600 mt-2 text-sm">
            Simulating an unstable environment (crashes every 30s). 
            Compare how much data you lose with Manual vs. Auto-Save.
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => { 
              setMode('bad'); 
              setText("Type fast! You must hit SAVE manually!"); 
              setSavedText("Type fast! You must hit SAVE manually!");
              setLastSavedTime(new Date());
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              mode === 'bad' ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="font-bold text-red-900 block mb-1">Bad Mode (Manual)</span>
            <span className="text-xs text-red-700">
              System crashes every 30s. Unsaved work is lost instantly. You WILL lose data.
            </span>
          </button>

          <button
            onClick={() => { 
              setMode('good'); 
              setText("System is unstable, but we auto-save."); 
              setSavedText("System is unstable, but we auto-save.");
              setLastSavedTime(new Date());
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              mode === 'good' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
             <span className="font-bold text-green-900 block mb-1">Good Mode (Auto)</span>
             <span className="text-xs text-green-700">
               System still crashes every 30s, but auto-save protects your work automatically.
             </span>
          </button>
        </div>
      </div>

      <div className="md:col-span-2 bg-slate-900 rounded-xl p-1 shadow-2xl overflow-hidden flex flex-col min-h-[500px] relative">
        
        {/* VISUAL CRASH OVERLAY */}
        {showCrashOverlay && (
          <div className="absolute inset-0 z-50 bg-blue-900 flex items-center justify-center text-white font-mono animate-pulse">
             <div className="text-center">
               <FileX size={64} className="mx-auto mb-4" />
               <h1 className="text-4xl font-bold mb-2">SYSTEM FAILURE</h1>
               <p>Restoring last checkpoint...</p>
             </div>
          </div>
        )}

        {/* App Bar */}
        <div className="bg-slate-800 p-3 flex justify-between items-center text-white border-b border-slate-700">
          <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded-full bg-red-500"/>
             <div className="w-3 h-3 rounded-full bg-yellow-500"/>
             <div className="w-3 h-3 rounded-full bg-green-500"/>
             <span className="ml-2 text-sm font-mono text-slate-400">Editor.exe</span>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* MODE INDICATOR / TIMER */}
             <div className={`flex items-center font-mono font-bold px-3 py-1 rounded ${timeLeft < 10 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
               <Clock size={16} className="mr-2"/>
               00:{timeLeft.toString().padStart(2, '0')}
             </div>
            
            {mode === 'good' && (
              <div className="flex items-center text-xs font-medium text-green-400 bg-green-900/30 px-3 py-1 rounded">
                <RotateCcw size={14} className="mr-1 animate-spin-slow" />
                Auto-Save On
              </div>
            )}

            {/* STATUS TEXT */}
            {mode === 'good' && (
              <div className="text-xs text-slate-400">
                {text === savedText ? "Synced" : "Typing..."}
              </div>
            )}
            
            <button 
              onClick={manualSave}
              className={`
                flex items-center px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all active:scale-95
                ${text !== savedText 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50' 
                  : 'bg-slate-700 text-slate-500 cursor-default'}
              `}
            >
              <Save size={14} className="mr-1" /> 
              {text !== savedText ? 'Save Now' : 'Saved'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative group">
           <textarea
             value={text}
             onChange={(e) => setText(e.target.value)}
             className="w-full h-full bg-slate-900 text-slate-200 p-6 font-mono text-lg resize-none focus:outline-none leading-relaxed"
             spellCheck={false}
             placeholder="Type something important here..."
           />
           
           {/* Imminent Doom Indicator */}
           {timeLeft <= 5 && !showCrashOverlay && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-red-500/5">
               <div className="text-[12rem] font-black text-red-600/10 select-none animate-ping">
                 {timeLeft}
               </div>
             </div>
           )}
        </div>

        {/* Status Bar */}
        <div className="bg-slate-800 px-4 py-2 text-xs text-slate-500 flex justify-between border-t border-slate-700">
          <div className="font-mono">Chars: {text.length}</div>
          <div className="flex items-center">
            {mode === 'good' && text === savedText && <Check size={12} className="text-green-500 mr-1"/>}
            Last saved: {lastSavedTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}