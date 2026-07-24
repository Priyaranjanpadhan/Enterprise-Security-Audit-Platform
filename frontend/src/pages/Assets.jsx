import React from "react";
import api from "../services/api";

function Assets(){
    const [assets, setAssets] = React.useState([]);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        async function fetchAssets(){
            try{
                const response = await api.get("/assets");
                setAssets(response.data);
            } catch(err){
                //if backend blocked us with 403 that means nothing in that table
                //if 403 means u r not authorized, can go n see in assets.js isApproved function
                if(err.response && err.response.status == 403){
                    setAssets([]);
                } else{
                    setError("Failed to load assets from the server");
                }
            }
        }
        fetchAssets();
    }, []);
    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">IT Assets Management</h1>

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                    {error}
                </div>
            )}

            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium">Asset Name</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">

                        {/* If the array is empty, show a fallback message */}
                        {assets.length === 0 && !error && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No assets found in the database
                                </td>
                            </tr>
                        )}

                        {/* Map loop */}
                        {assets.map((asset) => (
                            <tr key={asset.id} className="hover:bg-gray-700 transition-colors">

                                 <td className="px-6 py-4 font-medium text-white">
                                    {asset.asset_name}
                                 </td>

                                 <td className="px-6 py-4 text-gray-300">
                                    {asset.description || "No description provided."}
                                 </td>

                                 <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-gray-200 font-medium">
                                            {asset.owner_name || "Unassigned"}
                                        </span>
                                        {asset.email && (
                                            <span className="text-xs text-gray-500">
                                                {asset.email}
                                            </span>
                                        )}
                                    </div>
                                 </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Assets;