import React from "react";
import api from "../services/api.js";
import {useAuth} from "../context/AuthContext.jsx";
import AddAsset from "../components/AddAsset";
import { useNavigate } from "react-router-dom";

function Assets(){
    const {user} = useAuth();
    const navigate = useNavigate();
    const [assets, setAssets] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState({
        type: "",
        text: ""
    });
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [assigningId, setAssigningId] = React.useState(null);
    const [assignUserId, setAssignUserId] = React.useState("");

    React.useEffect(() => {
        fetchAssets();
    }, []);

    async function fetchAssets(){
        try{
            const response = await api.get("/assets");
            setAssets(response.data);
        } catch(err){
            setMessage({
                type: "error",
                text: "Failed to load assets."
            });
        } finally{
            setLoading(false);
        }
    }

    function handleAssetAdded(successText){
        setShowAddForm(false); //Hide the form
        setMessage({
            type: "success",
            text: successText
        });
        fetchAssets();
        setTimeout(() => setMessage({
            type: "",
            text: ""
        }), 3000);
    }

    async function handleAssign(assetId){
        if(!assignUserId) return;
        setMessage({
            type: "",
            text: ""
        });

        try{
            await api.post(`/assets/${assetId}/assign`, {
                assigned_to: parseInt(assignUserId)
            });

            setMessage({
                type: "success",
                text: "Asset successfully assigned!"
            });

            setAssigningId(null);
            setAssignUserId("");
            fetchAssets();

            setTimeout(() => setMessage({
                type: "",
                text: ""
            }), 3000);
        } catch(err){
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Failed to assign asset."
            })
        }
    }

    async function handleDelete(assetId){
        if(!window.confirm("Are you sure you want to permanently delete this asset?")){
            return;
        }

        setMessage({
            type: "",
            text: ""
        });

        try{
            await api.delete(`/assets/${assetId}`);
            setMessage({type: "success", text: "Asset successfully deleted."})
            fetchAssets();
            setTimeout(() => setMessage({
                type: "",
                text: ""
            }), 3000);
        } catch(err){
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Failed to retire asset."
            });
        }
    }

    const canManageAssets = user?.role_id === 1 || user?.role_id === 3;

    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">IT Assets Inventory</h1>
                    <p className="text-gray-400">Manage hardware assignments and system records.</p>
                </div>

                {canManageAssets && !showAddForm && (
                    <button 
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        + Add New Asset
                    </button>
                )}
            </div>

            {/* Notification Banner */}
            {message.text && (
                <div className={`p-3 text-sm rounded border ${
                    message.type === 'error' ? 
                    'text-red-400 bg-red-900/50 border-red-500' : 
                    'text-green-400 bg-green-900/50 border-green-500'
                }`} 
                >
                    {message.text}
                </div>
            )}

            {/* Modular Component Injection */}
            {showAddForm && (
                <AddAsset 
                    onAssetAdded={handleAssetAdded}
                    onCancel={() => setShowAddForm(false)}
                /> 
            )}

            {/* Assets Data table */}
            {/* Mobile View Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading? (
                    <div className="text-center p-4 text-gray-500">Loading inventory....</div>
                ) : assets.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">No assets found in the system.</div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm flex flex-col space-y-3">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asset #{asset.id}</span>
                                <span className="font-bold text-white text-lg">{asset.asset_name}</span>
                            </div>

                            <div className="text-sm text-gray-400">
                                <span className="font-semibold text-gray-300">Desc: </span>
                                {asset.description || "-"}
                            </div>

                            <div className="text-sm">
                                <span className="font-semibold text-gray-300">Owner: </span>
                                {asset.owner_name ? (
                                    <span className="text-blue-400">{asset.owner_name} ({asset.email})</span>
                                ) : (
                                    <span className="text-gray-500 italic">Unassigned</span>
                                )}
                            </div>

                            {/* Mobile Management Buttons */}
                            {canManageAssets && (
                                <div className="pt-3 mt-2 border-t border-gray-700 flex flex-wrap gap-2">
                                    {assigningId === asset.id ? (
                                        <div className="flex w-full space-x-2">
                                            <input 
                                                type="text" 
                                                placeholder="User Id"
                                                value={assignUserId}
                                                onChange={(e) => setAssignUserId(e.target.value)}
                                                className="flex-1 p-2 text-sm bg-gray-900 border border-gray-600 rounded text-white"
                                            />
                                            <button onClick={() => handleAssign(asset.id)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Set</button>
                                            <button onClick={() => setAssigningId(null)} className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">X</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAssigningId(asset.id)} className="px-3 py-1.5 bg-gray-700 text-blue-400 rounded text-sm font-medium">Reassign</button>
                                    )}

                                    {user.role_id === 1 && (
                                        <button onClick={() => handleDelete(asset.id)} className="px-3 py-1.5 bg-gray-700 text-red-400 rounded text-sm font-medium">Delete</button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-gray-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Hardware</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Current Owner</th>
                            {canManageAssets && <th className="px-6 py-4">Management</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading inventory...</td>
                            </tr>
                        ) : assets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No assets found in the system.</td>
                            </tr>
                        ) : (
                            assets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">#{asset.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{asset.asset_name}</td>
                                    <td className="px-6 py-4">{asset.description || "-"}</td>
                                    <td className="px-6 py-4"> 
                                        {asset.owner_name ? (
                                            <div>
                                                <div className="text-white">{asset.owner_name}</div>
                                                <div className="text-xs text-gray-500">{asset.email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italice">Unassigned (In storage)</span>
                                        )}
                                    </td>

                                    {canManageAssets && (
                                        <td className="px-6 py-4 flex space-x-3">
                                            {assigningId === asset.id ? (
                                                <div className="flex space-x-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="User Id"
                                                        value={assignUserId}
                                                        onChange={(e) => setAssignUserId(e.target.value)} 
                                                        className="w-20 p-1 text-sm bg-gray-900 border border-gray-600 rounded text-white"
                                                    />
                                                    <button onClick={() => handleAssign(asset.id)} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Set</button>
                                                    <button onClick={() => setAssigningId(null)} className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setAssigningId(asset.id)} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Reassign</button>
                                            )}

                                            {user.role_id === 1 && (
                                                <button onClick={() => handleDelete(asset.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Assets;