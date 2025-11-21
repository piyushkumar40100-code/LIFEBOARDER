import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return <div className={classes}>{children}</div>;
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  const baseClasses = 'mb-4';

  const classes = `
    ${baseClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return <div className={classes}>{children}</div>;
};

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  const classes = className.trim().replace(/\s+/g, ' ');

  return <div className={classes}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  const baseClasses = 'mt-4 pt-4 border-t border-gray-200';

  const classes = `
    ${baseClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return <div className={classes}>{children}</div>;
};

(Card as any).Header = CardHeader;
(Card as any).Body = CardBody;
(Card as any).Footer = CardFooter;

export default Card;