import { jsPDF } from 'jspdf';

export interface ExportData {
  report: any;
  transactions: any[];
  month: string;
}

class ExportService {
  async exportToCSV(data: ExportData): Promise<Blob> {
    console.log('Creating CSV with data:', data);
    // Create CSV content
    let csvContent = 'Date,Description,Category,Amount\n';
    
    // Add transactions data
    data.transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();
      const description = transaction.description || '';
      const category = transaction.category;
      // Ensure amount is a number before calling toFixed
      const amountValue = typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount) || 0;
      const amount = `Rs ${amountValue.toFixed(2)}`;
      csvContent += `"${date}","${description}","${category}","${amount}"\n`;
    });
    
    // Add summary
    csvContent += '\nSummary:\n';
    const totalIncome = typeof data.report.totalIncome === 'number' ? data.report.totalIncome : parseFloat(data.report.totalIncome) || 0;
    const totalExpenses = typeof data.report.totalExpenses === 'number' ? data.report.totalExpenses : parseFloat(data.report.totalExpenses) || 0;
    const balance = typeof data.report.balance === 'number' ? data.report.balance : parseFloat(data.report.balance) || 0;
    
    csvContent += `Total Income,Rs ${totalIncome.toFixed(2)}\n`;
    csvContent += `Total Expenses,Rs ${totalExpenses.toFixed(2)}\n`;
    csvContent += `Balance,Rs ${balance.toFixed(2)}\n`;
    
    console.log('CSV content:', csvContent);
    
    // Create and return blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    console.log('CSV Blob created:', blob);
    return blob;
  }

  async exportToPDF(data: ExportData): Promise<Blob> {
    console.log('Creating PDF with data:', data);
    
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Financial Report - ${data.month}`, 14, 20);
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 35);
    
    const totalIncome = typeof data.report.totalIncome === 'number' ? data.report.totalIncome : parseFloat(data.report.totalIncome) || 0;
    const totalExpenses = typeof data.report.totalExpenses === 'number' ? data.report.totalExpenses : parseFloat(data.report.totalExpenses) || 0;
    const balance = typeof data.report.balance === 'number' ? data.report.balance : parseFloat(data.report.balance) || 0;
    
    doc.setFontSize(12);
    doc.text(`Total Income: Rs ${totalIncome.toFixed(2)}`, 14, 45);
    doc.text(`Total Expenses: Rs ${totalExpenses.toFixed(2)}`, 14, 55);
    doc.text(`Balance: Rs ${balance.toFixed(2)}`, 14, 65);
    
    // Add transactions table
    doc.setFontSize(14);
    doc.text('Transactions', 14, 80);
    
    // Create a simple table manually since autotable is not working
    let yPosition = 90;
    doc.setFontSize(10);
    
    // Table header
    doc.setFillColor(26, 32, 44);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, yPosition, 180, 10, 'F');
    doc.text('Date', 16, yPosition + 7);
    doc.text('Description', 45, yPosition + 7);
    doc.text('Category', 100, yPosition + 7);
    doc.text('Amount', 150, yPosition + 7);
    
    yPosition += 12;
    doc.setTextColor(0, 0, 0);
    
    // Table rows
    data.transactions.forEach((transaction, index) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const description = transaction.description || '';
      const category = transaction.category;
      const amountValue = typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount) || 0;
      const amount = `Rs ${amountValue.toFixed(2)}`;
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(247, 250, 252);
        doc.rect(14, yPosition - 2, 180, 8, 'F');
      }
      
      doc.text(date, 16, yPosition + 5);
      doc.text(description.length > 20 ? description.substring(0, 20) + '...' : description, 45, yPosition + 5);
      doc.text(category, 100, yPosition + 5);
      doc.text(amount, 150, yPosition + 5);
      
      yPosition += 10;
      
      // Add new page if needed
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Save the PDF as a blob
    const pdfBlob = doc.output('blob');
    console.log('PDF Blob created:', pdfBlob);
    return pdfBlob;
  }
  
  // Helper function to download files
  downloadFile(blob: Blob, filename: string): void {
    console.log('Downloading file:', filename);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('File download completed');
  }
}

export const exportService = new ExportService();