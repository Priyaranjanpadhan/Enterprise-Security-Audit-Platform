import React from "react";
import api from "../services/api.js";

function AuditLogs(){
    const [logs, setLogs] = React.useState([]);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchLogs() {
            try{
                const response = await api.get("/audit-logs");
                setLogs(response.data);
            } catch(err){
                if(err.response && err.response.status === 403){
                    setError("You do not have the permission to view the security logs");
                } else{
                    setError("Failed to load audit logs from the server.")
                }
            } finally{
                setLoading(false);
            }
        }

        fetchLogs();
    }, []);

    function getSeverityColor(severity){
        switch(severity?.toLowerCase()){
            case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
            case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
            case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
        }
    };

    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Security Audit Logs</h1>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-gray-400">Loading logs...</div>
            ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-700 text-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Timestamp</th>
                                <th className="px-6 py-4 font-medium">Asset</th>
                                <th className="px-6 py-4 font-medium">Reported By</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                                <th className="px-6 py-4 font-medium">Severity</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {logs.length === 0 && !error && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No Security events found.
                                    </td>
                                </tr>
                            )}

                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                        {new Date(log.logged_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {log.asset_name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.logged_by_user || "System"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {log.action_details}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                                            {log.severity?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-medium ${log.status === 'open' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                                            {log.status?.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AuditLogs;