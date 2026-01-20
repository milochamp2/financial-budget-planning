'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-2xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-violet-600 to-purple-600
      hover:from-violet-500 hover:to-purple-500
      text-white shadow-lg shadow-violet-500/25
      focus:ring-violet-500
    `,
    secondary: `
      bg-white/10 hover:bg-white/20
      text-white border border-white/10
      focus:ring-white/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-rose-600
      hover:from-red-500 hover:to-rose-500
      text-white shadow-lg shadow-red-500/25
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent hover:bg-white/10
      text-gray-400 hover:text-white
      focus:ring-white/50
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
