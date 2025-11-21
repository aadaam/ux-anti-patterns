import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, X, Calendar, Ruler } from 'lucide-react';

// --- Mock Data ---
interface User {
  id: number;
  name: string;
  email: string;
  city: string;
  address: string;
  shoeSize: number;
  lastUpdated: string;
}

const DATA: User[] = [
  { id: 1, name: "Alex Johnson", email: "alex.j@example.com", city: "New York", address: "123 Broadway Ave", shoeSize: 9, lastUpdated: "2024-03-10" },
  { id: 2, name: "Sarah Connor", email: "sarah.c@skynet.net", city: "Los Angeles", address: "456 Cyberdyne Ln", shoeSize: 7, lastUpdated: "2024-03-09" },
  { id: 3, name: "Michael Smith", email: "mike.smith@work.org", city: "Chicago", address: "789 Windy City Blvd", shoeSize: 10, lastUpdated: "2024-02-15" },
  { id: 4, name: "Emily Davis", email: "emily.d@school.edu", city: "Boston", address: "321 Harvard Sq", shoeSize: 6, lastUpdated: "2024-03-01" },
  { id: 5, name: "David Brown", email: "david.b@startup.io", city: "San Francisco", address: "654 Market St", shoeSize: 11, lastUpdated: "2024-03-12" },
  { id: 6, name: "Jessica Wilson", email: "jess.w@creative.design", city: "Austin", address: "987 6th St", shoeSize: 8, lastUpdated: "2024-01-20" },
  { id: 7, name: "Chris Lee", email: "chris.lee@tech.corp", city: "Seattle", address: "159 Pike Pl", shoeSize: 9, lastUpdated: "2024-03-11" },
  { id: 8, name: "Pat Taylor", email: "pat.t@freelance.net", city: "Portland", address: "753 Burnside St", shoeSize: 8, lastUpdated: "2024-02-28" },
];

