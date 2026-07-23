import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

//Showing a loading message while it checks the backend
//Access denied: it draws nothing and kicks the user away
//Access Granted: It draws the children
function ProtectedRoute({children}){
    const {user, loading} = useAuth();

    //If the AuthContext is still waiting for the backend to reply, show a loading screen
    if(loading){
        return(
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Checking session.....</p>
            </div>
        );
    }

    //If the backend replied but the user is empty, redirect to login
    if(!user){
        return <Navigate to="/login" replace />
    }

    //If we made it this far, the user is safely logged in! Render the requested page
    return children;
}

export default ProtectedRoute;