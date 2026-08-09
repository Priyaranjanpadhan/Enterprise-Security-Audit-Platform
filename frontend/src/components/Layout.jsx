import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import React from "react";

function Layout(){
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    return(
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* The Navbar spans the entire top width */}
            {/* Pass the state to the Navbar so the hamburger button can change it. */}
            <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* The bottom section splits the screen left and right */}
            <div className="flex flex-1 overflow-hidden">
                {/* The sidebar is pinned to the left */}
                {/* Passing the state to the sidebar so it knows when to hide/show */}
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                {/* when click outside then hamburger shows up again, The millisecond isSidebarOpen becomes true:react instantly snaps the <div /> overlay into existence. */}
                {/* Because a state variable inside Layout.jsx changed, React says: "Hold on, the data changed! I need to re-evaluate this entire component layout right now."
                It runs the code inside Layout.jsx again from top to bottom. Because Layout.jsx contains the <Navbar /> and <Sidebar /> tags, it forces them to re-render as well. */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* The outlet is the empty space on the right where pages render */}
                <main className="flex-1 overflow-y-auto p-6 text-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;