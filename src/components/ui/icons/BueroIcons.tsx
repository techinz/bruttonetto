import React from 'react';

interface IconProps {
    width?: number;
    height?: number;
    className?: string;
}

export const CurrencyIcon: React.FC<IconProps> = ({ width = 16, height = 16, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ width = 16, height = 16, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
        <path d="M9 21L9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const OfficeIcon: React.FC<IconProps> = ({ width = 16, height = 16, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 13L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const ManualInputIcon: React.FC<IconProps> = ({ width = 18, height = 18, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8C15.4477 8 15 8.44772 15 9C15 9.55228 15.4477 10 16 10Z" fill="currentColor" />
        <path d="M16 16C16.5523 16 17 15.5523 17 15C17 14.4477 16.5523 14 16 14C15.4477 14 15 14.4477 15 15C15 15.5523 15.4477 16 16 16Z" fill="currentColor" />
        <path d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z" fill="currentColor" />
        <path d="M8 16C8.55228 16 9 15.5523 9 15C9 14.4477 8.55228 14 8 14C7.44772 14 7 14.4477 7 15C7 15.5523 7.44772 16 8 16Z" fill="currentColor" />
    </svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({ width = 18, height = 18, className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M5 17H4C3.44772 17 3 16.5523 3 16V8C3 7.44772 3.44772 7 4 7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5" y="5" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);