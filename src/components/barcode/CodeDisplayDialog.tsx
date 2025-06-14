
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, QrCode, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import BarcodeGenerator from './BarcodeGenerator';
import QRCodeGenerator from './QRCodeGenerator';

interface CodeDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCode: string;
  productName: string;
}

const CodeDisplayDialog: React.FC<CodeDisplayDialogProps> = ({
  open,
  onOpenChange,
  productCode,
  productName,
}) => {
  const [activeTab, setActiveTab] = useState('barcode');

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(productCode);
      toast.success('Product code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas && activeTab === 'barcode') {
      const link = document.createElement('a');
      link.download = `${productName.replace(/\s+/g, '_')}_barcode.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (activeTab === 'qrcode') {
      const svg = document.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.download = `${productName.replace(/\s+/g, '_')}_qrcode.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
    toast.success('Code downloaded successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Product Codes - {productName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Product Code:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                  {productCode}
                </code>
                <Button size="sm" variant="ghost" onClick={handleCopyCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="barcode" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Barcode</span>
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="flex items-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="barcode" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                <BarcodeGenerator value={productCode} />
                <p className="text-sm text-gray-600 text-center">
                  Linear barcode for traditional scanning systems
                </p>
              </div>
            </TabsContent>

            <TabsContent value="qrcode" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                <QRCodeGenerator 
                  value={JSON.stringify({
                    code: productCode,
                    name: productName,
                    type: 'product'
                  })}
                  size={200}
                />
                <p className="text-sm text-gray-600 text-center">
                  QR code with embedded product information
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download {activeTab === 'barcode' ? 'Barcode' : 'QR Code'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDisplayDialog;
