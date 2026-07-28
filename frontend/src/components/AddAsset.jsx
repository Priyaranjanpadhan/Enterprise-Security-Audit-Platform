import React from "react";
import api from "../services/api";

function AddAsset({onAssetAdded, onCancel}){
    const [newAsset, setNewAsset] = React.useState({name: "", description: ""});
    const [error, setError] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try{
            await api.post("/assets", newAsset);
            setNewAsset({name: "", description: ""});

            //Trigger the function passed from the parent component, this just refreshes the table
            onAssetAdded("Asset added to inventory!");
        } catch(err){
            setError("Failed to add asset to the database.");
        } finally{
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-800 border border-gray-700 rounded-lg space-y-4 mb-6 transition-all">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-white"> Register new hardware</h2>
                <button 
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    cancel
                </button>
            </div>

            {error && (
                <div className="p-2 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-gray-300">Asset Name(e.g. Macbook Pro M3)</label>
                    <input 
                        type="text" 
                        required
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm text-gray-300">Serial / Description</label>
                    <input 
                        type="text" 
                        value={newAsset.description}
                        onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus: ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end space-s-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-600. text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save to Database"}
                </button>
            </div>
        </form>
    );
}

export default AddAsset;