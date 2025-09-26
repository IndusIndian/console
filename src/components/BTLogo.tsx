import React from 'react';

interface BTLogoProps {
  size?: number;
  className?: string;
}

const BTLogo: React.FC<BTLogoProps> = ({ 
  size = 40, 
  className 
}) => {
  return (
    <img
      src="/bt-logo-official.svg"
      alt="BT Logo"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  );
};

export default BTLogo;
