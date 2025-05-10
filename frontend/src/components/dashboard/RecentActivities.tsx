
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    user: "John Smith",
    action: "Checked in",
    time: "8:02 AM",
    date: "Today"
  },
  {
    id: 2,
    user: "Emily Johnson",
    action: "Checked in",
    time: "8:05 AM",
    date: "Today"
  },
  {
    id: 3,
    user: "Michael Brown",
    action: "Marked absent",
    time: "9:30 AM",
    date: "Today"
  },
  {
    id: 4,
    user: "Sarah Davis",
    action: "Checked in (Late)",
    time: "9:15 AM",
    date: "Today"
  },
  {
    id: 5,
    user: "David Wilson",
    action: "Schedule updated",
    time: "Yesterday",
    date: "2:30 PM"
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between border-b pb-2 last:border-0">
              <div>
                <p className="font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{activity.time}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
