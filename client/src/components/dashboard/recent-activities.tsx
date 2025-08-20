import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RecentActivities() {
  const activities = [
    {
      id: "1",
      title: "Journal Club Session",
      description: "Latest research discussions",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      type: "journal",
    },
    {
      id: "2",
      title: "Ward Census Updated",
      description: "Real-time bed management",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      type: "census",
    },
    {
      id: "3",
      title: "New Consultations",
      description: "5 new cases assigned",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      type: "consultation",
    },
    {
      id: "4",
      title: "Reference Updated",
      description: "New guidelines available",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      type: "reference",
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Recent Department Activity</CardTitle>
          <Button variant="ghost" className="text-medical-blue-600 hover:text-medical-blue-700 text-sm font-medium">
            View All Activity <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="group cursor-pointer">
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" 
              />
              <div className="mt-3">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-medical-blue-600 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
