import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">Biểu đồ thống kê</h2>
                <TrendingUp size={20} className="text-gray-400" />
            </div>
            <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}} 
                            dy={10} 
                        />
                        {/* Trục Y bên trái cho số lượng (Users & Orders) */}
                        <YAxis 
                            yAxisId="left"
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}} 
                        />
                        {/* Trục Y bên phải cho Doanh thu (Revenue) */}
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                            tickFormatter={(value) => `${(value/1000)}k`} // Định dạng k cho gọn
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        
                        {/* Đường Người dùng */}
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="users" 
                            name="Người dùng"
                            stroke="#2563eb" 
                            strokeWidth={3} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                        
                        {/* Đường Đơn hàng */}
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="orders" 
                            name="Đơn hàng"
                            stroke="#ea580c" 
                            strokeWidth={3} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />

                        {/* Đường Doanh thu */}
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="revenue" 
                            name="Doanh thu"
                            stroke="#16a34a" 
                            strokeWidth={3} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardChart;