import React, { ReactNode } from 'react';

interface BoxWithShadowsProps {
  children: ReactNode;
  colorShades: string[];
  boxBorder: string; // Array of colors for the layered boxes
}

const BoxWithShadows: React.FC<BoxWithShadowsProps> = ({ children, colorShades, boxBorder }) => {
  return (
    <div className='relative w-full h-full'>
      {/* Back box (lighter) */}
      <div className={`absolute bottom-2 left-2 w-full h-full ${colorShades[2]} border ${boxBorder} rounded-lg shadow-lg`}></div>
      
      {/* Middle box (medium shade) */}
      <div className={`absolute bottom-1 left-1 w-full h-full ${colorShades[1]} border  ${boxBorder} rounded-lg shadow-lg`}></div>
      
      {/* Front box (darker shade) */}
      <div className={`relative w-full h-full ${colorShades[0]} rounded-lg shadow-lg`}>
        {children}
      </div>
    </div>
  );
};

export default BoxWithShadows;
