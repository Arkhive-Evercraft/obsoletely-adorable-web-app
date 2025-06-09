import React from 'react';

export interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const UserIcon: React.FC<IconProps> = ({ width = 16, height = 16, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={width} 
    height={height} 
    fill="currentColor" 
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ width = 16, height = 16, className }) => (
  <svg 
    width={width} 
    height={height} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
