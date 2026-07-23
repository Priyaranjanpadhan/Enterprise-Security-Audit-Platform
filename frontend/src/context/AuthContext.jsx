import React, { children, useContext } from "react";
import api from "../services/api";

//create the context
const AuthContext = React.createContext();

//creating he provider component
//context makes a global variable type thing instead of moving around from files to files we have a context
//children is a special React keyword representing whatever is placed inside the opening and closing tags of a component. In main.jsx, <App/> becomes the children.
//<App/> inside the Provider, we are taking our entire town (the App) and connecting it to the Power Station. Now, every single component inside the App has the potential to access the broadcasted data.
export const AuthProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);//prevents the app from flashing before checking auth

    //useEffect will run exactly once, the millisecond the website opens.
    //A user was logged in yesterday and closed their laptop. Today, they type localhost:5173 into their browser and hit Enter. Before the screen even finishes painting the colors, this function fires, checks their session cookie, and logs them in automatically so they skip the Login page entirely. 
    React.useEffect(() => {
        const checkUser = async() => {
            try{
                const response = await api.get("/user/profile");
                setUser(response.data);
            } catch(err){
                setUser(null);//if it fails it just means they aren't logged in
            } finally{
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    //helper function to log a user in and update the global state
    //When we build the Login.jsx page, the user will type admin@company.com and password123. When they click the button, Login.jsx will send those details to your Express server. Express checks PostgreSQL, verifies the password, and replies with: { id: 1, name: "Priya", role_id: 1 }.
    //Login.jsx will then take that data and feed it into this function by calling login(response.data). Now, the global bubble knows exactly who is using the app.
    const login = (userData) => {
        setUser(userData);
    };

    //Helper function to log out, destroy the cookie, and clear the data
    const logOut = async() => {
        try{
            await api.post("/auth/logout");
            setUser(null);
        } catch(err){
            console.error("Failed to log out", err);
        }
    };

    return (
        //Everything you put inside that value bracket is being actively broadcasted to the rest of the application.
        <AuthContext.Provider value={{user, loading, login, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

//Creating a custom hook so other files can easily use this data
export const useAuth = () => {
    return useContext(AuthContext);
}
