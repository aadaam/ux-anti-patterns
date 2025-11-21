import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  variant?: 'dark' | 'light';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  className = "",
  variant = 'dark'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;
      const offset = 8; // Space between trigger and tooltip

      switch (position) {
        case 'top':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          break;
      }
      setCoords({ top, left });
      setIsVisible(true);
    }
  };

  const themeClasses = variant === 'dark' 
    ? 'bg-slate-900 text-white shadow-xl' 
    : 'bg-white text-slate-900 border border-slate-200 shadow-xl';

  return (
    <>
      <div 
        ref={triggerRef} 
        className={className}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={() => setIsVisible(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          className={`fixed z-[9999] px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100 ${themeClasses}`}
          style={{ 
            top: coords.top, 
            left: coords.left,
            transform: 
              position === 'top' ? 'translate(-50%, -100%)' :
              position === 'bottom' ? 'translate(-50%, 0%)' :
              position === 'left' ? 'translate(-100%, -50%)' :
              'translate(0%, -50%)'
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;