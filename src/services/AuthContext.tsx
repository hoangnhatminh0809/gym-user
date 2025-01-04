import React, { createContext, useState, useEffect, ReactNode } from "react";
import { login, refreshToken, logout, register } from "./api";

interface AuthContextProps {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: RegisterData) => Promise<void>;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface RegisterData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => { },
    logout: () => { },
    register: async () => { },
    isAuthenticated: false,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login({ username, password });
            const { access_token, refresh_token, user } = response.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const handleRegister = async (data: RegisterData) => {
        try {
            await register(data);
            await handleLogin(data.username, data.password);
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const handleLogout = () => {
        logout()
            .then(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
            })
            .catch((err) => {
                console.error("Logout error:", err.response?.data || err.message);
                // Fallback: Clear local storage and state even if the request fails
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
            });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login: handleLogin,
                logout: handleLogout,
                register: handleRegister,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };