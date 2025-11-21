import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, Briefcase, StickyNote, User, Clock, ArrowRight } from 'lucide-react';

// --- Mock Data ---
interface Lead {
  id: number;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  lastMessage: string;
  notes: string;
  lastUpdated: string;
}

const DATA: Lead[] = [
  { id: 1, name: "Alice Freeman", role: "CTO", company: "CloudScale Inc", email: "alice@cloudscale.io", phone: "+1 (555) 010-9988", city: "Seattle", country: "USA", status: "Qualified", lastMessage: "Can we reschedule the deployment review?", notes: "Very interested in the enterprise plan. Needs GDPR compliance details.", lastUpdated: "2h ago" },
  { id: 2, name: "Bob Chen", role: "Product Manager", company: "FinTech Solutions", email: "bob.chen@fintech.com", phone: "+1 (555) 012-3456", city: "New York", country: "USA", status: "Contacted", lastMessage: "Thanks for the demo yesterday.", notes: "Budget cycle starts next quarter. Keep warm.", lastUpdated: "1d ago" },
  { id: 3, name: "Carol Danvers", role: "VP Engineering", company: "Stark Industries", email: "c.danvers@stark.net", phone: "+1 (555) 999-8888", city: "San Francisco", country: "USA", status: "New", lastMessage: "Looking for a scalable logging solution.", notes: "High priority lead. Direct referral from board member.", lastUpdated: "30m ago" },
  { id: 4, name: "David Kim", role: "DevOps Lead", company: "HealthPlus", email: "dkim@healthplus.org", phone: "+1 (555) 444-5555", city: "Seoul", country: "South Korea", status: "Lost", lastMessage: "We decided to build in-house.", notes: "Feature set didn't match legacy requirements. Revisit in 6 months.", lastUpdated: "1w ago" },
  { id: 5, name: "Elena Rodriguez", role: "Director of IT", company: "Global Logistics", email: "elena.r@logistics.co", phone: "+34 91 123 4567", city: "Madrid", country: "Spain", status: "Qualified", lastMessage: "Please send the contract draft.", notes: "Negotiating 3 year term. Need legal review.", lastUpdated: "4h ago" },
  { id: 6, name: "Frank Castle", role: "Security Consultant", company: "Freelance", email: "punisher@mail.com", phone: "+1 (555) 666-7777", city: "Chicago", country: "USA", status: "New", lastMessage: "Inquiring about penetration testing tools.", notes: "Specific interest in automated vulnerability scanning.", lastUpdated: "5h ago" },
];

