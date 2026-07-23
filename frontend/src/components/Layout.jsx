import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout(){
    return(
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* The Navbar spans the entire top width */}
            <Navbar />

            {/* The bottom section splits the screen left and right */}
            <div className="flex flex-1 overflow-hidden">
                {/* The sidebar is pinned to the left */}
                <Sidebar />

                {/* The outlet is the empty space on the right where pages render */}
                <main className="flex-1 overflow-y-auto p-6 text-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;