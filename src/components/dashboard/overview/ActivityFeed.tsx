import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ActivityItem = {
  id: string;
  type: "member" | "training" | "resource" | "schedule";
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
};

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    type: "member",
    title: "New Member Registration",
    description: "Sarah Johnson completed registration",
    timestamp: "5 minutes ago",
    user: {
      name: "Admin User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  },
  {
    id: "2",
    type: "training",
    title: "Training Package Updated",
    description: 'Modified "Premium Fitness Package"',
    timestamp: "1 hour ago",
    user: {
      name: "John Trainer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trainer",
    },
  },
  {
    id: "3",
    type: "resource",
    title: "Equipment Maintenance",
    description: "Treadmill #3 scheduled for maintenance",
    timestamp: "2 hours ago",
    user: {
      name: "Maintenance Staff",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maintenance",
    },
  },
];

const getActivityColor = (type: ActivityItem["type"]) => {
  const colors = {
    member: "bg-blue-100 text-blue-800",
    training: "bg-green-100 text-green-800",
    resource: "bg-yellow-100 text-yellow-800",
    schedule: "bg-purple-100 text-purple-800",
  };
  return colors[type];
};

const ActivityFeed = ({
  activities = defaultActivities,
}: ActivityFeedProps) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-gray-500">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={getActivityColor(activity.type)}
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {activity.user.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
