import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import StatCard from '../components/admin/StatCard';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 450000 },
  { name: 'Tue', revenue: 820000 },
  { name: 'Wed', revenue: 610000 },
  { name: 'Thu', revenue: 950000 },
  { name: 'Fri', revenue: 1200000 },
  { name: 'Sat', revenue: 1500000 },
  { name: 'Sun', revenue: 1300000 },
];

const CATEGORY_DATA = [
  { name: 'Dolls', value: 400 },
  { name: 'Lego', value: 300 },
  { name: 'Teddy', value: 300 },
  { name: 'Others', value: 200 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="💰" label="Total Revenue" value="54,230,000₫" trend="↑ 12%" isUp={true} />
        <StatCard icon="📦" label="Orders" value="128" trend="↑ 8%" isUp={true} />
        <StatCard icon="👥" label="Customers" value="3,422" trend="↑ 5%" isUp={true} />
        <StatCard icon="⚠️" label="Low Stock" value="12" trend="↓ 2%" isUp={false} />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Revenue Analytics</h3>
              <p className="text-sm text-gray-400">Weekly earnings performance</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-semibold rounded-xl p-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()}₫`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Best Sellers</h3>
          <p className="text-sm text-gray-400 mb-8">By category distribution</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {CATEGORY_DATA.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Day Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Inventory Status</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Reports Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Need a detailed report?</h3>
            <p className="text-indigo-100 mb-8 max-w-xs text-sm">Download your monthly performance report with full analytics and data.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2">
                <DollarSign size={18} /> Export PDF
              </button>
              <button className="bg-indigo-500 bg-opacity-30 border border-indigo-400 px-6 py-3 rounded-2xl font-bold hover:bg-opacity-40 transition-all">
                View All
              </button>
            </div>
          </div>
          <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;