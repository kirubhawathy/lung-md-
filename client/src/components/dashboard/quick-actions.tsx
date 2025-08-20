import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const quickActions = [
    {
      id: "upload_report",
      title: "Upload Report",
      icon: "fas fa-upload",
      color: "medical-blue",
      action: () => console.log("Upload report clicked"),
    },
    {
      id: "new_transfer",
      title: "New Transfer",
      icon: "fas fa-exchange-alt",
      color: "medical-teal",
      action: () => console.log("New transfer clicked"),
    },
    {
      id: "send_message",
      title: "Send Message",
      icon: "fas fa-comments",
      color: "medical-green",
      action: () => console.log("Send message clicked"),
    },
    {
      id: "view_library",
      title: "Library",
      icon: "fas fa-book",
      color: "purple",
      action: () => console.log("View library clicked"),
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`flex flex-col items-center justify-center p-4 h-20 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 hover:from-${action.color}-100 hover:to-${action.color}-200 border-${action.color}-200 transition-all duration-200 transform hover:scale-105`}
              onClick={action.action}
            >
              <i className={`${action.icon} text-${action.color}-600 text-2xl mb-2`}></i>
              <span className="text-sm font-medium text-gray-900">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
