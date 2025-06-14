
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Keyboard, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useSupabaseQueries';

interface CodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCodeScanned: (code: string, product?: any) => void;
}

const CodeScannerDialog: React.FC<CodeScannerDialogProps> = ({
  open,
  onOpenChange,
  onCodeScanned,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('manual');
  const { data: products = [] } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      const product = products.find(p => p.code === manualCode.trim());
      onCodeScanned(manualCode.trim(), product);
      toast.success(product ? `Found product: ${product.name}` : 'Code scanned successfully');
      setManualCode('');
      onOpenChange(false);
    }
  };

  const handleQuickSearch = () => {
    if (manualCode.trim()) {
      const product = products.find(p => 
        p.code === manualCode.trim() || 
        p.sku.toLowerCase().includes(manualCode.toLowerCase()) ||
        p.name.toLowerCase().includes(manualCode.toLowerCase())
      );
      
      if (product) {
        onCodeScanned(product.code || product.sku, product);
        toast.success(`Found product: ${product.name}`);
        setManualCode('');
        onOpenChange(false);
      } else {
        toast.error('No product found matching the search');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Scan Product Code</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex space-x-2">
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex-1"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Manual Entry
            </Button>
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex-1"
              disabled
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera (Coming Soon)
            </Button>
          </div>

          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-code">Enter Product Code or SKU</Label>
                <Input
                  ref={inputRef}
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Type or paste code here..."
                  autoFocus
                />
                <p className="text-sm text-gray-500">
                  You can enter a product code, SKU, or product name
                </p>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={!manualCode.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Find Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleQuickSearch}
                  disabled={!manualCode.trim()}
                >
                  Quick Search
                </Button>
              </div>
            </form>
          )}

          {scanMode === 'camera' && (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Camera scanning will be available in a future update</p>
              <p className="text-sm text-gray-500 mt-2">
                Use manual entry for now to input product codes
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeScannerDialog;
