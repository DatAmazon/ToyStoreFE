import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, isUp }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-5">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800 my-1">{value}</h3>
        <p className={`text-xs font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend} <span className="text-gray-400 font-normal">this month</span>
        </p>
      </div>
    </div>
  );
};

export default StatCard;
