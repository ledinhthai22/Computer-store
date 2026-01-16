const StatCard = ({ title, value, icon, trend, trendColor }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-gray-50 rounded-xl">
                {icon}
            </div>
            <span className={`text-xs font-bold ${trendColor}`}>{trend}</span>
        </div>
        <div className="mt-4">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
    </div>
);

export default StatCard;