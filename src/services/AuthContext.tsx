import React, { createContext, useState, useEffect, ReactNode } from "react";
import { login, refreshToken, logout } from "./api";

interface AuthContextProps {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login({ username, password });
            const { access_token, refresh_token, user } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setIsAuthenticated(false);
        logout().catch((err) => console.error("Logout error", err));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login: handleLogin,
                logout: handleLogout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };