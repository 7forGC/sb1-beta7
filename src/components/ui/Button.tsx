import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};