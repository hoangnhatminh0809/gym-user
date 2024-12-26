import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Package, Calendar, Wrench } from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    icon: <Users className="h-4 w-4" />,
    label: "Add New Member",
    onClick: () => console.log("Add member clicked"),
  },
  {
    icon: <Package className="h-4 w-4" />,
    label: "Create Package",
    onClick: () => console.log("Create package clicked"),
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: "Schedule Class",
    onClick: () => console.log("Schedule class clicked"),
  },
  {
    icon: <Wrench className="h-4 w-4" />,
    label: "Log Maintenance",
    onClick: () => console.log("Log maintenance clicked"),
  },
];

const QuickActions = ({ actions = defaultActions }: QuickActionsProps) => {
  return (
    <Card className="w-full h-[300px] bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
