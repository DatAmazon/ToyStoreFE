import api from './api';

/**
 * Helper to trigger file download from a blob response
 */
const downloadBlob = (response: any, defaultFilename: string) => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Try to get filename from content-disposition header
  const contentDisposition = response.headers['content-disposition'];
  let filename = defaultFilename;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
    if (filenameMatch && filenameMatch.length > 1) {
      filename = filenameMatch[1];
    }
  }
  
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 1. Báo cáo Doanh thu (Excel)
export const exportSalesReportExcel = async (fromDate: string, toDate: string) => {
  const response = await api.get('/api/SalesReport/excel', {
    params: { fromDate, toDate },
    responseType: 'blob',
  });
  downloadBlob(response, `SalesReport_${fromDate}_to_${toDate}.xlsx`);
};

// 2. Xuất Hóa đơn bán hàng (PDF)
export const exportInvoicePDF = async (orderId: string) => {
  const response = await api.get(`/api/admin/Reports/invoice/${orderId}/pdf`, {
    responseType: 'blob',
  });
  downloadBlob(response, `Invoice_${orderId}.pdf`);
};

// 3. Báo cáo Danh sách đơn hàng (Excel)
export const exportOrdersReportExcel = async (fromDate?: string, toDate?: string) => {
  const response = await api.get('/api/admin/Reports/orders/excel', {
    params: { fromDate, toDate },
    responseType: 'blob',
  });
  downloadBlob(response, 'OrdersReport.xlsx');
};

// 4. Báo cáo Khách hàng (Excel)
export const exportCustomersReportExcel = async () => {
  const response = await api.get('/api/CustomerReport/excel', {
    responseType: 'blob',
  });
  downloadBlob(response, 'CustomersReport.xlsx');
};

// 5. Báo cáo Tồn kho (Excel)
export const exportInventoryReportExcel = async () => {
  const response = await api.get('/api/InventoryReport/excel', {
    responseType: 'blob',
  });
  downloadBlob(response, 'BaoCaoTonKho.xlsx');
};

// 6. Báo cáo Tồn kho (PDF)
export const exportInventoryReportPDF = async () => {
  const response = await api.get('/api/InventoryReport/pdf', {
    responseType: 'blob',
  });
  downloadBlob(response, 'BaoCaoTonKho.pdf');
};
