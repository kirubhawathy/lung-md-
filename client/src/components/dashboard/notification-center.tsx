import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

export default function NotificationCenter({ notifications }: NotificationCenterProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency": return "fas fa-exclamation-triangle";
      case "info": return "fas fa-info-circle";
      case "warning": return "fas fa-exclamation-circle";
      case "success": return "fas fa-check-circle";
      default: return "fas fa-bell";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "emergency": return "red";
      case "info": return "blue";
      case "warning": return "yellow";
      case "success": return "green";
      default: return "gray";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hours ago`;
  };

  // Show sample notifications if none exist
  const displayNotifications = notifications.length > 0 ? notifications : [
    {
      id: "1",
      title: "Emergency Admission",
      message: "Patient transferred to ICU - requires immediate attention",
      type: "emergency",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "2",
      title: "Biopsy Report Ready",
      message: "Patient ID: 12345 - Results available for review",
      type: "info",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "3",
      title: "CME Session Tomorrow",
      message: "Pulmonary Rehabilitation - Conference Room A",
      type: "success",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Notifications</CardTitle>
          <Button variant="ghost" className="text-medical-blue-600 hover:text-medical-blue-700 text-sm">
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayNotifications.slice(0, 5).map((notification) => {
            const color = getNotificationColor(notification.type);
            const icon = getNotificationIcon(notification.type);
            
            return (
              <div key={notification.id} className={`flex space-x-3 p-3 bg-${color}-50 border border-${color}-100 rounded-lg animate-slide-up hover:bg-${color}-100 transition-colors cursor-pointer`}>
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <i className={`${icon} text-${color}-600 text-sm`}></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.createdAt)}</p>
                </div>
              </div>
            );
          })}
          
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-bell-slash text-4xl text-gray-300 mb-2"></i>
              <p>No unread notifications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
