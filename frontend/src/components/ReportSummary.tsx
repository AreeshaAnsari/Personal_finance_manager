import React, { useState, useEffect, useCallback } from 'react';
import { transactionService, MonthlyReport } from '../services/transactionService';
import { exportService, ExportData } from '../services/exportService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ReportSummaryProps {
  month: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ month }) => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const [reportData, transactionsData] = await Promise.all([
        transactionService.getMonthlyReport(month),
        transactionService.getFilteredTransactions({ month })
      ]);
      setReport(reportData);
      setTransactions(transactionsData);
    } catch (err) {
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const formatCurrency = (amount: number) => {
    // Format as Rupees instead of USD
    return `Rs ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount))}`;
  };

  const handleExportCSV = async () => {
    console.log('=== CSV EXPORT DEBUG INFO ===');
    console.log('Current state values:');
    console.log('- report:', report);
    console.log('- transactions:', transactions);
    console.log('- month:', month);
    console.log('- report type:', typeof report);
    console.log('- transactions type:', typeof transactions);
    console.log('- month type:', typeof month);
    
    // Additional validation
    if (!report) {
      console.log('❌ No report data available for CSV export');
      alert('No report data available for export. Please ensure data is loaded.');
      return;
    }
    
    if (!Array.isArray(transactions)) {
      console.log('❌ Transactions is not an array:', transactions);
      alert('Invalid transactions data. Please refresh the page.');
      return;
    }
    
    if (!month) {
      console.log('❌ No month specified for export');
      alert('No month specified for export.');
      return;
    }
    
    // Check if report has required properties
    if (typeof report.totalIncome !== 'number' || 
        typeof report.totalExpenses !== 'number' || 
        typeof report.balance !== 'number') {
      console.log('❌ Report data is malformed:', report);
      alert('Report data is incomplete. Please refresh the page.');
      return;
    }
    
    console.log('✅ All data validations passed');
    
    const exportData: ExportData = {
      report,
      transactions,
      month
    };
    
    try {
      console.log('📦 Exporting CSV with data:', exportData);
      const csvBlob = await exportService.exportToCSV(exportData);
      console.log('✅ CSV Blob created successfully:', csvBlob);
      exportService.downloadFile(csvBlob, `financial-report-${month}.csv`);
      console.log('✅ CSV download initiated');
    } catch (err: any) {
      console.error('💥 Failed to export CSV:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err.message || err);
      alert('Failed to export CSV: ' + (err.message || 'Unknown error'));
    }
  };

  const handleExportPDF = async () => {
    console.log('=== PDF EXPORT DEBUG INFO ===');
    console.log('Current state values:');
    console.log('- report:', report);
    console.log('- transactions:', transactions);
    console.log('- month:', month);
    console.log('- report type:', typeof report);
    console.log('- transactions type:', typeof transactions);
    console.log('- month type:', typeof month);
    
    // Additional validation
    if (!report) {
      console.log('❌ No report data available for PDF export');
      alert('No report data available for export. Please ensure data is loaded.');
      return;
    }
    
    if (!Array.isArray(transactions)) {
      console.log('❌ Transactions is not an array:', transactions);
      alert('Invalid transactions data. Please refresh the page.');
      return;
    }
    
    if (!month) {
      console.log('❌ No month specified for export');
      alert('No month specified for export.');
      return;
    }
    
    // Check if report has required properties
    if (typeof report.totalIncome !== 'number' || 
        typeof report.totalExpenses !== 'number' || 
        typeof report.balance !== 'number') {
      console.log('❌ Report data is malformed:', report);
      alert('Report data is incomplete. Please refresh the page.');
      return;
    }
    
    console.log('✅ All data validations passed');
    
    const exportData: ExportData = {
      report,
      transactions,
      month
    };
    
    try {
      console.log('📦 Exporting PDF with data:', exportData);
      const pdfBlob = await exportService.exportToPDF(exportData);
      console.log('✅ PDF Blob created successfully:', pdfBlob);
      exportService.downloadFile(pdfBlob, `financial-report-${month}.pdf`);
      console.log('✅ PDF download initiated');
    } catch (err: any) {
      console.error('💥 Failed to export PDF:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err.message || err);
      alert('Failed to export PDF: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-center text-gray-400">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Financial Summary</h3>
            <div className="flex space-x-2">
              <button 
                onClick={handleExportCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                title="Export to CSV"
              >
                CSV
              </button>
              <button 
                onClick={handleExportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                title="Export to PDF"
              >
                PDF
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Income</span>
              <span className="text-green-400 font-semibold">
                {formatCurrency(report.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Expenses</span>
              <span className="text-red-400 font-semibold">
                {formatCurrency(report.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400">Remaining Balance</span>
              <span className={`font-semibold ${
                report.balance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(report.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        {report.categoryExpenses.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.categoryExpenses.map(item => ({ ...item, name: item.category }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percent }) => 
                    `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`
                  }
                >
                  {report.categoryExpenses.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSummary;