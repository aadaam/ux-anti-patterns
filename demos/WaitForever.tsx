import React, { useState, useEffect } from 'react';
import { Loader, Play, Clock, X, ArrowRight } from 'lucide-react';

export default function WaitForever() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemsProcessed, setItemsProcessed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const TOTAL_ITEMS = 1000;
  // 100 items per second => 1000 items takes 10 seconds.
  const TICK_MS = 100;
  const ITEMS_PER_TICK = 10;

  const resetDemo = () => {
    setIsProcessing(false);
    setItemsProcessed(0);
    setCompleted(false);
    setShowPopover(false);
    setShowToast(false);
    setHasUnread(false);
  };

  const startProcess = () => {
    setIsProcessing(true);
    setItemsProcessed(0);
    setCompleted(false);
    setShowToast(false);
    setShowPopover(false);
    setHasUnread(false);
  };

  const handleNavbarIconClick = () => {
    setShowPopover(!showPopover);
    // If the process is complete and user clicks the icon, remove the notification dot
    if (completed) {
      setHasUnread(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing) {
      interval = setInterval(() => {
        setItemsProcessed((prev) => {
          const next = prev + ITEMS_PER_TICK;
          if (next >= TOTAL_ITEMS) {
            setIsProcessing(false);
            setCompleted(true);
            // Only show toast and notification dot in Good UX mode
            if (mode === 'good') {
              setShowToast(true);
              setHasUnread(true);
            }
            return TOTAL_ITEMS;
          }
          return next;
        });
      }, TICK_MS);
    }
    return () => clearInterval(interval);
  }, [isProcessing, mode]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Wait Forever</h2>
          <p className="text-slate-600 mt-1">Blocking the UI vs. Non-blocking background tasks.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          <button
             onClick={() => { setMode('bad'); resetDemo(); }}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${mode === 'bad' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Bad UX
          </button>
          <button
             onClick={() => { setMode('good'); resetDemo(); }}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${mode === 'good' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Good UX
          </button>
        </div>
      </div>

      {/* The Fake App Interface */}
      <div className="bg-white h-[500px] rounded-xl shadow-xl border border-slate-200 flex flex-col relative overflow-hidden">
        
        {/* App Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10">
          <div className="font-bold text-xl text-slate-800">DataCruncher</div>
          
          {/* GOOD UX: Navbar Controls */}
          {mode === 'good' && (
            <div className="flex items-center space-x-4">
              {/* Progress Indicator in Navbar - appears when processing starts or finished */}
              {(isProcessing || completed) && (
                <div className="relative">
                  <button 
                    onClick={handleNavbarIconClick}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors relative text-slate-600"
                  >
                    <Clock size={24} />
                    {hasUnread && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-in zoom-in"></span>
                    )}
                  </button>

                  {/* Progress Popover */}
                  {showPopover && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-bold text-sm mb-2">{isProcessing ? 'Processing Data...' : 'Task Complete'}</h4>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${completed ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${(itemsProcessed / TOTAL_ITEMS) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>{Math.round((itemsProcessed / TOTAL_ITEMS) * 100)}%</span>
                        <span>{itemsProcessed}/{TOTAL_ITEMS} items</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
          )}
        </div>

        {/* App Body */}
        <div className="flex-1 p-8 bg-slate-50 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm mb-8">
              <h3 className="text-lg font-bold mb-4">Bulk Import</h3>
              <p className="text-slate-600 mb-6">Importing large datasets can take time. Click process to start the engine.</p>
              <button
                onClick={startProcess}
                disabled={isProcessing}
                className={`
                  px-6 py-3 rounded-lg font-bold flex items-center transition-all duration-300
                  ${isProcessing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
                `}
              >
                 {isProcessing ? (
                   <>
                     <Loader className="mr-2 animate-spin" size={18} />
                     {mode === 'good' ? 'Processing... will notify when finished' : 'Processing...'}
                   </>
                 ) : (
                   <>
                     <Play size={18} className="mr-2" /> 
                     Process Data
                   </>
                 )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="h-32 bg-slate-200/50 rounded animate-pulse"></div>
               ))}
            </div>
          </div>
        </div>

        {/* BAD UX: Blocking Overlay */}
        {mode === 'bad' && isProcessing && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in">
             <Loader className="w-16 h-16 text-blue-400 animate-spin mb-6" />
             <h3 className="text-2xl font-bold mb-2">Please wait half of eternity</h3>
             <p className="text-slate-300">Do not refresh the page.</p>
          </div>
        )}

        {/* GOOD UX: Toast Notification */}
        {mode === 'good' && (
          <div className={`absolute bottom-6 right-6 z-50 transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <div className="bg-white p-4 rounded-lg shadow-2xl border border-slate-200 flex items-start max-w-sm animate-in slide-in-from-bottom-5">
              <div className="bg-green-100 p-2 rounded-full mr-3 text-green-600">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Processing Finished</h4>
                <p className="text-xs text-slate-500 mt-1">1000 items have been successfully processed.</p>
                <button 
                  className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium flex items-center inline-flex"
                  onClick={() => setShowToast(false)}
                >
                  Check Results <ArrowRight size={12} className="ml-1"/>
                </button>
              </div>
              <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600 ml-2">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}