export default function ListVsTable() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">List vs. Table</h2>
          <p className="text-slate-600 mt-1">
            Horizontal scrolling overload vs. Master-Detail efficiency.
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
              mode === 'good' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Good UX
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative flex flex-col">
        {mode === 'bad' ? <BadUX /> : <GoodUX />}
      </div>

      <div className={`p-6 rounded-lg border text-sm shrink-0 ${mode === 'bad' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
        <h3 className="font-bold mb-2">UX Lesson</h3>
        {mode === 'bad' 
          ? "Tables with too many columns force horizontal scrolling, hiding context. Important fields like 'Notes' or 'Last Message' are often cut off or require awkward scrolling to read."
          : "A Master-Detail view uses screen real estate effectively. The searchable list (Master) provides quick navigation, while the detail pane (Detail) shows the full context of a record without scrolling fatigue."}
      </div>
    </div>
  );
}

// --- BAD UX: The Infinite Scroll Table ---
function BadUX() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1200px]"> {/* Force width to trigger scroll */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-16">ID</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-48">Name</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-48">Role / Company</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-48">Email</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-40">Phone</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-40">Location</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-32">Status</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-64">Last Message</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-64">Notes</th>
              <th className="p-4 font-semibold text-slate-700 text-sm border-b border-slate-200 w-32">Updated</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((lead, i) => (
              <tr key={lead.id} className={`border-b border-slate-100 hover:bg-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className="p-4 text-sm text-slate-500">{lead.id}</td>
                <td className="p-4 text-sm font-bold text-slate-800">{lead.name}</td>
                <td className="p-4 text-sm text-slate-600">
                  <div className="font-medium">{lead.role}</div>
                  <div className="text-xs text-slate-400">{lead.company}</div>
                </td>
                <td className="p-4 text-sm text-blue-600 hover:underline">{lead.email}</td>
                <td className="p-4 text-sm text-slate-600">{lead.phone}</td>
                <td className="p-4 text-sm text-slate-600">{lead.city}, {lead.country}</td>
                <td className="p-4 text-sm">
                   <StatusBadge status={lead.status} />
                </td>
                <td className="p-4 text-sm text-slate-600">
                  <div className="truncate w-60" title={lead.lastMessage}>{lead.lastMessage}</div>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  <div className="truncate w-60" title={lead.notes}>{lead.notes}</div>
                </td>
                <td className="p-4 text-sm text-slate-500 whitespace-nowrap">{lead.lastUpdated}</td>
              </tr>
            ))}
            {/* Add fake rows to make scrolling feel even more necessary */}
            {[...Array(10)].map((_, i) => (
               <tr key={`fake-${i}`} className="border-b border-slate-100 bg-slate-50/10 opacity-50">
                  <td className="p-4 text-sm text-slate-300">{i + 10}</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
                  <td className="p-4 text-sm text-slate-300">--</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- GOOD UX: Master-Detail View ---
function GoodUX() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");

  const selectedItem = DATA.find(d => d.id === selectedId) || DATA[0];

  const filteredData = useMemo(() => {
    return DATA.filter(item => {
      const term = search.toLowerCase();
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(term)
      );
    });
  }, [search]);

  return (
    <div className="flex h-full">
      {/* Left Panel: Master List */}
      <div className="w-1/3 min-w-[300px] border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="relative">
             <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search leads..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-all focus:bg-white"
             />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
           {filteredData.map(item => (
             <button
               key={item.id}
               onClick={() => setSelectedId(item.id)}
               className={`w-full text-left p-4 border-b border-slate-100 transition-all hover:bg-white group relative
                 ${selectedId === item.id ? 'bg-white shadow-sm z-10 border-l-4 border-l-blue-600 pl-[13px]' : 'border-l-4 border-l-transparent text-slate-600'}
               `}
             >
               <div className="flex justify-between items-start mb-1">
                 <span className={`font-bold text-sm ${selectedId === item.id ? 'text-blue-900' : 'text-slate-800'}`}>{item.name}</span>
                 <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.lastUpdated}</span>
               </div>
               <div className="text-xs text-slate-500 mb-2">{item.role} at {item.company}</div>
               <div className="flex items-center justify-between">
                 <span className="text-xs text-slate-400 truncate max-w-[120px]">{item.city}</span>
                 <StatusBadge status={item.status} size="small" />
               </div>
             </button>
           ))}
           {filteredData.length === 0 && (
             <div className="p-8 text-center text-slate-400 text-sm">
               No leads match "{search}"
             </div>
           )}
        </div>
      </div>

      {/* Right Panel: Detail View */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300" key={selectedItem.id}>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedItem.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h2>
                  <div className="text-slate-500 flex items-center gap-2 mt-1">
                    <Briefcase size={14} />
                    {selectedItem.role} @ <span className="font-medium text-slate-700">{selectedItem.company}</span>
                  </div>
                </div>
             </div>
             <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selectedItem.status} />
                <span className="text-xs text-slate-400 flex items-center">
                  <Clock size={12} className="mr-1" /> Updated {selectedItem.lastUpdated}
                </span>
             </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
             {/* Contact Info */}
             <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                 <User size={16} className="mr-2" /> Contact Details
               </h4>
               
               <div className="group flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                 <Mail className="text-slate-400 w-5 h-5 mr-3" />
                 <div>
                   <div className="text-xs text-slate-400 font-medium">Email Address</div>
                   <div className="text-sm text-blue-600">{selectedItem.email}</div>
                 </div>
               </div>

               <div className="group flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                 <Phone className="text-slate-400 w-5 h-5 mr-3" />
                 <div>
                   <div className="text-xs text-slate-400 font-medium">Phone Number</div>
                   <div className="text-sm text-slate-700">{selectedItem.phone}</div>
                 </div>
               </div>

               <div className="group flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                 <MapPin className="text-slate-400 w-5 h-5 mr-3" />
                 <div>
                   <div className="text-xs text-slate-400 font-medium">Location</div>
                   <div className="text-sm text-slate-700">{selectedItem.city}, {selectedItem.country}</div>
                 </div>
               </div>
             </div>

             {/* Activity / Notes */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                 <StickyNote size={16} className="mr-2" /> Activity & Notes
                </h4>
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                   <div className="text-xs text-amber-700 font-bold mb-1">INTERNAL NOTES</div>
                   <p className="text-sm text-slate-700 leading-relaxed">
                     {selectedItem.notes}
                   </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                   <div className="text-xs text-blue-700 font-bold mb-1">LAST MESSAGE</div>
                   <p className="text-sm text-slate-700 italic">
                     "{selectedItem.lastMessage}"
                   </p>
                </div>
             </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">
               Archive Lead
            </button>
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm flex items-center">
               Send Email <ArrowRight size={16} className="ml-2" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, size = 'normal' }: { status: string, size?: 'normal' | 'small' }) {
  const styles = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-purple-100 text-purple-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Lost': 'bg-slate-100 text-slate-600',
  }[status] || 'bg-slate-100 text-slate-600';

  const sizeClasses = size === 'small' 
    ? 'px-1.5 py-0.5 text-[10px]' 
    : 'px-3 py-1 text-xs';

  return (
    <span className={`font-bold rounded-full ${styles} ${sizeClasses}`}>
      {status}
    </span>
  );
}