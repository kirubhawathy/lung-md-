import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { user } = useAuth();
  
  const { data: unreadNotifications } = useQuery({
    queryKey: ["/api/notifications/unread"],
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.firstName || user?.lastName) {
      return `Dr. ${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    }
    return user?.email?.split("@")[0] || "User";
  };

  const unreadCount = unreadNotifications?.length || 0;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center">
                <i className="fas fa-lungs text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PulmoMed</h1>
                <p className="text-xs text-gray-500">Pulmonary Medicine Dept.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-bell text-lg"></i>
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs rounded-full flex items-center justify-center animate-pulse-soft p-0"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === "consultant" ? "Consultant" : "Pulmonary Resident"}
                </p>
              </div>
              <div className="w-8 h-8 bg-medical-blue-500 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
