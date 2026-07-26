import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function ReportEvent(){
    //Use a <Link> component when a user is performing a passive, direct navigation action. (e.g., clicking "My Profile" or "Dashboard" inside your sidebar).
    //Use useNavigate when you need to wait for a function, calculation, or asynchronous API network request to finish successfully before redirecting the user.
    const navigate = useNavigate();
    const [assets, setAssets] = React.useState([]);
    const [formData, setFormData] = React.useState({
        asset_id: "",
        severity: "low", //Default value
        action_details: ""
    });
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    //Fetch the assets when the page loads to populate the dropdown
    React.useEffect(() => {
        async function fetchAssets(){
            try{
                const response = await api.get("/assets");
                setAssets(response.data);
            } catch(err){
                console.error("Failed to fetch assets for dropdown", err);
            }
        }

        fetchAssets();
    }, []);

    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        setSuccess("");

        if(!formData.asset_id){
            setError("Please select an asset involved in the event.");
            return;
        }

        try{
            //send the formdata to the auditlogs table
            await api.post("/audit-logs", formData);
            setSuccess("Security event logged successfully! The audit team has been notified");

            //clear the formdata
            setFormData({asset_id: "", severity: "low", action_details: ""});

            //send them to the timeline after 3 seconds so thery can see their new log
            setTimeout(() => {
                navigate("/audit-logs");
            }, 3000);
        } catch(err){
            setError(err.response?.data?.error || "Failed to submit the report");
        }
    }

    return(
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Report a Security</h1>
                <p className="text-gray-400 mt-2">
                    Please log any suspicious or hardware issues. This will immediately notify the Audit team.
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 text-sm text-green-400 bg-green-900/50 border border-green-500 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
                {/* Asset Dropdown */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Asset Involved</label>
                    <select 
                        name="asset_id" 
                        value={formData.asset_id}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">--Select the affected hardware--</option>
                        {assets.map((asset) => (
                            <option value={asset.id} key={asset.id}>
                                {asset.asset_name} (ID: {asset.id})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Severity Radio Buttons */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Severity Level</label>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                            <input 
                                type="radio" 
                                name="severity" 
                                value="high"
                                checked={formData.severity === "high"}
                                onChange={handleChange}
                                className="text-red-500 focus:ring-red-500"
                            />
                            <span>High - Critical breach / Data loss</span>
                        </label>
                        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                            <input 
                                type="radio" 
                                name="severity" 
                                value="medium"
                                checked={formData.severity === "medium"}
                                onChange={handleChange}
                                className="text-yellow-500 focus:ring-yellow-500"
                            />
                            <span>Medium - Unusual behaviour</span>
                        </label>
                        <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                            <input 
                                type="radio" 
                                name="severity" 
                                value="low"
                                checked={formData.severity === "low"}
                                onChange={handleChange}
                                className="text-green-500 focus:ring-green-500"
                            />
                            <span>Low - Minor damage / Routine</span>
                        </label>
                    </div>
                </div>

                {/* Details Text Area */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Event Details</label>
                    <textarea 
                        name="action_details"
                        value={formData.action_details}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe what happened. Include all the error codes, physical location or any steps taken before the issue occurred...." 
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReportEvent;