import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg }) => {
  return (
    <Card className="bg-white border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
