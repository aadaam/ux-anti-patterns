import React, { useState } from 'react';
import { Printer, TriangleAlert, Settings, Wrench } from 'lucide-react';

export default function JargonFile() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [status, setStatus] = useState<'idle' | 'error'>('idle');

  const handlePrint = () => {
    setStatus('idle');
    // Simulate brief processing
    setTimeout(() => {
      setStatus('error');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">The Jargon File</h2>
        <p className="text-slate-600">Compare how technical vs. user-centric error messages affect understanding.</p>
        
        <div className="inline-flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => { setMode('bad'); setStatus('idle'); }}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'bad' ? 'bg-red-100 text-red-800' : 'hover:bg-slate-50'}`}
          >
            Bad UX (System-centric)
          </button>
          <button
            onClick={() => { setMode('good'); setStatus('idle'); }}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'good' ? 'bg-green-100 text-green-800' : 'hover:bg-slate-50'}`}
          >
            Good UX (User-centric)
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8 min-h-[400px] justify-center relative overflow-hidden">
        {/* Simulated Printer UI */}
        <div className="w-full max-w-sm bg-slate-800 rounded-lg p-6 text-white shadow-xl relative z-10">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <div className="flex items-center space-x-2">
              <Printer className="text-blue-400" />
              <span className="font-mono font-bold">PrintMaster 3000</span>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          <div className="space-y-4">
            <div className="min-h-[8rem] bg-slate-900 rounded border border-slate-700 p-4 font-mono text-sm relative overflow-y-auto transition-all duration-300">
               {status === 'idle' ? (
                 <div className="text-slate-400 flex flex-col items-center justify-center h-24">
                   <span>Ready to print</span>
                   <span className="text-xs opacity-50 mt-2">Queue: 0 jobs</span>
                 </div>
               ) : (
                 mode === 'bad' ? <BadErrorDisplay /> : <GoodErrorDisplay />
               )}
            </div>
            
            <button 
              onClick={handlePrint}
              disabled={status === 'error'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded font-bold transition-colors flex justify-center items-center"
            >
               {status === 'error' ? 'Printer Halted' : 'Start Print Job'}
            </button>
            
            {status === 'error' && (
              <button 
                onClick={() => setStatus('idle')}
                className="w-full py-2 bg-transparent border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded text-sm"
              >
                Reset Simulation
              </button>
            )}
          </div>
        </div>
        
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 pointer-events-none z-0">
           <div className="absolute top-10 left-10 opacity-10"><Settings size={100}/></div>
           <div className="absolute bottom-10 right-10 opacity-10"><Wrench size={100}/></div>
        </div>
      </div>
    </div>
  );
}

function BadErrorDisplay() {
  return (
    <div className="text-red-500 flex flex-col h-full">
      <div className="flex items-center mb-2 border-b border-red-900/30 pb-1">
        <TriangleAlert size={16} className="mr-2" />
        <span className="font-bold uppercase tracking-wider">Fatal Error</span>
      </div>
      <p className="leading-relaxed">
        EXCEPTION 0x82F<br/>
        MOTOR_ADVANCE_FAIL<br/>
        KERNEL_STOP<br/>
        <span className="text-xs opacity-70">See admin manual pg 342.</span>
      </p>
    </div>
  );
}

function GoodErrorDisplay() {
  return (
    <div className="text-slate-200 flex flex-col h-full">
      <h4 className="font-bold text-amber-400 mb-2 flex items-center">
        <TriangleAlert size={16} className="mr-2" />
        Paper Jam
      </h4>
      <p className="text-sm leading-relaxed mb-2">
        The paper is stuck in the rear feeder.
      </p>
      <div className="text-xs text-blue-300 bg-blue-900/30 p-2 rounded border border-blue-800/50">
        Action: Open the back plate and gently remove the paper.
      </div>
    </div>
  );
}