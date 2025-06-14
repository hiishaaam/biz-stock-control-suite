
import { jsPDF } from 'jspdf';

export interface ReportData {
  inventory?: any[];
  sales?: any[];
  stockMovement?: any[];
  lowStock?: any[];
}

export const generateInventoryReport = (data: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Inventory Summary Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Report content
  let yPosition = 65;
  doc.setFontSize(14);
  doc.text('Current Stock Overview', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  // Sample inventory data
  const inventoryData = [
    { name: 'iPhone 15 Pro', category: 'Electronics', stock: 45, value: '$44,955' },
    { name: 'Nike Air Max 90', category: 'Footwear', stock: 23, value: '$2,990' },
    { name: 'MacBook Pro 16"', category: 'Electronics', stock: 12, value: '$29,988' },
    { name: 'Coffee Beans Premium', category: 'Food & Beverage', stock: 156, value: '$3,900' }
  ];
  
  inventoryData.forEach((item, index) => {
    doc.text(`${item.name} (${item.category})`, 20, yPosition);
    doc.text(`Stock: ${item.stock} | Value: ${item.value}`, 20, yPosition + 8);
    yPosition += 20;
  });
  
  // Summary
  yPosition += 10;
  doc.setFontSize(12);
  doc.text('Summary:', 20, yPosition);
  doc.setFontSize(10);
  doc.text('Total Items: 236', 20, yPosition + 15);
  doc.text('Total Value: $81,833', 20, yPosition + 25);
  
  return doc;
};

export const generateSalesReport = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Sales Performance Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 65;
  doc.setFontSize(14);
  doc.text('Sales Analytics', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  const salesData = [
    { period: 'January 2024', revenue: '$4,000', items: 240 },
    { period: 'February 2024', revenue: '$3,000', items: 198 },
    { period: 'March 2024', revenue: '$5,000', items: 310 },
    { period: 'April 2024', revenue: '$4,500', items: 278 }
  ];
  
  salesData.forEach((period) => {
    doc.text(`${period.period}: Revenue ${period.revenue} | Items Sold: ${period.items}`, 20, yPosition);
    yPosition += 12;
  });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text('Key Metrics:', 20, yPosition);
  doc.setFontSize(10);
  doc.text('Total Revenue: $54,230', 20, yPosition + 15);
  doc.text('Growth Rate: +12%', 20, yPosition + 25);
  doc.text('Average Order Value: $43.52', 20, yPosition + 35);
  
  return doc;
};

export const generateStockMovementReport = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Stock Movement Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 65;
  doc.setFontSize(14);
  doc.text('Recent Stock Movements', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  const movements = [
    { item: 'iPhone 15 Pro', type: 'IN', quantity: 25, date: '2024-06-10' },
    { item: 'Nike Air Max 90', type: 'OUT', quantity: 15, date: '2024-06-11' },
    { item: 'MacBook Pro 16"', type: 'IN', quantity: 8, date: '2024-06-12' },
    { item: 'Wireless Headphones', type: 'OUT', quantity: 12, date: '2024-06-13' }
  ];
  
  movements.forEach((movement) => {
    const direction = movement.type === 'IN' ? 'Received' : 'Dispatched';
    doc.text(`${movement.date}: ${direction} ${movement.quantity} units of ${movement.item}`, 20, yPosition);
    yPosition += 12;
  });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text('Movement Summary:', 20, yPosition);
  doc.setFontSize(10);
  doc.text('Total Items Received: 33', 20, yPosition + 15);
  doc.text('Total Items Dispatched: 27', 20, yPosition + 25);
  doc.text('Net Stock Change: +6', 20, yPosition + 35);
  
  return doc;
};

export const generateLowStockReport = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Low Stock Alert Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  let yPosition = 65;
  doc.setFontSize(14);
  doc.text('Items Requiring Attention', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  const lowStockItems = [
    { name: 'MacBook Pro 16"', currentStock: 3, minThreshold: 10, supplier: 'Apple Inc.' },
    { name: 'Wireless Mouse', currentStock: 5, minThreshold: 15, supplier: 'Logitech' },
    { name: 'Coffee Beans Premium', currentStock: 8, minThreshold: 20, supplier: 'Coffee Co.' },
    { name: 'Desk Lamp LED', currentStock: 2, minThreshold: 12, supplier: 'IKEA' }
  ];
  
  lowStockItems.forEach((item) => {
    doc.text(`${item.name} - Current: ${item.currentStock} | Min: ${item.minThreshold}`, 20, yPosition);
    doc.text(`Supplier: ${item.supplier}`, 25, yPosition + 8);
    yPosition += 20;
  });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text('Action Required:', 20, yPosition);
  doc.setFontSize(10);
  doc.text('• Reorder MacBook Pro 16" (Critical - Only 3 left)', 20, yPosition + 15);
  doc.text('• Reorder Desk Lamp LED (Critical - Only 2 left)', 20, yPosition + 25);
  doc.text('• Monitor other items approaching minimum threshold', 20, yPosition + 35);
  
  return doc;
};

export const generateCSVReport = (type: string, data: any[]) => {
  let csvContent = '';
  
  switch (type) {
    case 'products':
      csvContent = 'Name,SKU,Price,Stock,Low Stock Threshold,Description\n';
      data.forEach(item => {
        const name = (item.name || '').replace(/"/g, '""');
        const sku = (item.sku || '').replace(/"/g, '""');
        const description = (item.description || '').replace(/"/g, '""');
        csvContent += `"${name}","${sku}",${item.price || 0},${item.stock || 0},${item.low_stock_threshold || 0},"${description}"\n`;
      });
      break;
      
    case 'suppliers':
      csvContent = 'Name,Email,Phone,Address,Status,Products Count,Total Orders\n';
      data.forEach(item => {
        const name = (item.name || '').replace(/"/g, '""');
        const email = (item.email || '').replace(/"/g, '""');
        const phone = (item.phone || '').replace(/"/g, '""');
        const address = (item.address || '').replace(/"/g, '""');
        csvContent += `"${name}","${email}","${phone}","${address}",${item.status || 'active'},${item.products || 0},${item.total_orders || 0}\n`;
      });
      break;
      
    case 'categories':
      csvContent = 'Name,Description,Created At\n';
      data.forEach(item => {
        const name = (item.name || '').replace(/"/g, '""');
        const description = (item.description || '').replace(/"/g, '""');
        const createdAt = item.created_at ? new Date(item.created_at).toLocaleDateString() : '';
        csvContent += `"${name}","${description}","${createdAt}"\n`;
      });
      break;
      
    case 'orders':
      csvContent = 'Order Number,Status,Total Amount,Order Date,Expected Delivery\n';
      data.forEach(item => {
        const orderNumber = (item.order_number || '').replace(/"/g, '""');
        const orderDate = item.order_date ? new Date(item.order_date).toLocaleDateString() : '';
        const expectedDelivery = item.expected_delivery ? new Date(item.expected_delivery).toLocaleDateString() : '';
        csvContent += `"${orderNumber}",${item.status || 'pending'},${item.total_amount || 0},"${orderDate}","${expectedDelivery}"\n`;
      });
      break;
      
    default:
      csvContent = 'No data available\n';
  }
  
  return csvContent;
};
