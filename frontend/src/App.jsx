import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"

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
                    <Route path="/" element={
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p>Welcome to the main content area.</p>
                        </div>
                    }/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;