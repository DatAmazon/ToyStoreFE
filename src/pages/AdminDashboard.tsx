import Sidebar from '../components/admin/Sidebar';
import StatCard from '../components/admin/StatCard';
import CustomerTable from '../components/admin/CustomerTable';

const AdminDashboard = () => {
  return (
    // flex-col trên mobile, flex-row trên desktop
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen font-sans">
      
      {/* Sidebar sẽ tự ẩn/hiện dựa trên code bên trong nó */}
      <Sidebar />

      {/* Main Content: tự giãn rộng */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 transition-all duration-300">
        
        {/* Header: Responsive text size */}
        <header className="flex justify-between items-center mb-6 lg:mb-10 pt-10 lg:pt-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-800">Hello Evano 👋,</h1>
          
          {/* Search bar ẩn trên mobile nhỏ, hiện trên tablet trở lên */}
          <div className="hidden sm:block relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 rounded-xl bg-white border-none shadow-sm focus:ring-2 ring-indigo-500" 
            />
          </div>
        </header>

        {/* Stats Grid: 1 cột (mobile), 2 cột (tablet), 3 cột (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          <StatCard icon="👥" label="Total Customers" value="5,423" trend="↑ 16%" isUp={true} />
          <StatCard icon="👤" label="Members" value="1,893" trend="↓ 1%" isUp={false} />
          <StatCard icon="💻" label="Active Now" value="189" trend="" isUp={true} />
        </div>

        {/* Table: Tự có thanh cuộn ngang nếu màn hình quá bé */}
        <CustomerTable />
      </main>
    </div>
  );
};

export default AdminDashboard;