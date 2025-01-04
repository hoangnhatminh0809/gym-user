import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardGrid from "../components/dashboard/overview/DashboardGrid";
import api from "@/services/api";
import { User } from "@/services/api";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react";
// import PurchaseButton from "./purchase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TrainingPackage {
  id: number;
  name: string;
  price: number;
}

interface TypePackage {
  id: number;
  name: string;
  duration: string;
  rate: number;
}

interface Membership {
  id: number;
  registration_time: string;
  expiration_time: string;
  user: number;
  package: number;
  type: number;
}

const Home = () => {
  const localUser = localStorage.getItem("user");

  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[] | null>([{
    id: 0,
    registration_time: "",
    expiration_time: "",
    user: 0,
    package: 0,
    type: 0
  }]);
  const [trainingPackage, setTrainingPackage] = useState<TrainingPackage[] | null>(null);
  const [typePackage, setTypePackage] = useState<TypePackage[] | null>(null);

  const getId = () => {
    if (localUser) {
      const data = JSON.parse(localUser);
      return data.id;
    }
    return null;
  };

  const fetchUser = async () => {
    try {
      const id = getId();
      if (id) {
        const response = await api.get('/user/api/users/' + id);
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrainingPackage = async () => {
    try {
      const response = await api.get('/membership/api/trainingpackages');
      setTrainingPackage(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTypePackage = async () => {
    try {
      const response = await api.get('/membership/api/typepackages');
      setTypePackage(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchMembership = async () => {
    try {
      const response = await api.get('/membership/api/user_memberships/');
      const data = (response.data.memberships);
      setMemberships(data);
    } catch (error) {
      console.error(error);
    }
  }

  const getTrainingPackageNameById = (id: number) => {
    if (trainingPackage) {
      const training = trainingPackage.find((t) => t.id === id);
      return training?.name;
    }
    return null;
  }

  const getTypePackageNameById = (id: number) => {
    if (typePackage) {
      const type = typePackage.find((t) => t.id === id);
      return type?.name;
    }
    return null;
  }

  useEffect(() => {
    fetchUser();
    fetchTrainingPackage();
    fetchTypePackage();
    fetchMembership();
    console.log(memberships);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="flex ml-32 mt-12">
          <Card className="w-[500px] flex flex-col gap-4">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://app.gak.vn/storage/uploads/VPuo8OZmYjBpuM7KKkWTbHUZcSwoGm8E3duTBTcS.png" />
                {/* <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback> */}
              </Avatar>
              <div className="flex flex-col text-bold text-3xl">
                <CardTitle>{user.username}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {/* {trainingPackage} */}
                </Badge>
              </div>
            </CardHeader>
            <div className="flex flex-col gap-4 ml-4">
              <CardContent>
                <div className="text-3xl font-bold">${user.balance}</div>
                <p className="text-2xl text-muted-foreground">Current Balance</p>
              </CardContent>
              {/* <CardContent>
              <div className="text-2xl font-bold">1 Month Package</div>
              <p className="text-xs text-muted-foreground">Current Package</p>
            </CardContent> */}
              <CardContent>
                <div className="text-2xl font-bold">Email</div>
                <p className="text-2xl text-muted-foreground">{user.email}</p>
              </CardContent>
              <CardContent>
                <div className="text-2xl font-bold">Full Name</div>
                <p className="text-2xl text-muted-foreground">{user.first_name + " " + user.last_name}</p>
              </CardContent>
              {memberships.map((membership) => (
                <Card key={membership.id} className="flex flex-row gap-12 pt-6 pl-8 mr-4">
                  <CardContent>
                    <div className="text-xs font-bold">Training Package</div>
                    <p className="text-l text-muted-foreground">{getTrainingPackageNameById(membership.package)}</p>
                  </CardContent>
                  <CardContent>
                    <div className="text-xs font-bold">Type Package</div>
                    <p className="text-l text-muted-foreground">{getTypePackageNameById(membership.type)}</p>
                  </CardContent>
                </Card>
              ))}
              {/* <CardContent>
                <div className="text-2xl font-bold">Full Name</div>
                <p className="text-2xl text-muted-foreground">{membership.registration_time}</p>
              </CardContent> */}
            </div>
            <CardFooter className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Purchase Package</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Choose packages</DialogTitle>
                    <DialogDescription>
                      Your money, your health, your choice.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Training Package
                      </Label>
                      <Input value={getTrainingPackageNameById(memberships[0].package)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Type Package
                      </Label>
                      <Input value={getTypePackageNameById(memberships[0].type)} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Purcharse</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
