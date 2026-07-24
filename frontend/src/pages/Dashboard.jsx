import { useAuth } from "../context/AuthContext.jsx";

function Dashboard(){
    const { user } = useAuth();
    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Security Overview</h1>

            {/* Welcome banner */}
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                        Welcome back, {user?.name}!
                    </h2>
                    <p className="text-gray-400">
                        System access level: <span>Role {user?.role_id}</span>
                    </p>
                </div>
                <div className="hidden md:block">
                    <span className="px-3 py-1 text-xs font-semibold text-green-400 bg-green-800 rounded-full">
                        Connection Secure
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-blue-500 transition-colors">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Assets</h3>
                    <p className="mt-2 text-4xl font-bold text-white">142</p>
                </div>

                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-red-500 transition-colors">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pending Alerts</h3>
                    <p className="mt-2 text-4xl font-bold text-white">3</p>
                </div>

                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-green-500 transition-colors">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Audit Status</h3>
                    <p className="mt-2 text-4xl font-bold text-white">Passing</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;