import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipType: string;
  status: "active" | "inactive";
  joinDate: string;
}

const Member = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader/>
      </div>
    </div>
  );
};

export default Member;
