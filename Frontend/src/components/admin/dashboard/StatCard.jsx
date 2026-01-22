const StatCard = ({ title, value, icon}) => (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-gray-50 rounded-xl">
                {icon}
            </div>
        </div>
        <div className="mt-2">
            <p className="text-gray-500 text-xs font-medium">{title}</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
    </div>
);

export default StatCard;