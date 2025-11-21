import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Bot, User, Sparkles, Database, Square, Loader2, Info } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean; // For "Gathering information" state
  isStreaming?: boolean;
}

const SAMPLE_RESPONSE = "Based on the latest diagnostics, your quantum flux capacitor is operating at 94% efficiency. I've optimized the thermal regulation protocols, which should prevent the overheating issue you mentioned. Would you like me to schedule a maintenance check for next Tuesday?";

export default function GhostInTheShell() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! How can I assist you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Bad Mode Specifics
  const [isBlocking, setIsBlocking] = useState(false);

  // Good Mode Specifics
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const resetDemo = () => {
    setMessages([{ id: '1', role: 'assistant', content: "Hello! How can I assist you today?" }]);
    setInputValue("");
    setIsGenerating(false);
    setIsBlocking(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    resetDemo();
  }, [mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, isBlocking]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    if (mode === 'bad') {
      handleBadSend();
    } else {
      handleGoodSend();
    }
  };

  // --- BAD UX IMPLEMENTATION ---
  const handleBadSend = () => {
    setIsBlocking(true); // Disable everything
    
    // Simulate long server wait
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: SAMPLE_RESPONSE 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsBlocking(false);
    }, 3000);
  };

  // --- GOOD UX IMPLEMENTATION ---
  const handleGoodSend = async () => {
    setIsGenerating(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // 1. Immediate acknowledgment (empty message appearing)
    const msgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: msgId, role: 'assistant', content: "", isStreaming: true }]);

    // 2. Simulate "Thinking" / Tool Use phase
    const intro = "Sure, checking system status... ";
    
    try {
      // Stream Intro
      for (let i = 0; i < intro.length; i++) {
        if (signal.aborted) return;
        await new Promise(r => setTimeout(r, 30));
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: intro.slice(0, i + 1) } : m));
      }

      // Show "Thinking" indicator inline
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isThinking: true } : m));
      
      // Simulate Tool Delay
      await new Promise(r => setTimeout(r, 1500));
      if (signal.aborted) return;

      // Remove thinking, continue streaming
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isThinking: false } : m));
      
      const fullText = intro + SAMPLE_RESPONSE;
      
      // Stream remainder
      for (let i = intro.length; i < fullText.length; i++) {
        if (signal.aborted) return;
        await new Promise(r => setTimeout(r, 20)); // Fast typing
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: fullText.slice(0, i + 1) } : m));
      }

    } catch (e) {
      // Handle abort
    } finally {
      setIsGenerating(false);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m));
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      // Mark current message as stopped/done
      setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false, content: m.content + " [Stopped]" } : m));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isBlocking && !isGenerating) handleSend();
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Ghost in the Shell</h2>
          <p className="text-slate-600 mt-1">
            Comparing blocking vs. streaming interfaces for AI.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-sm shrink-0">
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

      <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className={`h-14 px-6 flex items-center border-b ${mode === 'bad' ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-100'}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isGenerating || isBlocking ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="font-medium text-slate-700 text-sm">Assistant v2.0</span>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${
                mode === 'bad' 
                  ? 'flex-row items-start space-x-3' // Bad: All left aligned
                  : msg.role === 'user' ? 'flex-row-reverse space-x-reverse space-x-3' : 'flex-row items-start space-x-3' // Good: Split sides
              }`}
            >
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'assistant' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-600'}
              `}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] flex flex-col`}>
                <div className={`
                  px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${mode === 'bad'
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' // Bad: Generic styling
                    : msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none' // Good: Distinct User
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' // Good: Distinct AI
                  }
                `}>
                  {msg.content}
                  
                  {/* Thinking Indicator (Good Mode Only) */}
                  {msg.isThinking && (
                    <div className="mt-2 inline-flex items-center px-3 py-1.5 bg-amber-50 border border-amber-100 rounded text-xs font-medium text-amber-700 animate-in fade-in slide-in-from-left-2">
                      <Database className="w-3 h-3 mr-2 animate-pulse" />
                      Gathering system info...
                    </div>
                  )}
                  
                  {/* Cursor for streaming */}
                  {msg.isStreaming && !msg.isThinking && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-slate-400 animate-pulse align-middle"></span>
                  )}
                </div>
                
                {/* Timestamp / Meta (Bad Mode: clutter, Good Mode: subtle) */}
                <div className={`text-[10px] text-slate-400 mt-1 px-1 ${msg.role === 'user' && mode === 'good' ? 'text-right' : 'text-left'}`}>
                   {msg.role === 'user' ? 'You' : 'Assistant'} • {new Date(Number(msg.id) || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}

          {/* BAD UX: Blocking Spinner Overlay in list */}
          {mode === 'bad' && isBlocking && (
             <div className="flex flex-row items-start space-x-3 animate-in fade-in">
               <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Bot size={16}/></div>
               <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center text-slate-500 text-sm">
                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
                 Please wait...
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBlocking || (mode === 'bad' && isGenerating)}
              placeholder={isBlocking ? "Please wait..." : "Type your message..."}
              className={`
                w-full pl-4 pr-12 py-3 rounded-full border transition-all outline-none
                ${isBlocking 
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400' 
                  : 'bg-white border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50'}
              `}
            />
            
            <div className="absolute right-2">
              {mode === 'good' && isGenerating ? (
                <button
                  onClick={handleStop}
                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full transition-colors"
                  title="Stop generating"
                >
                  <Square size={18} fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isBlocking}
                  className={`
                    p-2 rounded-full transition-all duration-200
                    ${!inputValue.trim() || isBlocking
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
                  `}
                >
                  <Send size={18} className={!inputValue.trim() ? '' : 'ml-0.5'} />
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center">
              {mode === 'good' && <Sparkles size={10} className="mr-1 text-amber-400"/>}
              {mode === 'bad' 
                ? "System may take a moment to process requests." 
                : "AI generates responses in real-time."}
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Card */}
      <div className={`p-4 rounded-lg border text-sm flex items-start ${mode === 'bad' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
        <Info className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold mb-1">{mode === 'bad' ? 'The "Loading" Problem' : 'The Streaming Solution'}</h3>
          <p className="opacity-90">
            {mode === 'bad'
              ? "Blocking the UI and making the user wait for a complete response creates uncertainty and perceived latency. Left-aligning all messages increases cognitive load."
              : "Streaming text immediately acknowledges the request. Showing intermediate steps (like tool usage) builds trust. Allowing users to stop generation puts them in control."}
          </p>
        </div>
      </div>
    </div>
  );
}