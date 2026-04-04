import React from 'react';
import { cn } from '../lib/utils';

const GlassCard = ({ children, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300 hover:shadow-2xl cursor-default",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
