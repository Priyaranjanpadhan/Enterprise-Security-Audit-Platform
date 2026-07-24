import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function Login(){
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();
    const {login} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();//It immediately stops the browser from doing its default behavior
        setError("");//error box to be null in case previous error has been popped up

        try{
            //It packages your email and password states and ships them via Axios (api.post) to your Express backend.
            const response = await api.post("/auth/login", {email, password});
            login(response.data.user);
            navigate("/");
        } catch(err){
            setError(err.response?.data?.message || "Invalid email or password");
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white">
                    Enterprise Security
                </h2>

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/50 border border-red-500 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button 
                        type="submit"
                        className="w-full py-2.5 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium transition-colors" 
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;