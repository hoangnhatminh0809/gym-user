import React, { createContext, useState, useEffect, ReactNode } from "react";
import { login, refreshToken, logout } from "./api";

interface AuthContextProps {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
});

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            // Kiểm tra token hết hạn hay chưa, giả sử token có thời gian hết hạn trong payload.
            const expiry = localStorage.getItem("token_expiry");
            if (expiry && new Date(expiry).getTime() > Date.now()) {
                setIsAuthenticated(true);
                // Lấy thông tin người dùng nếu cần
            } else {
                handleRefreshToken();
            }
        }
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login({ username, password });
            const { access_token, refresh_token, user } = response.data;

            const expiration = new Date(new Date().getTime() + 20 * 60 * 1000); // 20 phút hết hạn
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("token_expiry", expiration.toISOString());

            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleRefreshToken = async () => {
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
            try {
                const response = await refreshToken(refresh_token);
                const { access_token } = response.data;

                const expiration = new Date(new Date().getTime() + 20 * 60 * 1000); // 20 phút hết hạn
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("token_expiry", expiration.toISOString());

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to refresh token", error);
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
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
