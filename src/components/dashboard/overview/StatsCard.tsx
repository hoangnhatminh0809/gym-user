import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({
  title = "Active Members",
  value = "1,234",
  trend = 12.5,
  icon = <ArrowUpIcon className="h-4 w-4" />,
  description = "Total active gym members",
}: StatsCardProps) => {
  const isPositiveTrend = trend >= 0;

  return (
    <Card className="w-[384px] h-[180px] bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="p-2 rounded-full bg-gray-100">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold">{value}</h2>
            <div
              className={`flex items-center space-x-1 ${isPositiveTrend ? "text-green-600" : "text-red-600"}`}
            >
              {isPositiveTrend ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
