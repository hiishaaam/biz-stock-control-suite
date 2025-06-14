
import React from 'react';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

interface BarcodeGeneratorProps {
  value: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC';
  width?: number;
  height?: number;
  displayValue?: boolean;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  displayValue = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize: 14,
          textMargin: 8,
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, format, width, height, displayValue]);

  if (!value) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No code to generate</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas ref={canvasRef} className="border border-gray-200 rounded" />
    </div>
  );
};

export default BarcodeGenerator;
