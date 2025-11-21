import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';

// Custom "System" Alert Component to guarantee visibility
const SystemAlert = ({ message, onClose }: { message: string | null, onClose: () => void }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white border border-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded w-96 max-w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="font-semibold text-sm text-slate-700">System Message</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex items-start space-x-4">
          <div className="bg-red-100 p-2 rounded-full shrink-0">
            <AlertTriangle className="text-red-600 w-6 h-6" />
          </div>
          <div className="text-sm text-slate-700 whitespace-pre-line font-medium">
            {message}
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 flex justify-end border-t border-slate-100">
          <button 
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FormFromHell() {
  const [mode, setMode] = useState<'bad_v1' | 'bad_v2' | 'good'>('bad_v1');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">The Form from Hell</h2>
          <p className="text-slate-600 mt-2">
            Exploring validation user experience (or lack thereof).
          </p>
        </div>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          {[
            { id: 'bad_v1', label: 'Bad V1 (Alert on Submit)' },
            { id: 'bad_v2', label: 'Bad V2 (Alert on Blur)' },
            { id: 'good', label: 'Good (Inline)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === m.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-xl mx-auto relative min-h-[450px]">
        {mode === 'bad_v1' && <BadFormV1 />}
        {mode === 'bad_v2' && <BadFormV2 />}
        {mode === 'good' && <GoodForm />}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-sm text-blue-800">
        <h3 className="font-bold mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> UX Lesson</h3>
        {mode === 'bad_v1' && "Validation only at the end forces users to recall context and fix everything at once, often leading to frustration and abandonment."}
        {mode === 'bad_v2' && "Using blocking alerts on blur interrupts the user's flow. It feels punitive and prevents them from quickly tabbing through fields to fill them out active-linearly."}
        {mode === 'good' && "Inline validation provides immediate, non-intrusive feedback, allowing users to fix errors in context without breaking flow."}
      </div>
    </div>
  );
}

function InputGroup({ label, name, type = "text", placeholder, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-200 outline-none" 
        autoComplete="off"
        {...props}
      />
    </div>
  );
}

// --- BAD V1: Alert at the end ---
function BadFormV1() {
  const [values, setValues] = useState({ email: '', phone: '', password: '', confirm: '' });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errors = [];
    if (!values.email.endsWith('.com')) {
      errors.push("• Email address must end in .com");
    }
    if (!/^\d+$/.test(values.phone)) {
      errors.push("• Phone number format is invalid (digits only)");
    }
    if (values.password.length === 0) {
      errors.push("• Password is required");
    }
    if (values.password !== values.confirm) {
      errors.push("• Passwords do not match");
    }

    if (errors.length > 0) {
      setAlertMessage("FORM SUBMISSION FAILED:\n\n" + errors.join("\n"));
    } else {
      setAlertMessage("Success! Form submitted.");
    }
  };

  return (
    <>
      <SystemAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <h3 className="text-lg font-bold text-red-600 mb-4">Version 1: The Gatekeeper</h3>
        <InputGroup 
          label="Email Address" 
          name="email" 
          value={values.email}
          onChange={handleChange}
          placeholder="user@example.com" 
        />
        <InputGroup 
          label="Phone Number" 
          name="phone" 
          value={values.phone}
          onChange={handleChange}
          placeholder="1234567890" 
        />
        <InputGroup 
          label="Password" 
          name="password" 
          type="password" 
          value={values.password}
          onChange={handleChange}
        />
        <InputGroup 
          label="Confirm Password" 
          name="confirm" 
          type="password" 
          value={values.confirm}
          onChange={handleChange}
        />
        <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded hover:bg-slate-800 active:bg-slate-700 transition-colors">
          Submit
        </button>
      </form>
    </>
  );
}

// --- BAD V2: Alert immediately on blur ---
function BadFormV2() {
  const [values, setValues] = useState({ email: '', phone: '', password: '', confirm: '' });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: string) => {
    if (field === 'email') {
      if (!values.email.endsWith('.com')) {
        setAlertMessage("Error: Email must end with .com!");
      }
    }
    if (field === 'phone') {
      if (!/^\d+$/.test(values.phone)) {
         setAlertMessage("Error: Phone number usually contains digits!");
      }
    }
    if (field === 'confirm') {
      if (values.password !== values.confirm) {
        setAlertMessage("Error: Passwords do not match!");
      }
    }
  };

  return (
    <>
      <SystemAlert message={alertMessage} onClose={() => setAlertMessage(null)} />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} autoComplete="off">
        <h3 className="text-lg font-bold text-red-600 mb-4">Version 2: The Nag</h3>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input 
            name="email" 
            type="text"
            value={values.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none" 
            onBlur={() => handleBlur('email')}
            placeholder="Must end in .com"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Phone</label>
          <input 
            name="phone" 
            type="text"
            value={values.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none" 
            onBlur={() => handleBlur('phone')}
            placeholder="Digits only"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input 
            type="password"
            name="password" 
            value={values.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none" 
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
          <input 
            type="password"
            name="confirm" 
            value={values.confirm}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-200 outline-none" 
            onBlur={() => handleBlur('confirm')}
            autoComplete="off"
          />
        </div>
        <button className="w-full py-2 bg-slate-900 text-white rounded hover:bg-slate-800 opacity-50 cursor-not-allowed" disabled>
          Submit (Fix errors first)
        </button>
      </form>
    </>
  );
}

// --- GOOD: Inline errors ---
function GoodForm() {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState({ email: '', phone: '', password: '', confirm: '' });

  const errors = {
    email: values.email && !values.email.includes('@') ? "Please enter a valid email" : (!values.email.endsWith('.com') && values.email.includes('@') ? "We only accept .com domains" : null),
    phone: values.phone && !/^\d{10}$/.test(values.phone) ? "Please enter a 10-digit phone number" : null,
    confirm: values.confirm && values.confirm !== values.password ? "Passwords do not match" : null
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const getInputClass = (name: keyof typeof errors) => `
    w-full p-2 border rounded transition-colors outline-none focus:ring-2
    ${touched[name] && errors[name] 
      ? 'border-red-500 bg-red-50 focus:ring-red-200 text-red-900' 
      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'}
  `;

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()} autoComplete="off">
      <h3 className="text-lg font-bold text-green-600 mb-4">Version 3: The Helper</h3>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <div className="relative">
          <input 
            name="email" 
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClass('email')}
            placeholder="you@company.com"
            autoComplete="off"
          />
          {touched.email && !errors.email && values.email && (
            <CheckCircle className="absolute right-3 top-2.5 text-green-500 w-5 h-5" />
          )}
        </div>
        {touched.email && errors.email && (
          <p className="text-xs text-red-600 flex items-center mt-1">
            <AlertCircle className="w-3 h-3 mr-1"/> {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Phone</label>
        <input 
          name="phone" 
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass('phone')}
          placeholder="1234567890"
          autoComplete="off"
        />
        {touched.phone && errors.phone && (
           <p className="text-xs text-red-600 flex items-center mt-1">
           <AlertCircle className="w-3 h-3 mr-1"/> {errors.phone}
         </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input 
          type="password"
          name="password" 
          value={values.password}
          onChange={handleChange}
          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-200 outline-none"
          autoComplete="off"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
        <input 
          type="password"
          name="confirm" 
          value={values.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClass('confirm')}
          autoComplete="off"
        />
        {touched.confirm && errors.confirm && (
           <p className="text-xs text-red-600 flex items-center mt-1">
           <AlertCircle className="w-3 h-3 mr-1"/> {errors.confirm}
         </p>
        )}
      </div>

      <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Create Account
      </button>
    </form>
  );
}
