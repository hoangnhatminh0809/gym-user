import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from "../services/api";
import { useState, useEffect } from "react";
import { set } from "date-fns";

interface Feedbacks {
    id: number;
    message: string;
    employee_id: number;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

const Feedbacks = () => {

    const [feedback, setFeedback] = useState<Feedbacks>({
        id: 0,
        message: "",
        employee_id: 0
    });
    const [newFeedback, setNewFeedback] = useState<Feedbacks | null>({
        id: 0,
        message: "",
        employee_id: 0
    });
    const [message, setMessage] = useState<string>("");
    const [employee_id, setEmployee_id] = useState<number>(0);
    const [users, setUsers] = useState<User[] | null>(null);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user/api/users/");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const getEmployeeNameById = (id: number) => {
        if (users) {
            const user = users.find(user => user.id === id);
            if (user) {
                return user.username;
            }
        }
        return "";
    }

    const handleSendFeedback = async () => {
        try {
            const feedback = {
                message,
                employee_id
            };
            await api.post('/user/api/feedbacks/', feedback);
            // Handle success (e.g., show a success message, clear the form, etc.)
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <div className="p-[10rem]">
                    <Card className="w-[80rem]">
                        <CardHeader>
                            <CardTitle>Feedbacks</CardTitle>
                            <CardDescription>Send feedback to Admin</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="message">Message</Label>
                                        <Input id="message" placeholder="Write your feedback message here" onChange={(e) => setMessage(e.target.value)} />
                                    </div>
                                    {/* <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="employee_id">Employee ID</Label>
                                        <Input className="w-1/2" id="employee_id" type="number" placeholder="Enter the fucking employee ID" onChange={(e) => setEmployee_id(parseInt(e.target.value))} />
                                    </div> */}
                                    <div className="w-1/2">
                                        <Select onValueChange={(value) => setEmployee_id(parseInt(value))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an employee">
                                                    {employee_id ? getEmployeeNameById(employee_id) : "Select an employee"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {users?.map(user => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>{user.username}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={() => handleSendFeedback()}>Submit</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Feedbacks;