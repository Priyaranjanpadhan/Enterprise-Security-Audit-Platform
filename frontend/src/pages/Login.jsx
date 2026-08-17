import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { Eye, EyeOff } from "lucide-react";

function Login(){
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

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

    function handleGoogleLogin(){
        // Forcing the browser to navidate to your Render backend Google route
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
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
                    <div className="relative mb-6">
                        <label className="block mb-2 text-sm text-gray-300">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="........"
                                required
                            />  

                            {/* The Toggle button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-2.5 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium transition-colors" 
                    >
                        Sign in
                    </button>

                    {/* Just a divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <div className="px-3 text-sm text-gray-400">or</div>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    {/* The Google Sign-in BUtton */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2.5 text-white bg-red-60 rounded hover:bg-red-700 font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <span>Sign in with Google</span>
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;