import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  wardId?: string;
}

interface EquipmentStatusProps {
  equipment: Equipment[];
}

export default function EquipmentStatus({ equipment }: EquipmentStatusProps) {
  const getEquipmentByType = (type: string) => {
    return equipment.filter(e => e.type === type);
  };

  const getOperationalCount = (type: string) => {
    return equipment.filter(e => e.type === type && e.status === "operational").length;
  };

  const getTotalCount = (type: string) => {
    return equipment.filter(e => e.type === type).length;
  };

  const getStatusColor = (type: string) => {
    const operational = getOperationalCount(type);
    const total = getTotalCount(type);
    const percentage = total > 0 ? (operational / total) * 100 : 0;
    
    if (percentage >= 90) return "medical-green";
    if (percentage >= 75) return "medical-blue";
    if (percentage >= 50) return "yellow";
    return "red";
  };

  const equipmentTypes = [
    { type: "ventilator", name: "Ventilators", icon: "fas fa-wind", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" },
    { type: "monitor", name: "Monitors", icon: "fas fa-tv", image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" },
    { type: "oxygen_system", name: "Oxygen Systems", icon: "fas fa-lungs", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" },
    { type: "maintenance", name: "Maintenance", icon: "fas fa-tools", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Medical Equipment Status</CardTitle>
          <Button variant="ghost" className="text-medical-blue-600 hover:text-medical-blue-700 text-sm font-medium">
            Maintenance Schedule <i className="fas fa-calendar ml-1"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {equipmentTypes.map((equipmentType) => {
            const operational = getOperationalCount(equipmentType.type);
            const total = getTotalCount(equipmentType.type);
            const statusColor = getStatusColor(equipmentType.type);
            
            // Special handling for maintenance
            if (equipmentType.type === "maintenance") {
              const maintenanceCount = equipment.filter(e => e.status === "maintenance").length;
              
              return (
                <div key={equipmentType.type} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <img 
                    src={equipmentType.image} 
                    alt={equipmentType.name} 
                    className="w-full h-20 object-cover rounded-lg mb-3" 
                  />
                  <p className="font-semibold text-gray-900">{equipmentType.name}</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className={`w-2 h-2 bg-yellow-500 rounded-full ${maintenanceCount > 0 ? 'animate-pulse' : ''}`}></span>
                    <span className="text-sm text-gray-600">{maintenanceCount} Scheduled</span>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={equipmentType.type} className={`text-center p-4 bg-gradient-to-br from-${statusColor}-50 to-${statusColor}-100 rounded-lg`}>
                <img 
                  src={equipmentType.image} 
                  alt={equipmentType.name} 
                  className="w-full h-20 object-cover rounded-lg mb-3" 
                />
                <p className="font-semibold text-gray-900">{equipmentType.name}</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className={`w-2 h-2 bg-${statusColor}-500 rounded-full`}></span>
                  <span className="text-sm text-gray-600">
                    {total === 0 ? "All Operational" : `${operational}/${total} Active`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
