import React, { useState, useEffect } from 'react';
import { Loader, Plus, PackageOpen } from 'lucide-react';

export default function EmptySpaces() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [isLoading, setIsLoading] = useState(false);

  // Function to simulate reloading data
  const triggerLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // 2 second delay
  };

  // Reload whenever mode changes to demonstrate the loading state difference
  useEffect(() => {
    triggerLoad();
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Empty States</h2>
          <p className="text-slate-600 mt-1">
            How to handle the void when there is nothing to show.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-sm">
          <button
            onClick={() => setMode('bad')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              mode === 'bad' ? 'bg-red-100 text-red-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bad UX
          </button>
          <button
            onClick={() => setMode('good')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              mode === 'good' ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Good UX
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[400px] flex flex-col relative overflow-hidden">
        
        {/* Toolbar / Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
           <span className="font-bold text-slate-700">My Inventory</span>
           <button 
             onClick={triggerLoad} 
             className="text-xs text-blue-600 hover:underline font-medium"
             disabled={isLoading}
           >
             Reload Data
           </button>
        </div>

        <div className="flex-1 p-8 relative">
          {mode === 'bad' ? (
             <BadUX isLoading={isLoading} />
          ) : (
             <GoodUX isLoading={isLoading} />
          )}
        </div>
      </div>
      
      <div className={`p-6 rounded-lg border text-sm ${mode === 'bad' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
        <h3 className="font-bold mb-2">UX Note</h3>
        {mode === 'bad' 
          ? "Blocking the user with a spinner creates perceived slowness. Leaving them with a blank space provides no context or next steps." 
          : "Skeleton screens make the app feel faster by showing structure immediately. Explicit empty states guide the user on what to do next."}
      </div>
    </div>
  );
}

function BadUX({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
        <div className="flex flex-col items-center">
          <Loader className="w-10 h-10 text-slate-400 animate-spin mb-4" />
          <span className="text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">List of things</h3>
      <div className="border-t border-slate-200 pt-4">
         {/* Literally nothing here - a true anti-pattern */}
      </div>
    </div>
  );
}

function GoodUX({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
         <div className="h-7 w-1/4 bg-slate-200 rounded mb-6"></div>
         {[1, 2, 3].map((i) => (
           <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-lg">
             <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
             <div className="flex-1 space-y-2">
               <div className="h-4 bg-slate-200 rounded w-3/4"></div>
               <div className="h-3 bg-slate-200 rounded w-1/2"></div>
             </div>
           </div>
         ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <h3 className="text-xl font-bold text-slate-900 mb-6">List of things</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h4 className="text-lg font-medium text-slate-900 mb-2">No things found</h4>
        <p className="text-slate-500 max-w-xs mb-6 text-sm">
          Your inventory is currently empty. Create a new item to get started with your collection.
        </p>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow hover:-translate-y-0.5">
          <Plus size={18} className="mr-2" />
          Add a Thing
        </button>
      </div>
    </div>
  );
}