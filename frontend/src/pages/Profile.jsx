import React from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Profile(){
    const {user: authUser, setUser: setAuthUser} = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState({
        type: "",
        text: ""
    });
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role_id: ""
    });

    React.useEffect(() => {
        async function fetchProfile(){
            try{
                const response = await api.get("/user/profile");
                const data = response.data;

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    role_id: data.role_id || ""
                });
            } catch(err){
                setMessage({type: "error", text: "Failed to load profile data."})
            } finally{
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    function handleChange(e){
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setMessage({type: "", text: ""});

        try{
            //We only send the field your put route actually expects
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            };

            const response = await api.put("/user/profile", updateData);

            setMessage({type: "success", text: "Profile updated successfully!"});

            if(response.data.user){
                setAuthuser({...authUser, name: response.data.user.name});
            } 
        } catch(err){
            setMessage({type: "error", text: "Failed to update profile."});
        }
    }

    if(loading) {
        return <div className="text-gray-400">Loading profile data...</div>
    }
    return(
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-gray-400 mt-2">Manage your personal information and contact details.</p>
            </div>

            {message.text && (
                <div className={`p-3 text-sm rounded border ${
                    message.type == `error`? 
                    'text-red-400 bg-red-900/50 border-red-500' : 
                    'text-green-400 bg-green-900/50 border-green-500'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
                {/* Name */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Full Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-700 border border-gray-700 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        disabled
                        className="w-full p-2.5 bg-gray-900 border border-gray-700 text-gray-500 rounded cursor-not-allowed"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">Phone Number</label>
                    <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., +91 6599249801"
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300 ">Office / Physical Address</label>
                    <textarea 
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* System Role (Disabled) */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">System Role Level</label>
                    <input 
                        type="text" 
                        value={`Role Level ${formData.role_id}`}
                        disabled
                        className="w-full p-2.5 bg-gray-900 border border-gray-700 text-gray-500 rounded cursor-not-allowed ront-mono"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"> 
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;