
import { jsPDF } from 'jspdf';

export const generateTransferStockReport = (location: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Stock Transfer Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Location: ${location.name}`, 20, 45);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Report content
  let yPosition = 75;
  doc.setFontSize(14);
  doc.text('Transfer Activities', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  // Sample transfer data
  const transfers = [
    { date: '2024-06-10', product: 'iPhone 15 Pro', quantity: 25, from: location.name, to: 'Store A', status: 'Completed' },
    { date: '2024-06-11', product: 'MacBook Pro 16"', quantity: 5, from: 'Store B', to: location.name, status: 'Pending' },
    { date: '2024-06-12', product: 'Wireless Headphones', quantity: 50, from: location.name, to: 'Store B', status: 'Completed' },
  ];
  
  transfers.forEach((transfer) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.text(`${transfer.date}: ${transfer.product}`, 20, yPosition);
    doc.text(`Quantity: ${transfer.quantity} | From: ${transfer.from} | To: ${transfer.to}`, 20, yPosition + 8);
    doc.text(`Status: ${transfer.status}`, 20, yPosition + 16);
    yPosition += 28;
  });
  
  return doc;
};

export const generateStockCountReport = (location: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Stock Count Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Location: ${location.name}`, 20, 45);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Report content
  let yPosition = 75;
  doc.setFontSize(14);
  doc.text('Stock Count Summary', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  // Sample stock count data
  const stockCounts = [
    { product: 'iPhone 15 Pro', expected: 45, actual: 43, variance: -2 },
    { product: 'MacBook Pro 16"', expected: 12, actual: 12, variance: 0 },
    { product: 'Wireless Headphones', expected: 156, actual: 158, variance: 2 },
    { product: 'Coffee Beans Premium', expected: 89, actual: 85, variance: -4 },
  ];
  
  let totalVariance = 0;
  
  stockCounts.forEach((count) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    totalVariance += Math.abs(count.variance);
    const varianceText = count.variance >= 0 ? `+${count.variance}` : `${count.variance}`;
    
    doc.text(`${count.product}`, 20, yPosition);
    doc.text(`Expected: ${count.expected} | Actual: ${count.actual} | Variance: ${varianceText}`, 20, yPosition + 8);
    yPosition += 20;
  });
  
  // Summary
  yPosition += 10;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(12);
  doc.text('Count Summary:', 20, yPosition);
  doc.setFontSize(10);
  doc.text(`Total Items Counted: ${stockCounts.length}`, 20, yPosition + 15);
  doc.text(`Total Variance: ${totalVariance} units`, 20, yPosition + 25);
  
  return doc;
};

export const generateLocationReport = (location: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Location Summary Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Location details
  let yPosition = 65;
  doc.setFontSize(14);
  doc.text('Location Details', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  doc.text(`Name: ${location.name}`, 20, yPosition);
  doc.text(`Address: ${location.address}`, 20, yPosition + 10);
  doc.text(`Type: ${location.type}`, 20, yPosition + 20);
  doc.text(`Status: ${location.status}`, 20, yPosition + 30);
  doc.text(`Total Products: ${location.products}`, 20, yPosition + 40);
  doc.text(`Total Value: ${location.value}`, 20, yPosition + 50);
  
  yPosition += 70;
  
  // Key Metrics
  doc.setFontSize(14);
  doc.text('Key Metrics', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  doc.text('• Inventory Turnover: 4.2x annually', 20, yPosition);
  doc.text('• Space Utilization: 85%', 20, yPosition + 10);
  doc.text('• Average Product Value: $678', 20, yPosition + 20);
  doc.text('• Last Audit Date: 2024-06-01', 20, yPosition + 30);
  
  return doc;
};

export const generateHistoryReport = (location: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Location Activity History', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Location: ${location.name}`, 20, 45);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Report content
  let yPosition = 75;
  doc.setFontSize(14);
  doc.text('Recent Activities', 20, yPosition);
  
  yPosition += 20;
  doc.setFontSize(10);
  
  // Sample history data
  const history = [
    { date: '2024-06-13 10:30', type: 'Stock Update', description: 'Stock adjusted for iPhone 15 Pro', user: 'John Doe' },
    { date: '2024-06-12 14:20', type: 'Transfer', description: 'Stock transferred to Store B', user: 'Jane Smith' },
    { date: '2024-06-11 09:15', type: 'Receiving', description: 'New stock received from supplier', user: 'Mike Johnson' },
    { date: '2024-06-10 16:45', type: 'Count', description: 'Physical stock count performed', user: 'Sarah Wilson' },
  ];
  
  history.forEach((item) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.text(`${item.date} - ${item.type}`, 20, yPosition);
    doc.text(`${item.description}`, 20, yPosition + 8);
    doc.text(`User: ${item.user}`, 20, yPosition + 16);
    yPosition += 28;
  });
  
  // Summary
  yPosition += 10;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(12);
  doc.text('Activity Summary:', 20, yPosition);
  doc.setFontSize(10);
  doc.text(`Total Activities: ${history.length}`, 20, yPosition + 15);
  doc.text('Most Active User: John Doe', 20, yPosition + 25);
  doc.text('Most Common Activity: Stock Updates', 20, yPosition + 35);
  
  return doc;
};
