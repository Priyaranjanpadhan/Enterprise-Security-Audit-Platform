import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assets from "./pages/Assets.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    {/* When the URL is "/", it puts this text inside the <outlet /> */}
                    <Route path="/" element={<Dashboard />}/>
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;