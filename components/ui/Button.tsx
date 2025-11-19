import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyle = "transition-all duration-300 font-medium rounded-full flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400",
    secondary: "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500",
    outline: "bg-transparent border border-white/30 text-white hover:bg-white/10",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base font-semibold"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
