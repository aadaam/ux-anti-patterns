import React, { useState, useRef, useEffect } from 'react';
import { File, ChevronLeft, ChevronRight, ChevronDown, Search, X } from 'lucide-react';
import Tooltip from '../components/Tooltip';

const PAGE_NAMES = [
  "Dashboard", "Settings", "Profile", "Messages", "Reports", 
  "Analytics", "Users", "Groups", "Permissions", "Logs", 
  "Audit", "Billing", "Support", "API", "Docs"
];

const TABS = PAGE_NAMES.map((name, i) => ({
  id: i,
  title: `This is the same - ${name}`,
  shortTitle: name,
  content: `Content for ${name}`
}));

export default function TabsParade() {
  const [mode, setMode] = useState<'bad' | 'good_list' | 'good_chrome'>('bad');
  const [activeTabId, setActiveTabId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Refs for Chrome Mode auto-scrolling
  const chromeTabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const activeTab = TABS.find(t => t.id === activeTabId) || TABS[0];

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to active tab in Chrome mode
  useEffect(() => {
    if (mode === 'good_chrome' && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTabId, mode]);

  const scrollBadTabs = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredTabs = TABS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tabs Parade</h2>
          <p className="text-slate-600 mt-1">
            Managing high-density navigation with repetitive data.
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-sm">
          <button
             onClick={() => setMode('bad')}
             className={`px-3 py-2 rounded font-medium transition-colors ${mode === 'bad' ? 'bg-red-100 text-red-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Bad UX
          </button>
          <button
             onClick={() => setMode('good_list')}
             className={`px-3 py-2 rounded font-medium transition-colors ${mode === 'good_list' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Good (List)
          </button>
          <button
             onClick={() => setMode('good_chrome')}
             className={`px-3 py-2 rounded font-medium transition-colors ${mode === 'good_chrome' ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Good (Chrome)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-h-[500px] overflow-hidden relative">
        
        {/* --- BAD UX MODE --- */}
        {mode === 'bad' && (
          <>
            <div className="bg-slate-100 border-b border-slate-200 flex items-center">
              <button 
                onClick={() => scrollBadTabs('left')}
                className="p-3 bg-slate-200 hover:bg-slate-300 text-slate-600 z-10 shadow-md border-r border-slate-300"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div 
                ref={scrollContainerRef}
                className="flex-1 flex overflow-x-hidden whitespace-nowrap scroll-smooth"
              >
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`
                      flex items-center px-4 py-3 text-sm border-r border-slate-200 min-w-[200px] transition-colors
                      ${activeTabId === tab.id ? 'bg-white text-blue-600 font-bold' : 'bg-slate-100 text-slate-500 hover:bg-slate-50'}
                    `}
                  >
                    <File size={14} className="mr-2 shrink-0" />
                    <span className="truncate">{tab.title}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => scrollBadTabs('right')}
                className="p-3 bg-slate-200 hover:bg-slate-300 text-slate-600 z-10 shadow-md border-l border-slate-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="p-12 flex-1 flex flex-col items-center justify-center text-center bg-slate-50">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{activeTab.title}</h3>
                <p className="text-slate-600 text-lg italic border-l-4 border-red-400 pl-4 py-2 bg-red-50">
                  "All tab titles start with the same text just to <span className="font-bold underline decoration-wavy">ease</span> navigation."
                </p>
              </div>
            </div>
          </>
        )}

        {/* --- GOOD UX V1 (LIST) --- */}
        {mode === 'good_list' && (
          <div className="flex flex-1 h-[500px]">
            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search pages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {filteredTabs.map(tab => (
                  <Tooltip 
                    key={tab.id} 
                    content={tab.title} 
                    position="right" 
                    className="block w-full"
                  >
                    <button
                      onClick={() => setActiveTabId(tab.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded text-sm flex items-center
                        ${activeTabId === tab.id 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-100'}
                      `}
                    >
                      <File size={14} className="mr-2 opacity-50 shrink-0" />
                      <div className="truncate">
                        <span className="opacity-50 mr-1">...</span>
                        {tab.shortTitle}
                      </div>
                    </button>
                  </Tooltip>
                ))}
                {filteredTabs.length === 0 && (
                  <div className="p-4 text-center text-slate-400 text-sm">No pages found</div>
                )}
              </div>
            </div>
            <div className="flex-1 p-12 bg-white">
               <h3 className="text-2xl font-bold text-slate-800 mb-4">{activeTab.shortTitle}</h3>
               <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
               <div className="space-y-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-3 w-full bg-slate-50 rounded"></div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* --- GOOD UX CHROME --- */}
        {mode === 'good_chrome' && (
          <div className="flex flex-col h-full">
            <div className="bg-slate-100 border-b border-slate-200 flex items-center pr-2">
              {/* Tabs Container */}
              <div 
                ref={chromeTabsContainerRef}
                className="flex-1 flex overflow-x-auto scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {TABS.map(tab => (
                  <Tooltip 
                    key={tab.id} 
                    content={tab.title} 
                    position="bottom"
                    className="flex-shrink-0"
                  >
                    <button
                      ref={activeTabId === tab.id ? activeTabRef : null}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`
                        flex items-center px-4 py-3 text-sm border-r border-slate-200 min-w-[200px] transition-all whitespace-nowrap h-full
                        ${activeTabId === tab.id 
                          ? 'bg-white text-blue-600 font-bold border-t-2 border-t-blue-500' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-50'}
                      `}
                    >
                      <File size={14} className="mr-2 shrink-0" />
                      <span className="truncate">{tab.title}</span>
                    </button>
                  </Tooltip>
                ))}
              </div>

              {/* Chrome-style Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setSearchQuery(""); // Reset search on open
                  }}
                  className={`
                    ml-2 p-2 rounded-full transition-all duration-200
                    ${isDropdownOpen 
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200 shadow-inner' 
                      : 'hover:bg-slate-200 text-slate-600'}
                  `}
                >
                  <ChevronDown size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-slate-50">
                       <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 text-slate-400 w-4 h-4" />
                          <input 
                            autoFocus
                            type="text" 
                            placeholder="Search tabs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                            >
                              <X size={14}/>
                            </button>
                          )}
                       </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="py-1">
                        {filteredTabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTabId(tab.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`
                              w-full text-left px-4 py-2.5 text-sm flex items-center hover:bg-slate-50 transition-colors
                              ${activeTabId === tab.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-slate-700 border-l-4 border-transparent'}
                            `}
                          >
                            <File size={14} className={`mr-3 ${activeTabId === tab.id ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span className="truncate">{tab.title}</span>
                          </button>
                        ))}
                        {filteredTabs.length === 0 && (
                          <div className="p-4 text-center text-xs text-slate-400">No tabs match your search</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-12 flex-1 bg-white">
               <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  Active Tab
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-6">{activeTab.title}</h3>
               <div className="p-6 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-500">
                  Content for {activeTab.shortTitle} goes here...
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}