export default function FilterByOne() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');

  // State for BAD UX (Column Filtering)
  const [badFilters, setBadFilters] = useState<{column: string, value: string}[]>([]);
  const [tempColumn, setTempColumn] = useState<string>("name");
  const [tempValue, setTempValue] = useState<string>("");

  // State for GOOD UX (Global Search + Facets)
  const [globalSearch, setGlobalSearch] = useState("");
  const [shoeSizeFilter, setShoeSizeFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // --- Reset on Mode Switch ---
  const handleModeChange = (newMode: 'bad' | 'good') => {
    setMode(newMode);
    setBadFilters([]);
    setGlobalSearch("");
    setShoeSizeFilter("all");
    setTimeFilter("all");
    setTempColumn("name");
    setTempValue("");
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    if (mode === 'bad') {
      if (badFilters.length === 0) return DATA;
      return DATA.filter(item => {
        return badFilters.every(filter => {
          const itemValue = String((item as any)[filter.column]).toLowerCase();
          return itemValue.includes(filter.value.toLowerCase());
        });
      });
    } else {
      // Good Mode Logic
      return DATA.filter(item => {
        // Global Search matches ANY string field
        const matchesSearch = 
          item.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.city.toLowerCase().includes(globalSearch.toLowerCase()) ||
          item.address.toLowerCase().includes(globalSearch.toLowerCase());
        
        // Facet Filters
        let matchesShoe = true;
        if (shoeSizeFilter !== 'all') {
          if (shoeSizeFilter === 'small') matchesShoe = item.shoeSize <= 7;
          if (shoeSizeFilter === 'medium') matchesShoe = item.shoeSize > 7 && item.shoeSize <= 9;
          if (shoeSizeFilter === 'large') matchesShoe = item.shoeSize > 9;
        }

        let matchesTime = true;
        if (timeFilter !== 'all') {
          const date = new Date(item.lastUpdated);
          const now = new Date('2024-03-12'); // Static "Now" for demo consistency
          const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
          
          if (timeFilter === 'week') matchesTime = daysDiff <= 7;
          if (timeFilter === 'month') matchesTime = daysDiff <= 30;
          if (timeFilter === 'older') matchesTime = daysDiff > 30;
        }

        return matchesSearch && matchesShoe && matchesTime;
      });
    }
  }, [mode, badFilters, globalSearch, shoeSizeFilter, timeFilter]);

  // --- BAD UX Handlers ---
  const addBadFilter = () => {
    if (tempValue.trim()) {
      setBadFilters([...badFilters, { column: tempColumn, value: tempValue }]);
      setTempValue("");
    }
  };

  const removeBadFilter = (index: number) => {
    setBadFilters(badFilters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Filter by One</h2>
          <p className="text-slate-600 mt-1">
            Explicit column filters vs. Intelligent global search.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-sm">
          <button
            onClick={() => handleModeChange('bad')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              mode === 'bad' ? 'bg-red-100 text-red-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bad UX
          </button>
          <button
            onClick={() => handleModeChange('good')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              mode === 'good' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Good UX
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-h-[500px]">
        
        {/* --- Controls Area --- */}
        <div className={`p-6 border-b border-slate-200 transition-colors duration-300 ${mode === 'bad' ? 'bg-slate-50' : 'bg-white'}`}>
          
          {/* BAD UX: Explicit Filter Builder */}
          {mode === 'bad' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filter Builder</div>
              <div className="flex items-end space-x-2">
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs text-slate-500 mb-1">Column</label>
                  <select 
                    value={tempColumn}
                    onChange={(e) => setTempColumn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-slate-200 outline-none bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="city">City</option>
                    <option value="address">Address</option>
                    <option value="shoeSize">Shoe Size</option>
                  </select>
                </div>
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs text-slate-500 mb-1">Contains Value</label>
                  <input 
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                    placeholder="Type to filter..."
                    onKeyDown={(e) => e.key === 'Enter' && addBadFilter()}
                  />
                </div>
                <button 
                  onClick={addBadFilter}
                  disabled={!tempValue.trim()}
                  className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="inline mr-1"/> Add Filter
                </button>
              </div>

              {/* Active Filters List */}
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {badFilters.length === 0 && (
                  <span className="text-xs text-slate-400 italic py-1">No active filters. Showing all data.</span>
                )}
                {badFilters.map((f, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs border border-blue-200">
                    <span className="font-semibold mr-1">{f.column}:</span> "{f.value}"
                    <button onClick={() => removeBadFilter(i)} className="ml-2 hover:text-red-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GOOD UX: Global Search + Facets */}
          {mode === 'good' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search users by name, email, city..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  autoFocus
                />
              </div>
              
              {/* Facets - Appear when searching or always available but secondary */}
              <div className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ease-in-out ${globalSearch ? 'opacity-100 max-h-20' : 'opacity-50 grayscale max-h-20'}`}>
                <div className="flex items-center text-sm text-slate-500 font-medium mr-2">
                  <Filter size={14} className="mr-1"/> Refine results:
                </div>
                
                <div className="relative group">
                  <select 
                    value={shoeSizeFilter}
                    onChange={(e) => setShoeSizeFilter(e.target.value)}
                    disabled={!globalSearch}
                    className="appearance-none pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm hover:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-50 cursor-pointer"
                  >
                    <option value="all">Any Size</option>
                    <option value="small">Small (≤ 7)</option>
                    <option value="medium">Medium (8-9)</option>
                    <option value="large">Large (10+)</option>
                  </select>
                  <Ruler className="absolute left-3 top-2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative group">
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    disabled={!globalSearch}
                    className="appearance-none pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm hover:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-50 cursor-pointer"
                  >
                    <option value="all">Any Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="older">Older</option>
                  </select>
                  <Calendar className="absolute left-3 top-2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
                
                {!globalSearch && <span className="text-xs text-slate-400 italic ml-2">Type to enable filters</span>}
              </div>
            </div>
          )}
        </div>

        {/* --- Table Area --- */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">Email</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200">City</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200 hidden md:table-cell">Address</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200 text-center">Shoe Size</th>
                <th className="p-4 font-semibold text-slate-600 text-sm border-b border-slate-200 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user, idx) => (
                  <tr key={user.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="p-4 text-sm font-medium text-slate-800">{user.name}</td>
                    <td className="p-4 text-sm text-slate-600">{user.email}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{user.city}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 hidden md:table-cell">{user.address}</td>
                    <td className="p-4 text-sm text-slate-600 text-center">{user.shoeSize}</td>
                    <td className="p-4 text-sm text-slate-500 text-right font-mono">{user.lastUpdated}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                         <Search className="text-slate-300 w-6 h-6"/>
                       </div>
                       <p>No results match your filters.</p>
                       <button 
                         onClick={() => mode === 'bad' ? setBadFilters([]) : setGlobalSearch("")}
                         className="mt-2 text-blue-600 hover:underline text-sm"
                       >
                         Clear filters
                       </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50 p-3 text-xs text-slate-500 border-t border-slate-200 flex justify-between">
           <span>Showing {filteredData.length} of {DATA.length} records</span>
           <span>Mock Data</span>
        </div>
      </div>

      <div className={`p-6 rounded-lg border text-sm ${mode === 'bad' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
        <h3 className="font-bold mb-2">UX Lesson</h3>
        {mode === 'bad' 
          ? "Forcing users to explicitly select a column before typing a search term adds unnecessary cognitive load and clicks. It feels like a database query tool, not a human interface."
          : "A 'Magic Search' that works across all fields allows users to start typing immediately. Specific facets (like ranges or dates) are best presented as secondary refinements, appearing contextually when needed."}
      </div>
    </div>
  );
}