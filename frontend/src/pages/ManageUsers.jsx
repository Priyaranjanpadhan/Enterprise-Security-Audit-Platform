import React from "react";
import api from "../services/api.js";

function ManageUsers(){
    const[users, setUsers] = React.useState([]);
    const[error, setError] = React.useState("");
    const[success, setSuccess] = React.useState("");
    const[loading, setLoading] = React.useState(true);

    //fetch the users table when the page loads
    React.useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers(){
        try{
            const response = await api.get("/user/admin/users");
            setUsers(response.data);
        } catch(err){
            setError("Failed to load users, Ensure you have admin privilages.");
        } finally{
            setLoading(false);
        }
    }

    //This function triggers when the Admin changes the dropdown menu
    async function handleRoleChange(userId, newRoleId){
        try{
            setError("");
            setSuccess("");

            //This hits the PUT route you buit earlier
            await api.put(`/user/admin/users/${userId}/role`, {
                newRoleId: parseInt(newRoleId)
            });

            setSuccess("User role updated successfully!");
            fetchUsers(); //refresh the table to show the new role

            //Clear the success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch(err){
            setError("Failed to update user role.");
        }
    }

    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Approve pending accounts and manage system access levels.</p>

            {/* Notification Banners */}
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

            {/* Users Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-700 text-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium">ID</th>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Current Role</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading users....</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                // If an admin changes a user's role, your fetchUsers() function fires and receives a fresh array from the database. 
                                // Without a key, React has no idea which row is which. It is forced to wipe out all 50 table rows from the screen and rebuild all 50 from scratch just to update that one tiny text change. This makes your app slow and laggy.
                                <tr key={u.id} className={`hover:bg-gray-700/50 transition-colors ${u.role_id === 5 ? 'bg-red-900/10' : ''}`}>
                                    <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        {/* Highlight pending users in red so the admin notices them immediately */}
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            u.role_id === 5 ?
                                            `bg-red-500/20 text-red-400 border-red-500/50` : 
                                            `bg-blue-500/20 text-blue-400 border-blue-500/50`
                                        }`}>
                                            Role {u.role_id} {u.role_id === 5 ? "(Pending)" : ""}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                            value={u.role_id}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            disabled={u.role_id === 1}
                                        >
                                            <option value="1">Role 1: Admin</option>
                                            <option value="2">Role 2: Auditor</option>
                                            <option value="3">Role 3: Technician</option>
                                            <option value="4">Role 4: Employee</option>
                                            <option value="5">Role 5: Pending</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageUsers;