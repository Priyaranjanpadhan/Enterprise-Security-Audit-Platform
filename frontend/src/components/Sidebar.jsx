import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Sidebar(){
    const{user} = useAuth();
    //useLocation() constantly monitors the address bar at the top of your web browser. The pathname is specifically the part of the URL after the domain name.
    const location = useLocation();

    function getLinkClass(path){
        //http://localhost:5173/audit-logs into your browser, location.pathname automatically becomes exactly "/audit-logs".
        if(location.pathname === path){
            return "block px-4 py-2 rounded text-white bg-blue-600 font-medium"
        }
        return "block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    }

    return(
        <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                Menu
            </div>

            {/* <Link> tag is a special tool from React Router. It overrides the default browser behavior. When you click it, it tells React: "Do not refresh the page! Just instantly swap out the Dashboard component for the Assets component." */}
            {/* you use an anchor tag like <a href="/assets">. When you click it, the browser wipes the screen white, contacts the server, and downloads a whole new HTML page. */}
            <ul className="space-y-2">
                <li>
                    <Link to="/" className={getLinkClass("/")}>
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/assets" className={getLinkClass("/assets")}>
                        IT Assets
                    </Link>
                </li>

                <li>
                    <Link to="/audit-logs" className={getLinkClass("/audit-logs")}>
                        Audit Logs
                    </Link>
                </li>

                <li>
                    <Link to="/report" className={getLinkClass("/report")}>
                        Report Event
                    </Link>
                </li>

                <li>
                    <Link to="/profile" className={getLinkClass("/profile")}>
                        My Profile
                    </Link>
                </li>

                {/* Security check: Only show admin panel if user is role 1 admin  */}
                {user?.role_id === 1 && (
                    //I use a empty tag because whenever we try to use a if condition we can send only one tag and here two tags so we wrap them in a empty tag to make it one tag and 
                    // we can't use a div, if we do we will have a useless div to take care of
                    <>
                        <div className="mt-8 mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Administration
                        </div>
                        <li>
                            <Link to="/manage-users" className={getLinkClass("/manage-users")}>
                                Admin Panel
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default Sidebar;