import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/services/AuthContext";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { login, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 

        try {
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <form onSubmit={handleSubmit}>
                <Card className="mx-auto max-w-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email and password to login to <br /> your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default Login;
