
import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 128,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'M',
}) => {
  if (!value) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ width: size, height: size }}
      >
        <p className="text-gray-500 text-sm text-center px-2">No code to generate</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <QRCode
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
