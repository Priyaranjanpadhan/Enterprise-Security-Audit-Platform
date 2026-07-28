import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const {user, logOut} = useAuth();
    const navigate = useNavigate();
    async function handleLogout(){
        await logOut();
        navigate("/login");
    }
    return(
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
            {/* Logo and title */}
            <Link 
                to="/"
                className="text-white text-xl font-bold hover:text-blue-400 transition-colors"
            >
                Enterprise Security Platform
            </Link>

            {/* User info and logout button */}
            <div className="flex items-center space-x-4">
                {/* we will use ?. just in case user is null so not crash */}
                <span className="text-gray-300">Welcome, {user?.name}</span>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;