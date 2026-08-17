import {useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try{
            await api.post("/auth/register", {name, email, password, phone, address});
            navigate("/login");
        } catch(err){
            setError(err.response?.data?.message || "Failed to Register.");
        }
    };

    function handleGoogleLogin() {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white">
                    Create Account
                </h2>

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Phone Number</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Address (Optional)</label>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-2.5 mt-4 text-white bg-green-600 rounded hover:bg-green-700 font-medium transition-colors"
                    >
                        Register
                    </button>
                </form>

                {/* Just a divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <div className="px-3 text-sm text-gray-400">or</div>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2.5 text-white bg-red-600 rounded hover:bg-red-700 font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <span>Register with Google</span>
                    </button>

                <div className="text-sm text-center text-gray-400">
                    Already have an account?
                    <button onClick={() => navigate("/login")} className="text-blue-400 hover:underline">
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;