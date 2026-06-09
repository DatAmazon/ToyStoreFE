import React, { useState } from 'react';
import { exportCustomersReportExcel } from '@/api/reportApi';
import { useToast } from '@/components/ui/Toast';
import { Table } from 'lucide-react';

const customers = [
  { name: 'Jane Cooper', company: 'Microsoft', phone: '(225) 555-0118', email: 'jane@microsoft.com', country: 'United States', status: 'Active' },
  { name: 'Floyd Miles', company: 'Yahoo', phone: '(205) 555-0100', email: 'floyd@yahoo.com', country: 'Kiribati', status: 'Inactive' },
  { name: 'Ronald Richards', company: 'Adobe', phone: '(302) 555-0107', email: 'ronald@adobe.com', country: 'Israel', status: 'Inactive' },
  { name: 'Marvin McKinney', company: 'Tesla', phone: '(252) 555-0126', email: 'marvin@tesla.com', country: 'Iran', status: 'Active' },
  { name: 'Jerome Bell', company: 'Google', phone: '(603) 555-0123', email: 'jerome@google.com', country: 'Réunion', status: 'Active' },
  { name: 'Kathryn Murphy', company: 'Microsoft', phone: '(406) 555-0120', email: 'kathryn@microsoft.com', country: 'Curaçao', status: 'Active' },
  { name: 'Jacob Jones', company: 'Yahoo', phone: '(209) 555-0104', email: 'jacob@yahoo.com', country: 'Brazil', status: 'Active' },
  { name: 'Kristin Watson', company: 'Facebook', phone: '(212) 555-0110', email: 'kristin@facebook.com', country: 'Åland Islands', status: 'Active' },
];

const CustomerTable = () => {
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCustomersReportExcel();
      showToast("Xuất danh sách khách hàng thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xuất báo cáo!", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm mt-8 overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All Customers</h2>
          <p className="text-green-500 text-sm font-medium">Active Members</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            ) : (
              <Table size={18} />
            )}
            {exporting ? 'Exporting...' : 'Export Excel'}
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 ring-indigo-500 w-full md:w-auto" 
            />
          </div>
          <select className="bg-gray-50 border-none rounded-xl py-2 px-4 text-sm text-gray-500 focus:ring-2 ring-indigo-500">
            <option>Short by : Newest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b text-sm">
              <th className="px-8 py-4 font-medium">Customer Name</th>
              <th className="px-8 py-4 font-medium">Company</th>
              <th className="px-8 py-4 font-medium">Phone Number</th>
              <th className="px-8 py-4 font-medium">Email</th>
              <th className="px-8 py-4 font-medium">Country</th>
              <th className="px-8 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-5 font-semibold text-gray-700">{customer.name}</td>
                <td className="px-8 py-5 text-gray-600">{customer.company}</td>
                <td className="px-8 py-5 text-gray-600">{customer.phone}</td>
                <td className="px-8 py-5 text-gray-600">{customer.email}</td>
                <td className="px-8 py-5 text-gray-600">{customer.country}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${
                    customer.status === 'Active' 
                      ? 'bg-green-100 text-green-600 border-green-200' 
                      : 'bg-red-100 text-red-600 border-red-200'
                  }`}>
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t">
        <p className="text-gray-400 text-sm">Showing data 1 to 8 of 256K entries</p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">{'<'}</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">4</button>
          <span className="text-gray-400 px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">40</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
