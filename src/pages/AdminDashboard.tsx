import Sidebar from '../components/admin/Sidebar';
import DashboardOverview from './DashboardOverview';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 transition-all duration-300">
        <header className="flex justify-between items-center mb-10 pt-10 lg:pt-0">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Hello Admin 👋,</h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your store today.</p>
          </div>
          
          <div className="hidden sm:block relative">
            <input 
              type="text" 
              placeholder="Search analytics..." 
              className="pl-10 pr-4 py-3 rounded-2xl bg-white border-none shadow-sm focus:ring-2 ring-indigo-500 w-64 text-sm" 
            />
          </div>
        </header>

        <DashboardOverview />
      </main>
    </div>
  );
};

export default AdminDashboard;