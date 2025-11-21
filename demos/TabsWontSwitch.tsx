import React, { useState } from 'react';
import { AlertTriangle, Lock, Copy, Check, FileText, Package } from 'lucide-react';

export default function TabsWontSwitch() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const [activeTab, setActiveTab] = useState<'report' | 'info'>('report');
  const [showModal, setShowModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    serialNumber: '',
    complaint: ''
  });

  const hasData = formData.productName.length > 0 || 
                  formData.serialNumber.length > 0 || 
                  formData.complaint.length > 0;

  const handleTabClick = (targetTab: 'report' | 'info') => {
    if (targetTab === activeTab) return;

    if (mode === 'bad' && activeTab === 'report' && hasData) {
      // Blocking modal in bad mode
      setShowModal(true);
    } else {
      // Seamless switch in good mode
      setActiveTab(targetTab);
    }
  };

  const handleSwitchAnyway = () => {
    // The punishment: Switch, but reset the form
    setFormData({ productName: '', serialNumber: '', complaint: '' });
    setActiveTab('info');
    setShowModal(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tabs Won't Switch</h2>
          <p className="text-slate-600 mt-1">Navigation blocking vs. Persistent state.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          <button
             onClick={() => { 
               setMode('bad'); 
               setActiveTab('report'); 
               setFormData({productName: '', serialNumber: '', complaint: ''});
             }}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${mode === 'bad' ? 'bg-red-100 text-red-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Bad UX
          </button>
          <button
             onClick={() => { 
               setMode('good'); 
               setActiveTab('report');
               setFormData({productName: '', serialNumber: '', complaint: ''});
             }}
             className={`px-4 py-2 rounded text-sm font-medium transition-colors ${mode === 'good' ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Good UX
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] relative flex flex-col">
        {/* Tabs Header */}
        <div className="bg-slate-100 border-b border-slate-200 flex px-4 pt-4 space-x-2">
          <button
            onClick={() => handleTabClick('report')}
            className={`
              px-6 py-3 rounded-t-lg font-medium text-sm flex items-center relative
              ${activeTab === 'report' 
                ? 'bg-white border-t border-l border-r border-slate-200 text-blue-600 shadow-sm z-10 top-[1px]' 
                : 'bg-slate-200 text-slate-500 hover:bg-slate-100'}
            `}
          >
            <FileText size={16} className="mr-2" />
            Report Product
            {mode === 'good' && hasData && (
              <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide rounded border border-amber-200">
                Unsaved
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabClick('info')}
            className={`
              px-6 py-3 rounded-t-lg font-medium text-sm flex items-center relative
              ${activeTab === 'info' 
                ? 'bg-white border-t border-l border-r border-slate-200 text-blue-600 shadow-sm z-10 top-[1px]' 
                : 'bg-slate-200 text-slate-500 hover:bg-slate-100'}
            `}
          >
            <Package size={16} className="mr-2" />
            Your Product
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 bg-white relative">
          
          {activeTab === 'report' && (
            <div className="space-y-6 max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                 <h3 className="text-lg font-bold text-slate-800">File a Complaint</h3>
                 <p className="text-sm text-slate-500">
                   Please provide the exact details of the product. You can find your product details in <strong className="font-bold text-slate-700">Your Product</strong>.
                 </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exact Product Name</label>
                  <input 
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. TurboBlender 9000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                  <input 
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. TB-9000-X2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Complaint</label>
                  <textarea 
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    placeholder="Describe the issue..."
                  />
                </div>
                <div className="pt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-bold">
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6 max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="space-y-2">
                 <h3 className="text-lg font-bold text-slate-800">Product Reference</h3>
                 <p className="text-sm text-slate-500">Copy these details to your report.</p>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-6">
                <div className="flex justify-between items-center group">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</div>
                    <div className="font-mono text-lg text-slate-800">TurboBlender 9000</div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard("TurboBlender 9000", "name")}
                    className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded transition-colors"
                    title="Copy"
                  >
                    {copiedField === "name" ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                  </button>
                </div>

                <div className="h-px bg-slate-200 w-full"></div>

                <div className="flex justify-between items-center group">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Serial Number</div>
                    <div className="font-mono text-lg text-slate-800">TB-9000-X2</div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard("TB-9000-X2", "serial")}
                    className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded transition-colors"
                    title="Copy"
                  >
                    {copiedField === "serial" ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start">
                <Lock className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                This is a read-only view of your purchased product.
              </div>
            </div>
          )}
        </div>

        {/* BAD UX: The Punishing Modal */}
        {showModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full border-2 border-red-100 transform scale-100 animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Unsaved Changes</h3>
                <p className="text-slate-600 text-sm">
                  You can't switch if you have unfinished elements in your form, finish your form first.
                </p>
              </div>
              <div className="bg-slate-50 px-4 py-3 flex justify-between space-x-3 rounded-b-lg border-t border-slate-100">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSwitchAnyway}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 text-sm shadow-sm"
                >
                  Switch Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}